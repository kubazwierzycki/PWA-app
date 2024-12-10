import {ReactNode} from "react";
import {Avatar, Box, Card, Grid, IconButton, Typography} from "@mui/material";
import {PlayroomPlayer} from "../../../services/playroom";
import styles from '../../../styles/playroomPlayersView.module.css'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

/*
 * View component showing players who have joined the room
 * @param {PlayroomPlayer[]} playersToEdit - list of players in playroom
 * @returns {ReactNode}
 */

const PlayroomPlayersEditView = ({playersToEdit, setPlayersToEdit}: 
    {playersToEdit : PlayroomPlayer[], setPlayersToEdit : React.Dispatch<React.SetStateAction<PlayroomPlayer[]>>})
    : ReactNode => {


    const handleMoveUp = (index : number) =>{
        const clonedPlayers: PlayroomPlayer[] = [...playersToEdit];
        const temp : PlayroomPlayer = clonedPlayers[index + 1];
        clonedPlayers[index + 1] = clonedPlayers[index];
        clonedPlayers[index] = temp;
        setPlayersToEdit(clonedPlayers);
    }

    const handleMoveDown = (index : number) =>{
        const clonedPlayers: PlayroomPlayer[] = [...playersToEdit];
        const temp : PlayroomPlayer = clonedPlayers[index - 1];
        clonedPlayers[index - 1] = clonedPlayers[index];
        clonedPlayers[index] = temp;
        setPlayersToEdit(clonedPlayers);
    }

    return (
        <Card sx={{borderRadius: "20px"}}>
            <Box>
                {playersToEdit.map((player, index) => 
                        <Grid container className={styles.playerContainer} key={player.playerId}>
                            <Grid item xs={6} sx={{alignItems:"center", display:"flex", justifyContent:"flex-start"}}>
                                <Avatar/>
                                <Typography variant="subtitle2" sx={{ml: "10px"}}>
                                        {player.name}&nbsp;
                                </Typography>
                            </Grid>
                            <Grid item xs={5} sx={{alignItems:"center", display:"flex", justifyContent:"flex-end"}}>
                                <IconButton disabled={index === playersToEdit.length - 1} color="primary" onClick={() => handleMoveUp(index)}><KeyboardArrowDownIcon/></IconButton>
                                <IconButton disabled={index === 0} color="primary" onClick={() => handleMoveDown(index)}><KeyboardArrowUpIcon/></IconButton>
                            </Grid>
                            <Grid item xs={1}></Grid>
                        </Grid>
                    )
                }
            </Box>
        </Card>
    )
}

export default PlayroomPlayersEditView;
