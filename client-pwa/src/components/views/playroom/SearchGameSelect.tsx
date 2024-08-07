import {alpha, InputBase, styled, Typography} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import React, {Dispatch, ReactNode, SetStateAction, useState} from "react";
import {useBoardgamesContext} from "../../../contexts/BoardgamesContext.tsx";
import {BoardGameStub} from "../../../types/IBoardgames.ts";
import GameSearchResult from "./GameSearchResult.tsx";


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
const SearchGameSelect = ({setName, choice, setChoice}: SearchSelectProps): ReactNode => {

    // user games available from context
    const {games} = useBoardgamesContext();

    // search bar current input
    const [input, setInput] = useState<string>("");

    const [results, setResults] = useState<BoardGameStub[]>([] as BoardGameStub[]);

    // finds games that contain part of input name
    const searchInGames = () => {
        setResults(
            games.filter(value =>
                value.name["#text"]
                    .toLowerCase()
                    .includes(input.toLowerCase())
            )
        );
    }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        // change input state
        setInput(event.currentTarget.value);
        // update results
        searchInGames();
    }

    return (
        <div style={{height: "100%"}}>
            <Search>
                <SearchIconWrapper>
                    <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                    placeholder="Search…"
                    inputProps={{ 'aria-label': 'search' }}
                    value={input}
                    onChange={handleInputChange}
                />
            </Search>
            <div style={{height: "85%", overflowY: "auto", boxSizing: "border-box"}}>
                {
                    results.length === 0 ?
                        <Typography width="100%" textAlign="center">
                            No results
                        </Typography>
                        :
                        results.map(game => (
                            <GameSearchResult
                                game={game}
                                key={game.name["#text"]}
                                choice={choice}
                                setChoice={setChoice}
                                setName={setName}
                            />
                        ))
                }
            </div>
        </div>
    )
}

export default SearchGameSelect;
