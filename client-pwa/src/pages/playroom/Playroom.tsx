import { Alert, AlertTitle, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from "@mui/material";
import {ReactNode, useEffect, useState} from "react";
import { useWebSocketContext } from "../../contexts/WebSocketContext";
import { buildConfirmOperation, PlayroomPlayer, buildEndGameMessage, buildEndTurnMessage, buildPauseGameMessage, buildStartGameMessage, SimpleMessage, ConfirmOperationMessage, PlayroomMessage, ConfirmOperationAlert, buildQuitPlayroomMessage } from "../../services/playroom";
import Grid from '@mui/material/Grid';
import { usePlayroomContext } from "../../contexts/PlayroomContext";
import TimerView from "../../components/views/playroom/TimerView";
import PlayroomPlayersView from "../../components/views/playroom/PlayroomPlayersView";
import styles from '../../styles/playroom.module.css'
import { useNavigate } from "react-router-dom";



/**
 * Playroom
 * @returns {ReactNode}
 */
const Playroom = (): ReactNode => {

    const { sendJsonMessage, lastJsonMessage, setSocketUrl} = useWebSocketContext();
    const {username, code, setCode, timer, gameImgSrc} = usePlayroomContext();
    const [isCurrentPlayer, setIsCurrentPlayer] = useState<boolean>(false);
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [confirmOperationAlert, setConfirmOperationAlert] = useState<ConfirmOperationAlert>({
        operationId : "",
        question : "",
    });
    
    const [gameState, setGameState] = useState<PlayroomMessage>({
        type: "init",
        timer : timer,
        paused : true,
        game : {gameID: 0, name: ""},
        currentPlayer : 1,
        players : [],
        ended : false,
        hostId : "",
    });

    // actions performed for a given message type
    useEffect(() => {
        if (lastJsonMessage) {
            const messageType : string = (lastJsonMessage as SimpleMessage).type;
            switch(messageType){
                case "playroom": {
                    const playroomMessage : PlayroomMessage = (lastJsonMessage as PlayroomMessage);
                    setGameState(playroomMessage);
                    console.log(playroomMessage);
                    
                    const players : PlayroomPlayer[]  = playroomMessage.players;
                    const player : PlayroomPlayer | undefined = players.find(p => p.name === username);
                    if(player !== undefined){
                        player.queueNumber === playroomMessage.currentPlayer 
                            ? setIsCurrentPlayer(true)
                            : setIsCurrentPlayer(false)
                    }

                    if(playroomMessage.ended){
                        setTimeout(()=> {setSocketUrl(null);}, 4000);
                        setCode("");
                    }

                    break;
                }
                case "confirmOperation": {
                    const confirmOperationMessage : ConfirmOperationMessage = (lastJsonMessage as ConfirmOperationMessage);
                    console.log("confirmOperation");
                    setConfirmOperationAlert({
                        operationId : confirmOperationMessage.operationId,
                        question : confirmOperationMessage.question,
                    });
                    setOpen(true);
                    setTimeout(() => {
                        setOpen(false);
                      }, 5000);
                    break;
                }
                default: {
                    console.log("Unknown message type");
                    break;
                }
            }
        } else{
            navigate("/");
        }
    }, [lastJsonMessage]);

    // closes alert
    const handleQuitPlayroom = () => {
            setCode("");
            sendJsonMessage(buildQuitPlayroomMessage(code));
            setSocketUrl(null);
        };

    // closes alert
    const handleClose = () => {
        setOpen(false);
      };
    // operation agreed by user
    const handleAgreeEndGame = () => {
        handleClose();
        sendJsonMessage(buildConfirmOperation(code, confirmOperationAlert.operationId))
    }

    const handleStartGame = () => {
        sendJsonMessage(buildStartGameMessage(code))
    }

    const handlePauseGame = () => {
        sendJsonMessage(buildPauseGameMessage(code))
    }

    const handleEndTurn = () => {
        sendJsonMessage(buildEndTurnMessage(code))
    }

    const handleEndGame = () => {
        sendJsonMessage(buildEndGameMessage(code))
    }

    const isEndTurnButtonDisabled = () : boolean => {
        return !(isCurrentPlayer && !gameState.paused)
    }

    return (
        <div>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                {"Confirm Operation"}
                </DialogTitle>
                <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {confirmOperationAlert.question}
                </DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button onClick={handleClose}>Disagree</Button>
                <Button onClick={handleAgreeEndGame} autoFocus>
                    Agree
                </Button>
                </DialogActions>
            </Dialog>

            {gameState.ended ?
                <Alert severity="info">
                <AlertTitle>The game has ended</AlertTitle>
                You will be redirected to the homepage.
                </Alert> : null
            }

            <Box sx={{ flexGrow: 1 }}>
                <Grid container>
                    <Grid item xs={0} md={3}>
                    </Grid>
                    <Grid item xs={12} md={6} style={{textAlign: 'center'}}>
                        <Typography variant="h4" gutterBottom className={styles.gameTitle}>{gameState.game.name}</Typography>
                        {(gameState.timer !== null && gameState.timer !== 0) ? 
                            <TimerView
                                timer={gameState.timer}
                                paused={gameState.paused}
                                hiddenButtons={false}
                            /> : null
                        }
   
                    </Grid>
                    <Grid item xs={0} md={12}>
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <PlayroomPlayersView paused={gameState.paused} players={gameState.players} currentPlayer={gameState.currentPlayer}/>
                    </Grid>
                    <Grid item xs={0} md={6}>
                        <Box className={styles.imgContainer}>
                            <img className={styles.gameImage} src={gameImgSrc}/>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Box className={styles.actionsButtonsContainer}>
                            {gameState.paused 
                                ? <Button variant="contained" onClick={handleStartGame}>Start</Button>
                                : <Button variant="contained" onClick={handlePauseGame}>Pause</Button> 
                            }
                            {(gameState.players.length > 1) ?
                                <Button variant="contained" onClick={handleEndGame}>
                                    End game
                                </Button> : null
                            }
                            <Button
                                variant="contained"
                                onClick={handleQuitPlayroom}>
                                Quit playroom
                            </Button>
                        </Box>
                    </Grid>

                    <Grid item xs={3} md={3}>
                    </Grid>
                    <Grid item xs={6} md={6} style={{textAlign: 'center'}}>
                        <Box className={styles.endTurnButtonContainer}>
                            <Button 
                                disabled={isEndTurnButtonDisabled()}
                                variant="contained"
                                onClick={handleEndTurn}>
                                End Turn
                            </Button>
                        </Box>
                    </Grid>
                    <Grid item xs={3} md={3}>
                    </Grid>
                </Grid>
            </Box>
        </div>
    )
}

export default Playroom;
