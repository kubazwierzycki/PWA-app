import {
    Alert,
    Box,Button,Dialog,DialogActions, DialogContent, DialogTitle,FormControl, FormControlLabel,FormLabel,
    InputLabel,OutlinedInput,Radio,RadioGroup,TextField,
} from "@mui/material";
import { ChangeEvent, Dispatch, ReactNode, SetStateAction, useState } from "react";
import gamesService, { SuggestedTimer } from "../../../services/games";
import axios from "axios";

interface TimerSettingsViewProps {
    isTimerDialogOpen: boolean
    setIsGlobalTimer: Dispatch<React.SetStateAction<boolean>>
    setTimer: Dispatch<React.SetStateAction<number>>
    setIsTimerDialogOpen: Dispatch<SetStateAction<boolean>>
    setIsTimerSet : Dispatch<React.SetStateAction<boolean>>
    gameId: string
    isGlobalTimer: boolean
}


/**
 * View component for setting timer
 * @param {boolean} isTimerDialogOpen - visibility of timer settings dialog
 * @param {Dispatch<SetStateAction<boolean>>} setIsGlobalTimer - set timer mode global/per user
 * @param {Dispatch<SetStateAction<number>>} setTimer - set time for game
 * @param {Dispatch<SetStateAction<boolean>>} setIsTimerDialogOpen - set visibility of timer settings dialog
 * @param {Dispatch<SetStateAction<boolean>>} setIsTimerSet - if set to true, user has prepared a timer
 * @param {string} gameId - selected game
 * @param {string} isGlobalTimer - timer type
 * @returns {ReactNode}
 */
