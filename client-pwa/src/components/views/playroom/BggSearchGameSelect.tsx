import {alpha, Box,FormControlLabel,Grid,InputBase, List, styled, Switch, Tooltip } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import React, {Dispatch, ReactNode, SetStateAction, useEffect, useState} from "react";
import bggService, { BggGameFromXML } from "../../../services/bgg"
import axios from "axios";
import BoardGameSearchResult from "../../BoardGameSearchResult"
import { useAuth } from "../../../contexts/AuthContext";


const Search = styled('div')(({theme}) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({theme}) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({theme}) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '100%',
        },
    },
}));


interface SearchSelectProps {
    name:string
    setName: Dispatch<SetStateAction<string>>
    choice: string
    setChoice: Dispatch<SetStateAction<string>>
}

/**
 * View presenting searchbar functionality as means of choosing game to play in a playroom
 * (Alternative to wizard choice)
 * @param {Dispatch<SetStateAction<string>>} setName - callback for game choice info
 * @param {string} choice - id of chosen game
 * @param {Dispatch<SetStateAction<string>>} setChoice - id of chosen game change callback
 * @returns {ReactNode}
 */
const BggSearchGameSelect = ({name, setName, setChoice}: SearchSelectProps): ReactNode => {

    const [input, setInput] = useState<string>("");

    const {user} = useAuth();
    const [selectedIndex, setSelectedIndex] = useState(-1);

    const [bggGamesFromXML, setBggGamesFromXML] = useState<BggGameFromXML[] | null>(null);
    const [playerCollection, setPlayerCollection] =  useState<BggGameFromXML[] | null>(null);
    const [usePlayerCollection, setUsePlayerCollection] = useState<boolean>(false);

        
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInput(event.currentTarget.value);
    }

    const handleUsePlayerCollection = (event : React.ChangeEvent<HTMLInputElement>) => {
        setUsePlayerCollection(event.target.checked);

    }


    useEffect(()=>{
        // elminate race condition
        const controller = new AbortController();

        const fetchBggGamesByPattern = async() =>{
            try {
                let XML = "";
                let bggGamesFromXML : BggGameFromXML[] = [];
                if(usePlayerCollection) {
                    if(playerCollection == null) {
                        XML = await bggService.getPlayeCollectionXML(user.bggUsername, controller.signal);
                        bggGamesFromXML = await  bggService.getAllGamesFromCollectionXML(XML);
                        setPlayerCollection(bggGamesFromXML);
                    } else {
                        bggGamesFromXML = playerCollection;
                    }
                    
                    const regexp = new RegExp(`.*${input}.*`, "ig");
                    bggGamesFromXML = bggGamesFromXML.filter(g => regexp.test(g.name));
                } else {
                    XML = await bggService.getBggGamesXMLByPatten(input, controller.signal);
                    bggGamesFromXML = await bggService.getAllGamesFromXML(XML);
                }

                setBggGamesFromXML(bggGamesFromXML);
                setSelectedIndex(bggGamesFromXML.findIndex(game => game.name == name))
            } catch(err) {
                if (axios.isAxiosError(err)) {
                    switch (err.code) {
                        default:
                            console.log(err.code)
                            break;
                    }
                }
            }
        }

        if(input.length >= 3){
            fetchBggGamesByPattern();
        }

        return () => controller.abort();
    }, [input, usePlayerCollection])

    return (
        <Box style={{height: "100%"}}>
            <Grid container sx={{
                    justifyContent: "flex-start",
                    alignItems: "flex-start",
                }}>
                <Grid item xs={7}>
                    <Search>
                        <SearchIconWrapper>
                            <SearchIcon />
                        </SearchIconWrapper>
                      
                        <Tooltip
                            placement="top-start"
                            enterDelay={500} leaveDelay={200}
                            title={input.length < 3 ?"Type at least 3 characters" : ""}
                        >
                       
                        <StyledInputBase
                            placeholder="Search…"
                            inputProps={{ 'aria-label': 'search' }}
                            value={input}
                            onChange={handleInputChange}
                        />
                         </Tooltip>
                    </Search>
                </Grid>
                <Grid item xs={5} sx={{textAlign:"right"}}> 
                    <FormControlLabel control={
                        <Switch checked={usePlayerCollection} onChange={handleUsePlayerCollection} />
                    } label="My collection" />
                </Grid>
            </Grid>
            {
            bggGamesFromXML ? 
            <List sx={{
                width: '100%',
                bgcolor: 'background.paper',
                position: 'relative',
                overflow: 'auto',
                maxHeight: 250,
            }}>
             {bggGamesFromXML.map((game,index) => 
                <BoardGameSearchResult
                    setName={setName}
                    game={game}
                    isSelected={selectedIndex===index}
                    index={index}
                    setSelectedIndex={setSelectedIndex}
                    setChoice={setChoice}
                    input={input}
                />
             )}
            </List> : null
            }
        </Box>
    )
}

export default BggSearchGameSelect;
