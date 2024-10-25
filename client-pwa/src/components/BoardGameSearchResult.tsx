import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { BggGameFromXML } from "../services/bgg";
import { alpha, Collapse, Divider, List, ListItem, ListItemButton, ListItemText, styled, Typography } from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";


interface BoardGameSearchResultProps {
    isSelected: boolean
    setSelectedIndex: Dispatch<SetStateAction<number>>
    index: number
    setName: Dispatch<SetStateAction<string>>
    game: BggGameFromXML
    setChoice: Dispatch<SetStateAction<string>>
    input: string
}


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


const BoardGameSearchResult = ({isSelected, index, setSelectedIndex, setName, game, input } : BoardGameSearchResultProps) =>{

    const [open, setOpen]= useState(false);
    const handleClick = () => {
        setOpen(!open);
    };

    const handleListItemClick = () => {
        setName(game.name);
        setSelectedIndex(index);
    }

    useEffect(()=>{
        setOpen(false)
    }, [input])

    return(
        <>
            <MyListItem key={game.name} disablePadding>
            <MyListItemButton
                selected={isSelected}
                onClick={handleListItemClick}
            >
                <ListItemText primary={<Typography variant="h6">{game.name}</Typography>}/>
            </MyListItemButton>
            {open ? <ExpandLess onClick={handleClick} /> : <ExpandMore onClick={handleClick}/>}
            </MyListItem>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding sx={{ml:2}}>
                    <ListItemText primary={game.name + " ... game details ..."} />
                </List>
            </Collapse>
            <Divider/>
        </>
    )
}
export default BoardGameSearchResult;
