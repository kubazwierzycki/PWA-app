import { Alert, AlertTitle, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControlLabel, Switch, Tooltip, Typography } from "@mui/material";
import {ReactNode, useEffect, useState} from "react";
import { useWebSocketContext } from "../../contexts/WebSocketContext";
import { buildConfirmOperation, PlayroomPlayer, buildEndGameMessage, buildEndTurnMessage, buildPauseGameMessage, buildStartGameMessage, SimpleMessage, ConfirmOperationMessage, PlayroomMessage, ConfirmOperationAlert, buildQuitPlayroomMessage, TimerType, buildWinGameMessage, updatePlayroomQueue, PutPlayroomQueue, playerIdObj } from "../../services/playroom";
import Grid from '@mui/material/Grid';
import { usePlayroomContext } from "../../contexts/PlayroomContext";
import TimerView from "../../components/views/playroom/TimerView";
import PlayroomPlayersView from "../../components/views/playroom/PlayroomPlayersView";
import styles from '../../styles/playroom.module.css'
import { useNavigate } from "react-router-dom";
import bgg from "../../services/bgg";
import axios from "axios";
import TimerTypeButtons from "../../components/controls/buttons/TimerTypeButtons";
import PlayroomPlayersEditView from "../../components/views/playroom/PlayroomPlayersEditView";


/**
 * Playroom
 * @returns {ReactNode}
 */
