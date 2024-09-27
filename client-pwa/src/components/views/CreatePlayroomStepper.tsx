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
import { buildJoinWaitingRoomMessage, Player, PlayroomMessage, PutPlayroom, updatePlayroom, waitingRoomMessage } from "../../services/playroom.ts";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { useAuth } from "../../contexts/AuthContext.tsx";




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
    const [waitingRoomPlayers, setWaitingRoomPlayers] = useState<Player[]>([]);

    const {uuid, user } = useAuth();
    //webSocket
    const WS_URL = "ws://localhost:8080/ws-playrooms";

    const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(WS_URL, {
        share: true,
        onOpen: () => {
            console.log("WebSocket connection established.");
        },
    });

    useEffect(() => {
        if (lastJsonMessage) {
            console.log(lastJsonMessage);
            
            const messageType : string = (lastJsonMessage as PlayroomMessage).type;
            switch(messageType){
                case "welcomeInfo": {
                    console.log("welcomeInfo");
                    setJoinSuccessfully(true);
                    break;
                }
                case "waitingRoom": {
                    const waitingRoomMessage : waitingRoomMessage = (lastJsonMessage as waitingRoomMessage);
                    setWaitingRoomPlayers(waitingRoomMessage.players);
                    console.log("waitingRoom");
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

    // current chosen game name
    const [name, setName] = useState<string>("");

    // current chosen game id
    const [choice, setChoice] = useState("");

    const [activeStep, setActiveStep] = React.useState(0);

    // code generated for the new playroom
    const [code, setCode] = useState<string>("");

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
                console.log("ready");
                if(!joinSuccessfully){
                    sendJsonMessage(buildJoinWaitingRoomMessage(code, uuid, user.username));
                }
            } else {
                console.log(readyState);
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
            isGlobalTimer: true, // TODO: to be replaced with correct value
            timer: 100, // TODO: also temporary
        };
        const success = await updatePlayroom(code, body);
        if (success) {
            // playroom creation completed
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        } else {
            alert("Error: Updating playroom failed. Please try again");
        }
    };

    const handleStart = () => {
        if (name === "") {
            // game not chosen yet
            alert("Please choose a game to be played");
        } else {
            // game chosen - ready to play
            // TODO: real playroom view transition
            // send update request about the playroom
            handleUpdate().then();
        }
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    const renderStepperContent = () => {
        switch (activeStep) {
            case 0:
                return <GeneratePlayroomView code={code} setCode={setCode} />;
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
                    <Typography sx={{ mt: 2, mb: 1 }}>
                        All steps completed - playroom is ready for the game
                    </Typography>
                    <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                        <Box sx={{ flex: "1 1 auto" }} />
                        <Button onClick={handleReset}>Reset</Button>
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
                            onClick={
                                activeStep === steps.length - 1
                                    ? handleStart
                                    : handleNext
                            }
                            variant={
                                activeStep === steps.length - 1
                                    ? "contained"
                                    : "outlined"
                            }
                        >
                            {activeStep === steps.length - 1 ? "Start" : "Next"}
                        </Button>
                    </Box>
                </React.Fragment>
            )}
        </Box>
    );
};

export default CreatePlayroomStepper;
