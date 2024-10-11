import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, FormLabel, InputLabel, OutlinedInput, Radio, RadioGroup} from "@mui/material";
import { ReactNode} from "react";

const TimerSettingsView = ({timer, isTimerDialogOpen,
        setIsGlobalTimer, setTimer, setIsTimerDialogOpen, setIsTimerSet}: 
        {
            timer : number,
            isTimerDialogOpen : boolean,
            setIsGlobalTimer: React.Dispatch<React.SetStateAction<boolean>>,
            setTimer: React.Dispatch<React.SetStateAction<number>>
            setIsTimerDialogOpen : React.Dispatch<React.SetStateAction<boolean>>,
            setIsTimerSet : React.Dispatch<React.SetStateAction<boolean>>,
        }) : ReactNode  => {

    const handleClose = () => {
      setIsTimerDialogOpen(false);
    };

    const handleStartGame = () => {
        setIsTimerSet(true);
        handleClose();
    };

    const handleGlobalTimerChange = (event: React.ChangeEvent<HTMLInputElement>) =>{
      event.target.value === "true" 
        ? setIsGlobalTimer(true)
        : setIsGlobalTimer(false)
    }

    const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) =>{
      setTimer(event.target.valueAsNumber)
    }



    return(
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
            <FormLabel id="timer-type-radio-buttons-group">Timer type</FormLabel>
            <RadioGroup
              aria-labelledby="timer-type-radio-buttons-group"
              defaultValue="true"
              name="timer-type-buttons-group"
            >
              <FormControlLabel value="true" control={<Radio     onChange={handleGlobalTimerChange}/> } label="One global timer" />
              <FormControlLabel value="false" control={<Radio     onChange={handleGlobalTimerChange}/>} label="Timer per user" />
            </RadioGroup>

              <FormControl
                sx={{ m: 1 }}
                variant="filled"
                color="primary"
                required={true}
              >
              <InputLabel shrink htmlFor="timerSetup">
                  Time (seconds)
              </InputLabel>
              <OutlinedInput
                  id="timerSetup"
                  type={"number"}
                  value={timer}
                  onChange={handleTimeChange}
              />
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Back</Button>
            <Button onClick={handleStartGame} autoFocus>
              Go to summary
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
}

export default TimerSettingsView;
