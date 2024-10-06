import { Button } from "@mui/material";
import {ReactNode, useEffect, useState} from "react";
import { useTimer } from "react-timer-hook";


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
const TimerView = ({timer, paused}: {timer: number, paused:boolean}): ReactNode => {
    


    const [expiryTimestamp] = useState(new Date());
    const [timerType, setTimerType] = useState<TimerType>(TimerType.MS);

    const {
        totalSeconds,
        seconds,
        minutes,
        hours,
        pause,
        restart,
      } = useTimer({ expiryTimestamp, onExpire: () => console.warn('onExpire called') });

    
    useEffect(() => {
        if(paused){
            pause();
        } else {
            const time = new Date();
            time.setSeconds(time.getSeconds() + Math.floor(timer));
            restart(time);
        }
    }, [timer, paused]);


    function DisplayTime({hours, minutes , seconds, totalSeconds, timerType}:
        {hours: number, minutes: number, seconds: number, totalSeconds : number, timerType : TimerType}) {
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

    function displayHMS({hours, minutes , seconds}:
            {hours: number, minutes: number, seconds: number}): JSX.Element{
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

    function displayMS({hours, minutes , seconds}:
            {hours: number, minutes: number, seconds: number}): JSX.Element{
        return(
            <>
                {minutes < 10 ? <span>0{minutes + hours*60}</span> : <span>{minutes + hours*60}</span>}
                :
                {seconds < 10 ? <span>0{seconds}</span> : <span>{seconds}</span>}
            </>
        )
    }

    function displayS({totalSeconds} : {totalSeconds: number}): JSX.Element{
        return(
            <>
                <span>{totalSeconds}</span>
            </>
        )
    }

    function handleChangeTimerType(timerType : TimerType){
        setTimerType(timerType);
    }

    return (
        <div>
            <div>
                <Button onClick={() => handleChangeTimerType(TimerType.HMS)}>HMS</Button>
                <Button onClick={() => handleChangeTimerType(TimerType.MS)}>MS</Button>
                <Button onClick={() => handleChangeTimerType(TimerType.S)}>S</Button>
            </div>
            <div>
                <DisplayTime hours={hours} minutes={minutes} seconds={seconds} 
                        totalSeconds={totalSeconds} timerType={timerType}/>
            </div>
        </div>
    )
}

export default TimerView;
