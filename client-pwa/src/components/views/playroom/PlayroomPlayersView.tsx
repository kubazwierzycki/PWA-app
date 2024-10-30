import {ReactNode} from "react";
import {alpha, Avatar, Box, Card, Grid, IconButton, Typography} from "@mui/material";
import { buildSkipOwnMoveMessage, PlayroomPlayer, TimerType } from "../../../services/playroom";
import TimerView from "./TimerView";
import styles from '../../../styles/playroomPlayersView.module.css'
import AcUnitIcon from '@mui/icons-material/AcUnit';
import { useWebSocketContext } from "../../../contexts/WebSocketContext";


/**
 * View component showing players who have joined the room
 * @param {PlayroomPlayer[]} players - list of players in playroom
 * @returns {ReactNode}
 */
const PlayroomPlayersView = ({players, paused, currentPlayer, code, playerId}: 
        {players : PlayroomPlayer[],
         paused : boolean,
         currentPlayer: number,
         code: string,
         playerId: string,
        })
        : ReactNode => {
    
    const {sendJsonMessage} = useWebSocketContext();

    const isTimerPaused = (queueNumber : number): boolean =>{
        if(paused){
            return true;
        } else{
            return (currentPlayer !== queueNumber)
        }
    }

    const isActivePlayer = (queueNumber : number): boolean =>{
        return (currentPlayer === queueNumber) ? true :  false
    }

    const handleSkip = () =>{
        sendJsonMessage(buildSkipOwnMoveMessage(code, 1))
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
                                (theme) => `${theme.palette.divider}`
                                : null
                            }}
                              >
                                <Grid item xs={5} sx={{alignItems:"center", display:"flex", justifyContent:"flex-start"}}>
                                    <Avatar/>
                                    <Typography variant="subtitle2" sx={{ml: "10px"}}>
                                         {player.name}&nbsp;
                                    </Typography>
                                    {player.playerId === playerId ?
                                    <IconButton 
                                            aria-label="skipTurn" 
                                            onClick={handleSkip}
                                            >
                                            <AcUnitIcon></AcUnitIcon>
                                        </IconButton> : null}
                               </Grid>
                                <Grid item xs={6} sx={{alignItems:"center", display:"flex", justifyContent:"flex-end"}}>
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
