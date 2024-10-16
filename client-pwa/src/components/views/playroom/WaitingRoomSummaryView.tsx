import { Typography } from "@mui/material";
import {ReactNode} from "react";
import { usePlayroomContext } from "../../../contexts/PlayroomContext";
import styles from '../../../styles/waitingRoomSummaryView.module.css'

/**
 * View component showing players who have joined the room
 * @returns {ReactNode}
 */
const WaitingRoomSummaryView = ({name, timer, isGlobal} : {name : string, timer : number, isGlobal : boolean}) : ReactNode => {
    const {gameImgSrc} = usePlayroomContext();

    return (
        <>
            <Typography variant="h5" sx={{ mb: 1 }}>{name}</Typography>
            <Typography variant="subtitle1">Time: {timer}</Typography>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>Type: {isGlobal ? "Global" : "Per user"}</Typography>
            <img src={gameImgSrc} className={styles.gameImage}/>
        </>
    )
}

export default WaitingRoomSummaryView;