const TimerSettingsView = ({isTimerDialogOpen, setIsGlobalTimer, setTimer, setIsTimerDialogOpen, setIsTimerSet, gameId, isGlobalTimer}
    : TimerSettingsViewProps): ReactNode => {
    const [formData, setFormData] = useState({
        hours: "0",
        minutes: "0",
        seconds: "0",
    });
    const [formErrors, setFormErrors] = useState({
        hours: false,
        minutes: false,
        seconds: false,
    });
    const [suggestedTimerAlert, setSuggestedTimerAlert] = useState(false);

    const validateInputs = (name : string, value: string) => {
        const hoursRegex = /^[0-9]{1,3}$/;
        const minutesRegex = /^([0-5]{0,1}[0-9]{1})$/;
        const secondsRegex = /^([0-5]{0,1}[0-9]{1})$/;

        switch (name) {
            case "hours":
                setFormErrors({...formErrors, hours: !hoursRegex.test(value)});
                break;
            case "minutes":
                setFormErrors({...formErrors, minutes: !minutesRegex.test(value)});
                break;
            case "seconds":
                setFormErrors({...formErrors, seconds: !secondsRegex.test(value)});
                break;
            }
    };

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
        validateInputs(name, value)
    };

    const handleTimeChange = (
        hours: string,
        minutes: string,
        seconds: string
    ) => {
        setTimer(Number.parseInt(hours) * 3600 + Number.parseInt(minutes) * 60 + Number.parseInt(seconds));
    };

    const handleClose = () => {
        handleTimeChange(formData.hours, formData.minutes, formData.seconds);
        setIsTimerDialogOpen(false);
    };

    const isValidForm = () : boolean =>{
        return !formErrors.hours && !formErrors.minutes && !formErrors.seconds
    }

    const handleStartGame = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if(isValidForm()){
            setIsTimerSet(true);
            handleClose();
        }
    };

    const handleGlobalTimerChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        event.target.value === "true"
            ? setIsGlobalTimer(true)
            : setIsGlobalTimer(false);
    };

    const handleGetSuggestedTimer = async () => {
        try {
            const suggestedTimer : SuggestedTimer  = await gamesService.getSuggestedTimer(gameId);
            const suggestedSeconds : number = suggestedTimer.time;

            //seconds to H:M:S format
            const hours : string = Math.floor((suggestedSeconds / 3600)).toString()
            const minutes : string = Math.floor((suggestedSeconds % 3600 / 60)).toString();
            const seconds : string = (suggestedSeconds % 60).toString();

            // set suggested values
            setFormData({hours:hours, minutes : minutes, seconds: seconds});
            //clear errors
            setFormErrors({hours: false, minutes: false, seconds: false});

            // set timer type
            setIsGlobalTimer(!suggestedTimer.turnBased);
        } catch(err) {
            if (axios.isAxiosError(err)) {
                switch (err.code) {
                    case "ERR_BAD_REQUEST":
                        setSuggestedTimerAlert(true);
                        setTimeout(() => {setSuggestedTimerAlert(false)}, 3000);
                        break;
                    default:
                        break;
                }
            }
        }
    }

    return (
        <>
            <Dialog
                open={isTimerDialogOpen}
                onClose={handleClose}
                aria-labelledby="timer-settings"
                aria-describedby="set-timer"
            >
                <DialogTitle id="timer-settings">
                    {"Timer settings"}
                </DialogTitle>
                <DialogContent>
                    <Box component="form" onSubmit={handleStartGame}>
                        {suggestedTimerAlert ?
                        <Alert severity="info" sx={{visibility:  suggestedTimerAlert? "visible" : "hidden"}}>
                            The suggested timer for the selected game is not available yet
                        </Alert> : null}
                        <FormLabel id="timer-type-radio-buttons-group">
                            Timer type
                        </FormLabel>
                        <RadioGroup
                            aria-labelledby="timer-type-radio-buttons-group"
                            defaultValue="true"
                            name="timer-type-buttons-group"
                            value={isGlobalTimer}
                            onChange={handleGlobalTimerChange}
                        >
                            <FormControlLabel
                                value="true"
                                control={
                                    <Radio  />
                                }
                                label="One global timer"
                            />
                            <FormControlLabel
                                value="false"
                                control={
                                    <Radio />
                                }
                                label="Timer per user"
                            />
                        </RadioGroup>
                        <Box display={"flex"}>
                            <FormControl
                                sx={{ m: 1 }}
                                variant="filled"
                                color="primary"
                                required={true}
                            >
                                <InputLabel  error={formErrors.hours} shrink htmlFor="timerHoursSetup">
                                    Time (hours)
                                </InputLabel>
                                <OutlinedInput
                                    id="timerHoursSetup"
                                    type={"number"}
                                    name="hours"
                                    value={formData.hours}
                                    onChange={handleInputChange}
                                    error={formErrors.hours}
                                />
                            </FormControl>
                            <FormControl
                                sx={{ m: 1 }}
                                variant="filled"
                                color="primary"
                                required={true}
                            >
                                <InputLabel error={formErrors.minutes} shrink htmlFor="timerMinutesSetup">
                                    Time (minutes)
                                </InputLabel>
                                <TextField
                                    id="timerMinutesSetup"
                                    type={"number"}
                                    name="minutes"
                                    value={formData.minutes}
                                    onChange={handleInputChange}
                                    error={formErrors.minutes}
                                />
                            </FormControl>
                            <FormControl
                                sx={{ m: 1 }}
                                variant="filled"
                                color="primary"
                                required={true}
                            >
                                <InputLabel error={formErrors.seconds} shrink htmlFor="timerSecondsSetup">
                                    Time (seconds)
                                </InputLabel>
                                <OutlinedInput
                                    id="timerSecondsSetup"
                                    type={"number"}
                                    name="seconds"
                                    value={formData.seconds}
                                    onChange={handleInputChange}
                                    error={formErrors.seconds}
                                />
                            </FormControl>
                        </Box>
                        <Button sx={{mb:3}} onClick={handleGetSuggestedTimer}>Get suggested timer</Button>
                        <DialogActions>
                        <Button onClick={handleClose}>Back</Button>
                        <Button type="submit" autoFocus>
                            Go to summary
                        </Button>
                        </DialogActions>
                    </Box>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default TimerSettingsView;
