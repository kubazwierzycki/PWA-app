import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, FormControlLabel, InputLabel, OutlinedInput} from "@mui/material";
import { ReactNode} from "react";

const TimerSettingsView = ({isGlobalTimer, timer, isTimerDialogOpen,
        setIsGlobalTimer, setTimer, setIsTimerDialogOpen, setIsTimerSet}: 
        {
            isGlobalTimer: boolean,
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
      setIsGlobalTimer(event.target.checked)
    }

    const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) =>{
      setTimer(event.target.valueAsNumber)
    }



    return(
        <>
        <Dialog
          open={isTimerDialogOpen}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Timer settings"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Please set up timer for your playroom.
            </DialogContentText>
            <FormControlLabel control={
                    <Checkbox
                    checked={isGlobalTimer}
                    onChange={handleGlobalTimerChange}
                    inputProps={{ 'aria-label': 'controlled' }}
                  />
              } label="Global timer" />
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
            <Button onClick={handleClose}>Go back</Button>
            <Button onClick={handleStartGame} autoFocus>
              Start game
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
}

export default TimerSettingsView;
