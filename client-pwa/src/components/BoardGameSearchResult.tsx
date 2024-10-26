import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { BggGameDetailsFromXML, BggGameFromXML } from "../services/bgg";
import { alpha, Collapse, Divider, List, ListItem, ListItemButton, ListItemText, styled, Typography } from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import bggService from "../services/bgg"
import BoardGameSearchDetails from "./BoardGameSearchDetails";
import { usePlayroomContext } from "../contexts/PlayroomContext";



// eslint-disable-next-line @typescript-eslint/no-unused-vars
const MyListItemButton= styled(ListItemButton)(({theme}) => ({
    '&:hover': {
        backgroundColor: "transparent"
    },
}));


const MyListItem= styled(ListItem)(({theme}) => ({
    '&:hover': {
            backgroundColor: alpha(theme.palette.common.black, 0.05),
        },
}));

interface BoardGameSearchResultProps {
    isSelected: boolean
    setSelectedIndex: Dispatch<SetStateAction<number>>
    index: number
    setName: Dispatch<SetStateAction<string>>
    game: BggGameFromXML
    setChoice: Dispatch<SetStateAction<string>>
    input: string
}


const BoardGameSearchResult = ({isSelected,index,setSelectedIndex,setName,game,setChoice,input} 
    : BoardGameSearchResultProps) =>{

    const [open, setOpen]= useState(false);
    
    const handleClick = async () => {
        if(open === false) {
            const gameDetailsXML = await bggService.getGameDetails(game.id)
            const bggGameDetailsFromXML = await bggService.getGameDetailsFromXML(gameDetailsXML)
            setBggGameDetailsFromXML(bggGameDetailsFromXML);
        }
        setOpen(!open);
    };


    const [bggGameDetailsFromXML, setBggGameDetailsFromXML] = useState<BggGameDetailsFromXML | null>();
    const {setThumbnailSrc} = usePlayroomContext();


    const handleListItemClick = async () => {
        setName(game.name);
        setSelectedIndex(index);
        
        setChoice(game.id)
        const gameDetailsXML = await bggService.getGameDetails(game.id)
        const bggGameDetailsFromXML = await bggService.getGameDetailsFromXML(gameDetailsXML)
        setBggGameDetailsFromXML(bggGameDetailsFromXML);
        setThumbnailSrc(bggGameDetailsFromXML.thumbnail);
    }

    useEffect(()=>{
        setOpen(false)
    }, [input])

    return(
        <>
            <MyListItem key={game.name} disablePadding>
            <MyListItemButton
                disableGutters
                selected={isSelected}
                onClick={handleListItemClick}
                sx={{pl:2}}
            >
                <ListItemText primary={<Typography variant="h6">{game.name}</Typography>}/>
            </MyListItemButton>
            {open ? <ExpandLess onClick={handleClick} /> : <ExpandMore onClick={handleClick}/>}
            </MyListItem>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                {bggGameDetailsFromXML ? 
                    <BoardGameSearchDetails details={bggGameDetailsFromXML}/> : null
                }
                </List>
            </Collapse>
            <Divider/>
        </>
    )
}
export default BoardGameSearchResult;
