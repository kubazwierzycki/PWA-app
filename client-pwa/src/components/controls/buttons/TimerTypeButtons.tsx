import { ReactNode } from "react";
import { TimerType } from "../../../services/playroom";
import { Box, Button } from "@mui/material";


const TimerTypeButtons = ({setTimerType}: {setTimerType: React.Dispatch<React.SetStateAction<TimerType>>}): ReactNode => {

    const handleChangeTimerType = (timerType : TimerType) =>{
        setTimerType(timerType);
    }
    
    return(
        <Box>
            <Button sx={{m:1}} variant="contained" onClick={() => handleChangeTimerType(TimerType.HMS)}>{TimerType.HMS}</Button>
            <Button sx={{m:1}} variant="contained" onClick={() => handleChangeTimerType(TimerType.MS)}>{TimerType.MS}</Button>
            <Button sx={{m:1}} variant="contained" onClick={() => handleChangeTimerType(TimerType.S)}>{TimerType.S}</Button>
        </Box>
    )
}

export default TimerTypeButtons;
