import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {ReactNode, useState} from "react";
import GeneratePlayroomView from "./playroom/GeneratePlayroomView.tsx";
import styles from "../../styles/createPlayroom.module.css"
import AwaitingPlayersView from "./playroom/AwaitingPlayersView.tsx";
import ChoosingGameView from "./playroom/ChoosingGameView.tsx";

// creating playroom steps' labels
const steps = ['Create a playroom', 'Wait for others to join', 'Choose the game'];

/**
 * Layout component for the process of creating a new playroom
 * Defines the steps necessary and controls owner's view
 * @returns {ReactNode}
 */
const CreatePlayroomStepper = (): ReactNode => {
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
    }

    const handleNext = () => {
        if (isNextValid(activeStep)) {
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        }
        else {
            alert("Can't go next yet");
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
                return (
                    <GeneratePlayroomView
                        code={code}
                        setCode={setCode}
                    />
                )
            case 1:
                return (
                    <AwaitingPlayersView code={code}/>
                )
            case 2:
                return (
                    <ChoosingGameView />
                )
            default:
                return <></>
        }
    }

    return (
        <Box sx={{ width: '100%' }}>
            <Stepper activeStep={activeStep} sx={{height: "fit-content"}}>
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
                        All steps completed - you&apos;re finished
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                        <Box sx={{ flex: '1 1 auto' }} />
                        <Button onClick={handleReset}>Reset</Button>
                    </Box>
                </React.Fragment>
            ) : (
                <React.Fragment>
                    <Box style={{height: "60vh", width: "100%"}}>
                        {
                            <div className={styles.container}>
                                {
                                    renderStepperContent()
                                }
                            </div>
                        }
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                        <Button
                            color="inherit"
                            disabled={activeStep === 0}
                            onClick={handleBack}
                            sx={{ mr: 1 }}
                        >
                            Back
                        </Button>
                        <Box sx={{ flex: '1 1 auto' }} />
                        <Button onClick={handleNext}>
                            {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                        </Button>
                    </Box>
                </React.Fragment>
            )}
        </Box>
    );
}

export default CreatePlayroomStepper;
