import { Typography } from "@mui/material";
import {ReactNode} from "react";
import { usePlayroomContext } from "../../../contexts/PlayroomContext";
import styles from '../../../styles/waitingRoomSummaryView.module.css'
/**
 * View component showing players who have joined the room
 * @returns {ReactNode}
 */
const WaitingRoomSummaryView = ({name, timer, isGlobal} : {name : string, timer : number, isGlobal : boolean}) : ReactNode => {
    const {thumbnailSrc: gameImgSrc} = usePlayroomContext();

    const displayHMS = (timer: number): JSX.Element =>{
        const hours : number = Math.floor(timer / 3600);
        timer %= 3600;
        const minutes = Math.floor(timer / 60);
        const seconds = timer % 60;

    return(
        <Typography variant="subtitle2">
            Time:&nbsp;
            <span>{hours}</span>
            :
            {minutes < 10 ? <span>0{minutes}</span> : <span>{minutes}</span>}
            :
            {seconds < 10 ? <span>0{seconds}</span> : <span>{seconds}</span>}
        </Typography>
    )
}


    return (
        <>
            <Typography variant="h4" sx={{ mb: 1 }}>{name}</Typography>
            {displayHMS(timer)}
            <Typography variant="subtitle2" sx={{ mb: 1 }}>Type: {isGlobal ? "Global" : "Per user"}</Typography>
            <img src={gameImgSrc} className={styles.gameImage}/>
        </>
    )
}

export default WaitingRoomSummaryView;