const Playroom = (): ReactNode => {

    const navigate = useNavigate();

    const { sendJsonMessage, lastJsonMessage, setSocketUrl} = useWebSocketContext();
    const {playerId, code, setCode, timer, clearPlayroomContex} = usePlayroomContext();

    const [isCurrentPlayer, setIsCurrentPlayer] = useState<boolean>(false);
    const [open, setOpen] = useState(false);
    const [confirmOperationAlert, setConfirmOperationAlert] = useState<ConfirmOperationAlert>({
        operationId : "",
        question : "",
    });
    const [playersCopy, setPlayersCopy] = useState<PlayroomPlayer[]>([]);
    const [isInEditState, setIsInEditState] = useState(false);
    const [gameImageSrc, setGameImageSrc] = useState("");
    const [timerType, setTimerType] = useState<TimerType>(TimerType.MS);
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
    const [isUpdateQueueAlertOpen, setIsUpdateQueueAlertOpen] = useState<boolean>(false);



    useEffect(()=>{
        const fetchImageSrc = async (gameId : number) => {
            try{
                const bggResponse = await bgg.getBggGameById(gameId);
                const imageSrc = bgg.getGameImageSrcFromResponse(bggResponse);
                setGameImageSrc(imageSrc);
            } catch(err){
                if (axios.isAxiosError(err)) {
                    switch (err.code) {
                        default:
                            break;
                    }
                }
            }
        }

        fetchImageSrc(gameState.game.gameID);
    }, [gameState.game.gameID])


    // actions performed for a given message type
    useEffect(() => {
        if (lastJsonMessage) {
            const messageType : string = (lastJsonMessage as SimpleMessage).type;
            switch(messageType){
                case "playroom": {
                    const playroomMessage : PlayroomMessage = (lastJsonMessage as PlayroomMessage);
                    setGameState(playroomMessage);
                    
                    // copy players
                    const players : PlayroomPlayer[]  = playroomMessage.players;
                    if(players.length > 0){
                        setPlayersCopy(players);
                    }

                    // check if player is current player
                    const player : PlayroomPlayer | undefined = players.find(p => p.playerId === playerId);
                    if(player !== undefined){
                        player.queueNumber === playroomMessage.currentPlayer 
                            ? setIsCurrentPlayer(true)
                            : setIsCurrentPlayer(false)
                    }

                    // block players editing view
                    if(playroomMessage.paused !== true) {
                        setIsInEditState(false);
                    }

                    // handle game ending
                    if(playroomMessage.ended){
                        clearPlayroomContex();
                        setTimeout(()=> {setSocketUrl(null);}, 4000);
                        setCode("");
                    }

                    break;
                }
                case "confirmOperation": {
                    const confirmOperationMessage : ConfirmOperationMessage = (lastJsonMessage as ConfirmOperationMessage);

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

    const handleQuitPlayroom = () => {
        sendJsonMessage(buildQuitPlayroomMessage(code));
        clearPlayroomContex();
        setSocketUrl(null);
    };

    // closes alert
    const handleClose = () => {
        setOpen(false);
    };
    // operation agreed by user
    const handleAgreeOperation = () => {
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

    const handleWinGame = () =>{
        sendJsonMessage(buildWinGameMessage(code))
    }

    const handleStartEdit = (_event: React.ChangeEvent<HTMLInputElement>, checked: boolean) =>{
        setIsInEditState(checked);
    }

    const handleUpdateList = async () => {
        const newPlayersQueue : playerIdObj[] = [];
        playersCopy.forEach(player => newPlayersQueue.push({playerId : player.playerId}));
        const body : PutPlayroomQueue = {players: newPlayersQueue}
        const isUpdated = await updatePlayroomQueue(code, body);
        if(isUpdated) {
            setIsUpdateQueueAlertOpen(true)
           
            setTimeout(() => {
                setIsUpdateQueueAlertOpen(false);
                setIsInEditState(false);
              }, 3000);
        }
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
                <Button onClick={handleClose}>Close</Button>
                <Button onClick={handleAgreeOperation} autoFocus>
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
                        <Box>
                            <TimerTypeButtons setTimerType={setTimerType}/>
                            <TimerView
                                timer={gameState.timer}
                                paused={gameState.paused}
                                timerType={timerType}
                                variant="h5"/> 
                            </Box> : null
                        }
   
                    </Grid>
                    <Grid item xs={0} md={12}>
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <Box className={styles.playroomPlayersView}>
                        <Tooltip placement="top" title="In order to edit, game must be paused">
                            <FormControlLabel
                                value="top"
                                sx={{ml:2}}
                                control={<Switch disabled={!gameState.paused} checked={isInEditState} onChange={handleStartEdit}/>}
                                label="Edit queue"
                                labelPlacement="start"
                            />
                        </Tooltip>
                        {isInEditState 
                            ? <>
                                <PlayroomPlayersEditView playersToEdit={playersCopy} setPlayersToEdit={setPlayersCopy}/>
                                <Button variant="contained" onClick={handleUpdateList} sx={{mt:2, ml:1}}>
                                    Update queue
                                </Button>
                                <Alert severity="success" sx={{mt:2, visibility: isUpdateQueueAlertOpen ? "visible" : "hidden"}}>Queue updated</Alert>
                            </>
                            : <PlayroomPlayersView 
                                paused={gameState.paused} 
                                players={gameState.players} 
                                currentPlayer={gameState.currentPlayer}
                            />
                        }
                        </Box>
                    </Grid>
                    <Grid item xs={0} md={6}>
                        <Box className={styles.imgContainer}>
                            <img
                                alt="Image of the selected game"
                                className={gameImageSrc ? styles.gameImage : styles.gameImageNotLoaded} 
                                src={gameImageSrc}/>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Box className={styles.actionsButtonsContainer}>
                            {gameState.paused 
                                ? <Button variant="contained" onClick={handleStartGame}>Start</Button>
                                : <Button variant="contained" onClick={handlePauseGame}>Pause</Button> 
                            }
                            {(gameState.players.length > 1) ?
                                <>
                                    <Tooltip
                                        disableFocusListener
                                        disableTouchListener
                                        title="End game without saving"
                                        placement="bottom">
                                        <Button variant="contained" onClick={handleEndGame}>
                                            End game
                                        </Button>
                                    </Tooltip>
                                    <Tooltip
                                        disableFocusListener
                                        disableTouchListener
                                        title="End game as a winner and save game"
                                        placement="bottom">
                                        <Button variant="contained" onClick={handleWinGame}>
                                            Win game
                                        </Button>
                                    </Tooltip>
                                </>: null
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
