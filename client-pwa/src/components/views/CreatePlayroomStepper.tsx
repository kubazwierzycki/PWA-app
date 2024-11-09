import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { ReactNode, useEffect, useState } from "react";
import GeneratePlayroomView from "./playroom/GeneratePlayroomView.tsx";
import styles from "../../styles/createPlayroom.module.css";
import AwaitingPlayersView from "./playroom/AwaitingPlayersView.tsx";
import ChoosingGameView from "./playroom/ChoosingGameView.tsx";
import {buildFinishWaitingRoomMessage, buildJoinWaitingRoomMessage, WaitingPlayer, SimpleMessage,
     PutPlayroom, updatePlayroom, WaitingRoomMessage, WelcomeInfoMessage } from "../../services/playroom.ts";
import { ReadyState } from "react-use-websocket";
import { useAuth } from "../../contexts/AuthContext.tsx";
import { useNavigate } from "react-router-dom";
import { useWebSocketContext } from "../../contexts/WebSocketContext.tsx";
import { usePlayroomContext } from "../../contexts/PlayroomContext.tsx";
import TimerSettingsView from "./playroom/TimerSettingsView.tsx";
import WaitingRoomSummaryView from "./playroom/WaitingRoomSummaryView.tsx";
import api_address from "../../config/api_address.ts";



// creating playroom steps' labels
const steps = [
    "Create a playroom",
    "Wait for others to join",
    "Choose the game",
];

/**
 * Layout component for the process of creating a new playroom
 * Defines the steps necessary and controls owner's view
 * @returns {ReactNode}
 */
