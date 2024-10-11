import { Alert, AlertTitle, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, ThemeProvider, Typography } from "@mui/material";
import {ReactNode, useEffect, useState} from "react";
import { useWebSocketContext } from "../../contexts/WebSocketContext";
import { buildConfirmOperation, PlayroomPlayer, buildEndGameMessage, buildEndTurnMessage, buildPauseGameMessage, buildStartGameMessage, SimpleMessage, ConfirmOperationMessage, PlayroomMessage, ConfirmOperationAlert } from "../../services/playroom";
import Grid from '@mui/material/Grid';
import { usePlayroomContext } from "../../contexts/PlayroomContext";
import TimerView from "../../components/views/playroom/TimerView";
import PlayroomPlayersView from "../../components/views/playroom/PlayroomPlayersView";
import styles from '../../styles/playroom.module.css'
import { useNavigate } from "react-router-dom";
import { createTheme, responsiveFontSizes } from '@mui/material/styles';



/**
 * Playroom
 * @returns {ReactNode}
 */
const Playroom = (): ReactNode => {
    let theme = createTheme();
    theme = responsiveFontSizes(theme);

    const { sendJsonMessage, lastJsonMessage} = useWebSocketContext();
    const {username, code, timer} = usePlayroomContext();
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
                        setTimeout(()=> navigate("/"), 4000);
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
            //Block site for non playing
            navigate("/");
        }
    }, [lastJsonMessage]);

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
        <ThemeProvider theme={theme}>

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
                        <Box>
                            <img className={styles.gameImage} src="https://cf.geekdo-images.com/MQs6Py-AE4sFFhmkh04GHA__imagepage/img/Xgzvg6vldykBRO6UNiZV1kZfLNs=/fit-in/900x600/filters:no_upscale():strip_icc()/pic8470681.jpg"/>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Box sx={{display:"flex", flexDirection:"column"}}>
                            {gameState.paused 
                                ? <Button sx={{m:1}} variant="outlined" onClick={handleStartGame}>Start</Button>
                                : <Button sx={{m:1}} variant="outlined" onClick={handlePauseGame}>Pause</Button> 
                            }
                            <Button sx={{m:1}} variant="outlined" onClick={handleEndGame}>End game</Button>
                        </Box>
                    </Grid>

                    <Grid item xs={3} md={3}>
                    </Grid>
                    <Grid item xs={6} md={6} style={{textAlign: 'center'}}>
                        <Button
                            disabled={isEndTurnButtonDisabled()}
                            variant="outlined"
                            onClick={handleEndTurn}>
                            End Turn
                        </Button>
                    </Grid>
                    <Grid item xs={3} md={3}>
                    </Grid>
                </Grid>
            </Box>
        </div>
        </ThemeProvider>
    )
}

export default Playroom;
