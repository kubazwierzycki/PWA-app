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

    const [turnCount, setTurnCount] = useState(0)
    const {sendJsonMessage} = useWebSocketContext();
    const handleSkip = () =>{
        sendJsonMessage(buildSkipOwnMoveMessage(code, turnCount))
        setOpen(false)
    }

    const handleInputChange = (event : ChangeEvent<HTMLInputElement>) =>{
        setTurnCount(parseInt(event.target.value));
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
                <DialogContentText id="alert-dialog-description">
                    Please input number of turns and accept action.
                </DialogContentText>
                <Box component="form">
                <FormControl
                                sx={{ m: 1 }}
                                variant="filled"
                                color="primary"
                                required={true}
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
