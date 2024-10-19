import {ReactNode} from "react";
import {Avatar, Box, Card, Grid, Typography} from "@mui/material";
import { PlayroomPlayer, TimerType } from "../../../services/playroom";
import TimerView from "./TimerView";
import styles from '../../../styles/playroomPlayersView.module.css'
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

    const isActivePlayer = (queueNumber : number): boolean =>{
        return (currentPlayer === queueNumber) ? true:  false
    }


    return (
        <Card sx={{borderRadius: "20px"}}>
            <Box>
                {
                    players.map(player => {
                        return (
                            <Grid container
                            className={styles.playerContainer}
                            sx={{backgroundColor: isActivePlayer(player.queueNumber) ?
                                (theme) => `${theme.palette.background.player}`
                                : null
                            }}
                              >
                                <Grid item xs={6} sx={{alignItems:"center", display:"flex", justifyContent:"flex-start"}}>
                                    <Avatar/>
                                    <Typography variant="subtitle2" sx={{ml: "10px"}}>
                                         {player.name}&nbsp;
                                    </Typography>
                               </Grid>
                                <Grid item xs={5} sx={{alignItems:"center", display:"flex", justifyContent:"flex-end"}}>
                                    {(player.timer !== null) ? 
                                    <TimerView paused={isTimerPaused(player.queueNumber)}
                                        timer={player.timer}
                                        key={player.name}
                                        timerType={TimerType.MS}
                                        variant="subtitle2"
                                    /> : null
                                    }
                                    </Grid>
                                    <Grid item xs={1}></Grid>
                                </Grid>
                        )
                    })
                }
            </Box>
        </Card>
    )
}

export default PlayroomPlayersView;
