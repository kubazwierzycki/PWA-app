import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, InputLabel, OutlinedInput } from "@mui/material";
import { buildSkipOwnMoveMessage } from "../../../services/playroom";
import { useWebSocketContext } from "../../../contexts/WebSocketContext";
import { ChangeEvent, useState } from "react";


interface SkipTurnsViewProps {
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    code: string
}


const SkipTurnsView = ({open, setOpen, code} : SkipTurnsViewProps) => {

    const [turnCount, setTurnCount] = useState(1)
    const {sendJsonMessage} = useWebSocketContext();
    const [error, setError] = useState<boolean>(false);

    const handleSkip = () => {
        if(error == false) {
            sendJsonMessage(buildSkipOwnMoveMessage(code, turnCount))
            setOpen(false)
        }
    }

    const handleInputChange = (event : ChangeEvent<HTMLInputElement>) =>{
        
        const skipCountRegEx = /^[1-9]{1}[0-9]{0,1}$/;
        setTurnCount(parseInt(event.target.value));

        if(skipCountRegEx.test(event.target.value) == true){
            setError(false);
        } else {
            setError(true);
        }
    }

    return(
        <Dialog
                open={open}
                onClose={()=> setOpen(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                {"Skip Turns"}
                </DialogTitle>
                <DialogContent>
                <DialogContentText id="alert-dialog-description" sx={{m:0}}>
                    Please input number of turns (1-99) and click skip.
                </DialogContentText>
                <Box component="form">
                <FormControl
                                sx={{ mt: 2 }}
                                variant="filled"
                                color="primary"
                                required={true}
                                error={error}
                            >
                                <InputLabel  shrink htmlFor="turnsCount">
                                    Number of turns:
                                </InputLabel>
                                <OutlinedInput
                                    id="turnsCount"
                                    type={"number"}
                                    name="hours"
                                    value={turnCount}
                                    onChange={handleInputChange}
                                    error={error}
                                />
                            </FormControl>
                </Box>
                </DialogContent>
                <DialogActions>
                <Button onClick={()=> setOpen(false)}>Close</Button>
                <Button onClick={handleSkip} autoFocus>
                    Skip
                </Button>
                </DialogActions>
            </Dialog>
    )
}

export default SkipTurnsView;