const CreatePlayroomStepper = (): ReactNode => {
    const [joinSuccessfully, setJoinSuccessfully] = useState<boolean>(false);
    const [waitingRoomPlayers, setWaitingRoomPlayers] = useState<WaitingPlayer[]>([]);
    const [isTimerSet, setIsTimerSet] = useState(false);
    const navigate = useNavigate();
    const {uuid, user} = useAuth();

    // code generated for the new playroom
    const {code, timer, setUsername, setCode, setTimer, setPlayerId} = usePlayroomContext();

    // webSocket
    const { sendJsonMessage, lastJsonMessage, readyState, setSocketUrl } = useWebSocketContext();

    // API message
    useEffect(() => {
        if (lastJsonMessage) {
            const messageType : string = (lastJsonMessage as SimpleMessage).type;
            switch(messageType){
                case "welcomeInfo": {
                    const welcomeInfoMessage : WelcomeInfoMessage = (lastJsonMessage as WelcomeInfoMessage);                
                    setPlayerId(welcomeInfoMessage.playerId);
                    setJoinSuccessfully(true);
                    break;
                }
                case "waitingRoom": {
                    const waitingRoomMessage : WaitingRoomMessage = (lastJsonMessage as WaitingRoomMessage);
                    setWaitingRoomPlayers(waitingRoomMessage.players);
                    break;
                }
                case "playroom": {
                    setUsername(user.username);
                    navigate("/playroom");
                    break;
                }
                default: {
                    console.log("Unknown message type");
                    break;
                }
            }
        } else{
            setSocketUrl(api_address.backend_ws);
        }
    }, [lastJsonMessage]);

    useEffect(()=>{
        if(isTimerSet === true){
            handleNext();
        }
    }, [isTimerSet])

    // current chosen game name
    const [name, setName] = useState<string>("");

    // current chosen game id
    const [choice, setChoice] = useState("");

    // current chosen timer mode
    const [isGlobalTimer, setIsGlobalTimer] = useState(true);

    // visibility of timer dialog
    const [isTimerDialogOpen, setIsTimerDialogOpen] = useState(false);

    // current setp in stepper
    const [activeStep, setActiveStep] = useState(0);

    // function checking if next is possible
    const isNextValid = (step: number) => {
        switch (step) {
            case 0:
                return code !== "";
            default:
                return true;
        }
    };

    const handleNext = () => {
        if (isNextValid(activeStep)) {
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
            //webSocket
            if (readyState === ReadyState.OPEN) {
                if(!joinSuccessfully){
                    sendJsonMessage(buildJoinWaitingRoomMessage(code, user.username, uuid));
                }
            }
        } else {
            alert("Can't go next yet");
        }
    };

    const handleUpdate = async () => {
        if (code === "") return;
        const body: PutPlayroom = {
            gameId: choice,
            game: name,
            isGlobalTimer: isGlobalTimer,
            timer: timer,
        };
        const success = await updatePlayroom(code, body);
        if (success) {
            // playroom creation completed
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        } else {
            alert("Error: Updating playroom failed. Please try again");
        }
    };

    const handleStartPlayroom = async () => {
        // send update request about the playroom
        await handleUpdate().then();
        //sendJsonMessage(buildCloseWaitingRoomMessage(code));
        sendJsonMessage(buildFinishWaitingRoomMessage(code));
    };

    const handleSetTimer = () => {
        setIsTimerDialogOpen(true);
    }

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setJoinSuccessfully(false);
        setIsTimerSet(false);
        setSocketUrl("");
        setName("");
        setChoice("");
        setCode("");
        setActiveStep(0);
    };

    const renderStepperContent = () => {
        switch (activeStep) {
            case 0:
                return <GeneratePlayroomView code={code} setCode={setCode}/>;
            case 1:
                return <AwaitingPlayersView code={code} players={waitingRoomPlayers}/>;
            case 2:
                return (
                    <ChoosingGameView
                        name={name}
                        setName={setName}
                        choice={choice}
                        setChoice={setChoice}
                    />
                );
            default:
                return <></>;
        }
    };

    return (
        <Box>
            {isTimerDialogOpen 
                && <TimerSettingsView
                    isTimerDialogOpen={isTimerDialogOpen}
                    setIsGlobalTimer={setIsGlobalTimer} 
                    setTimer={setTimer} 
                    setIsTimerDialogOpen={setIsTimerDialogOpen} 
                    setIsTimerSet={setIsTimerSet}
                    gameId={choice}
                    isGlobalTimer={isGlobalTimer}/>
            }
            <Box sx={{ width: "100%" }} className={styles.stepperWrapper}>
                <Stepper
                    activeStep={activeStep}
                    sx={{
                        height: "fit-content",
                        marginBottom: "20px",
                        width: "100%",
                    }}
                >
                    {steps.map((label) => {
                        const stepProps: { completed?: boolean } = {};
                        const labelProps: {
                            optional?: React.ReactNode;
                        } = {};
                        return (
                            <Step key={label} {...stepProps}>
                                <StepLabel {...labelProps}>{label}</StepLabel>
                            </Step>
                        );
                    })}
                </Stepper>
                {activeStep === steps.length ? (
                    <React.Fragment>
                        <Typography variant="subtitle1"  sx={{ mt: 2, mb: 1 }}>
                            All steps completed - playroom is ready for the game
                        </Typography>
                        <WaitingRoomSummaryView isGlobal={isGlobalTimer} timer={timer} name={name}/>
                        <Box sx={{ display: "flex", flexDirection: "column", mt:1}}>
                            <Button className={styles.summaryButton} variant="contained" sx={{mb:1, mt:2}} onClick={handleReset}>Reset</Button>
                            <Button className={styles.summaryButton} variant="contained" onClick={handleStartPlayroom}>Start playroom</Button>
                        </Box>
                    </React.Fragment>
                ) : (
                    <React.Fragment>
                        <Box style={{ width: "100%" }}>
                            {
                                <div className={styles.container}>
                                    {renderStepperContent()}
                                </div>
                            }
                        </Box>
                        <Box
                            sx={{ display: "flex", flexDirection: "row", pt: 2 }}
                            className={styles.bottomPanel}
                        >
                            <Button
                                color="inherit"
                                disabled={activeStep === 0 || activeStep === 1}
                                onClick={handleBack}
                                sx={{ mr: 1 }}
                                variant="outlined"
                            >
                                Back
                            </Button>
                            <Box sx={{ flex: "1 1 auto" }} />
                            <Button
                                disabled={
                                    activeStep === steps.length - 1
                                    ? name === ""
                                    : false
                                }
                                onClick={
                                    activeStep === steps.length - 1
                                        ? handleSetTimer
                                        : handleNext
                                }
                                variant={
                                    activeStep === steps.length - 1
                                        ? "contained"
                                        : "outlined"
                                }
                            >
                                {activeStep === steps.length - 1 
                                    ? "Set timer"
                                    : "Next"}
                            </Button>
                        </Box>
                    </React.Fragment>
                )}
            </Box>
        </Box>
    );
};

export default CreatePlayroomStepper;

