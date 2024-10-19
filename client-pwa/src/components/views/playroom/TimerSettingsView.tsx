import {
    Box,Button,Dialog,DialogActions, DialogContent, DialogTitle,FormControl, FormControlLabel,FormLabel,
    InputLabel,OutlinedInput,Radio,RadioGroup,TextField,
} from "@mui/material";
import { ChangeEvent, ReactNode, useState } from "react";

const TimerSettingsView = ({
    isTimerDialogOpen,
    setIsGlobalTimer,
    setTimer,
    setIsTimerDialogOpen,
    setIsTimerSet,
}: {
    isTimerDialogOpen: boolean;
    setIsGlobalTimer: React.Dispatch<React.SetStateAction<boolean>>;
    setTimer: React.Dispatch<React.SetStateAction<number>>;
    setIsTimerDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setIsTimerSet: React.Dispatch<React.SetStateAction<boolean>>;
}): ReactNode => {
    const [formData, setFormData] = useState({
        hours: "0",
        minutes: "",
        seconds: "",
    });
    const [formErrors, setFormErrors] = useState({
        hours: false,
        minutes: false,
        seconds: false,
    });



    const validateInputs = (name : string, value: string) => {
        const hoursRegex = /^[0-9]{1,3}$/;
        const minutesRegex = /^([0-5]{0,1}[0-9]{1})$/;
        const secondsRegex = /^([0-5]{0,1}[0-9]{1})$/;

        switch (name) {
            case "hours":
                !hoursRegex.test(value) ?
                    setFormErrors({...formErrors, hours: true}) : setFormErrors({...formErrors, hours: false})
                break;
            case "minutes":
                !minutesRegex.test(value) ?
                    setFormErrors({...formErrors, minutes: true}) : setFormErrors({...formErrors, minutes: false})
                break;
            case "seconds":
                !secondsRegex.test(value) ?
                    setFormErrors({...formErrors, seconds: true}) : setFormErrors({...formErrors, seconds: false})
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
                        <FormLabel id="timer-type-radio-buttons-group">
                            Timer type
                        </FormLabel>
                        <RadioGroup
                            aria-labelledby="timer-type-radio-buttons-group"
                            defaultValue="true"
                            name="timer-type-buttons-group"
                        >
                            <FormControlLabel
                                value="true"
                                control={
                                    <Radio onChange={handleGlobalTimerChange} />
                                }
                                label="One global timer"
                            />
                            <FormControlLabel
                                value="false"
                                control={
                                    <Radio onChange={handleGlobalTimerChange} />
                                }
                                label="Timer per user"
                            />
                        </RadioGroup>

                        <FormControl
                            sx={{ m: 1 }}
                            variant="filled"
                            color="primary"
                            required={true}
                        >
                            <InputLabel shrink htmlFor="timerHoursSetup">
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
                            <InputLabel shrink htmlFor="timerMinutesSetup">
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
                            <InputLabel shrink htmlFor="timerSecondsSetup">
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
