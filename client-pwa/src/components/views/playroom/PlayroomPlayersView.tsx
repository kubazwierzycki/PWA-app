import {ReactNode} from "react";
import {Avatar, Box, Card, Grid, Typography} from "@mui/material";
import { PlayroomPlayer } from "../../../services/playroom";
import TimerView from "./TimerView";
import { blue } from "@mui/material/colors";


/**
 * View component showing players who have joined the room
 * @param {PlayroomPlayer[]} players - list of players in playroom
 * @returns {ReactNode}
 */
const PlayroomPlayersView = ({players, paused, currentPlayer}: 
        {players : PlayroomPlayer[],
         paused : boolean,
         currentPlayer: number,
        })
        : ReactNode => {
    
    const isTimerPaused = (queueNumber : number): boolean =>{
        if(paused){
            return true;
        } else{
            return (currentPlayer !== queueNumber)
        }
    }

    //color for current player
    const getAvatarColor = (queueNumber : number): string =>{
        if(currentPlayer === queueNumber) {
            return blue[500];
        } else {
            return blue[100];
        }
    }

    return (
        <Card sx={{borderRadius: "20px"}}>
            <Box>
                {
                    players.map(player => {
                        return (
                            <Card sx={{marginTop: "10px", padding: "5px"}} key={player.name}>
                            <Grid container>
                                <Grid item xs={6}>
                                <Box display="flex" justifyContent="flex-start" >
                                    <Avatar sx={{ bgcolor: getAvatarColor(player.queueNumber) }}/>
                                    <Typography sx={{marginLeft: "10px"}}>
                                         {player.name}&nbsp;
                                    </Typography>
                                </Box>
                               </Grid>
                                <Grid item xs={5}>
                                    <Box display="flex" justifyContent="flex-end">
                                    {(player.timer !== null) ? 
                                    <TimerView paused={isTimerPaused(player.queueNumber)}
                                        timer={player.timer}
                                        key={player.name}
                                        hiddenButtons={true}
                                    />
                                    : null
                                    }
                                    </Box>
                                    </Grid>
                                </Grid>
                                <Grid item xs={1}></Grid>
                            </Card>
                        )
                    })
                }
            </Box>
        </Card>
    )
}

export default PlayroomPlayersView;
