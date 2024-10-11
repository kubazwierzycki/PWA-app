import { Box, Button } from "@mui/material";
import {ReactNode, useEffect, useState} from "react";
import { useTimer } from "react-timer-hook";
import { usePlayroomContext } from "../../../contexts/PlayroomContext";
import { useWebSocketContext } from "../../../contexts/WebSocketContext";
import { buildCheckStatusMessage } from "../../../services/playroom";


enum TimerType{
    HMS,
    MS,
    S,
}

/**
 * View component showing timer
 * @param {number} timer - timer from API
 * @param {number} paused - game status
 * @returns {ReactNode}
 */
const TimerView = ({timer, paused, hiddenButtons}: {timer: number, paused:boolean, hiddenButtons:boolean}): ReactNode => {
    

    const initTime = new Date();
    initTime.setSeconds(initTime.getSeconds() + Math.floor(timer));
    const [expiryTimestamp] = useState(initTime);
    const [timerType, setTimerType] = useState<TimerType>(TimerType.MS);
    const {code} = usePlayroomContext();
    const {sendJsonMessage} = useWebSocketContext();

    const handleTimerExpire = () =>{
        sendJsonMessage(buildCheckStatusMessage(code));
    }

    const {
        totalSeconds,
        seconds,
        minutes,
        hours,
        pause,
        restart,
      } = useTimer({ expiryTimestamp, onExpire: () => handleTimerExpire() });

    
    useEffect(() => {
        if(paused){
            pause();
        } else {
            const time = new Date();
            time.setSeconds(time.getSeconds() + Math.floor(timer));
            restart(time);
        }
    }, [timer, paused]);


    const DisplayTime = ({hours, minutes , seconds, totalSeconds, timerType}:
        {hours: number, minutes: number, seconds: number, totalSeconds : number, timerType : TimerType}) =>{
            switch (timerType) {
                case TimerType.HMS:
                    return displayHMS({hours : hours, minutes : minutes, seconds : seconds});
                case TimerType.MS:
                    return displayMS({hours : hours, minutes : minutes, seconds : seconds});
                case TimerType.S:
                    return displayS({totalSeconds : totalSeconds});
                default:
                    break;
            }
    }

    const displayHMS = ({hours, minutes , seconds}:
            {hours: number, minutes: number, seconds: number}): JSX.Element =>{
        return(
            <>
                <span>{hours}</span>
                :
                {minutes < 10 ? <span>0{minutes}</span> : <span>{minutes}</span>}
                :
                {seconds < 10 ? <span>0{seconds}</span> : <span>{seconds}</span>}
            </>
        )
    }

    const displayMS = ({hours, minutes , seconds} :
            {hours: number, minutes: number, seconds: number}): JSX.Element =>{
        return(
            <>
                {minutes < 10 ? <span>0{minutes + hours*60}</span> : <span>{minutes + hours*60}</span>}
                :
                {seconds < 10 ? <span>0{seconds}</span> : <span>{seconds}</span>}
            </>
        )
    }

    const displayS = ({totalSeconds} : {totalSeconds: number}): JSX.Element =>{
        return(
            <>
                <span>{totalSeconds}</span>
            </>
        )
    }

    const handleChangeTimerType = (timerType : TimerType) =>{
        setTimerType(timerType);
    }

    return (
        <Box>
            {!hiddenButtons ?               
                <Box>
                    <Button sx={{m:1}} variant="outlined" onClick={() => handleChangeTimerType(TimerType.HMS)}>HMS</Button>
                    <Button sx={{m:1}} variant="outlined" onClick={() => handleChangeTimerType(TimerType.MS)}>MS</Button>
                    <Button sx={{m:1}} variant="outlined" onClick={() => handleChangeTimerType(TimerType.S)}>S</Button>
                </Box>
                : null
            }
            <Box>
                <DisplayTime hours={hours} minutes={minutes} seconds={seconds} 
                        totalSeconds={totalSeconds} timerType={timerType}/>
            </Box>
        </Box>
    )
}

export default TimerView;
