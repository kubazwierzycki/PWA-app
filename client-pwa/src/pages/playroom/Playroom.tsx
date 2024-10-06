import { Box, Button, ButtonGroup, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from "@mui/material";
import {ReactNode, useEffect, useState} from "react";
import { useWebSocketContext } from "../../contexts/WebSocketContext";
import { buildConfirmEndGameMessage as buildConfirmOperation, buildEndGameMessage, buildEndTurnMessage, buildPauseGameMessage, buildStartGameMessage, SimpleMessage, ConfirmOperationMessage, PlayroomMessage, ConfirmOperationAlert } from "../../services/playroom";
import Grid from '@mui/material/Grid';
import { usePlayroomContext } from "../../contexts/PlayroomContext";
import TimerView from "../../components/views/playroom/TimerView";
import PlayroomPlayersView from "../../components/views/playroom/PlayroomPlayersView";


/**
 * Playroom
 * @returns {ReactNode}
 */
const Playroom = (): ReactNode => {
    const { sendJsonMessage, lastJsonMessage} = useWebSocketContext();
    const {code} = usePlayroomContext();

    const [open, setOpen] = useState(false);
    const [confirmOperationAlert, setConfirmOperationAlert] = useState<ConfirmOperationAlert>({
        operationId : "",
        question : "",
    });
    
    const [gameState, setGameState] = useState<PlayroomMessage>({
        type: "playroom",
        timer : 0,
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
            console.log(lastJsonMessage);
            const messageType : string = (lastJsonMessage as SimpleMessage).type;
            switch(messageType){
                case "playroom": {
                    setGameState(lastJsonMessage as PlayroomMessage);
                    console.log("playroom");
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
        } else {
            console.log("None");
        }
    }, [lastJsonMessage]);

    // closes alert
    const handleClose = () => {
        setOpen(false);
      };
    // operation agreed by user
    const handleAgreeEndGame = () => {
        handleClose();
        sendJsonMessage(buildConfirmOperation(code, confirmOperationAlert.operationId));
    }

    const handleStartGame = () => {
        console.log("Start");
        sendJsonMessage(buildStartGameMessage(code));
    }

    const handlePauseGame = () => {
        console.log("Pause");
        sendJsonMessage(buildPauseGameMessage(code));
    }

    const handleEndTurn = () => {
        console.log("End turn");
        sendJsonMessage(buildEndTurnMessage(code));
    }

    const handleEndGame = () => {
        console.log("End game");
        sendJsonMessage(buildEndGameMessage(code));
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
          

            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={3}>
                    <Grid xs={3}>
                    </Grid>
                    <Grid xs={6} style={{textAlign: 'center'}}>
                        <Typography gutterBottom>{gameState.game.name}</Typography>
                        <TimerView  
                        timer={gameState.timer}
                        paused={gameState.paused}/>
                    </Grid>
                    <Grid xs={3}>
                    </Grid>

                    <Grid xs={3}>
                        <PlayroomPlayersView players={gameState.players}/>
                    </Grid>
                    <Grid xs={6}>
                    </Grid>
                    <Grid xs={3}>
                        <ButtonGroup orientation="vertical" aria-label="Basic button group">
                            <Button onClick={handleEndGame}>End game</Button>
                            <Button onClick={handleStartGame}>Start</Button>
                            <Button onClick={handlePauseGame}>Pause</Button>
                        </ButtonGroup>
                    </Grid>

                    <Grid xs={3}>
                    </Grid>
                    <Grid xs={6} style={{textAlign: 'center'}}>
                        <Button onClick={handleEndTurn}>End Turn</Button>
                    </Grid>
                    <Grid xs={3}>
                    </Grid>
                </Grid>
            </Box>
        </div>
    )
}

export default Playroom;
