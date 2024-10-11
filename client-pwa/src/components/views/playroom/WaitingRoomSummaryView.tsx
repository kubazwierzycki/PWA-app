import { Typography } from "@mui/material";
import {ReactNode} from "react";


/**
 * View component showing players who have joined the room
 * @returns {ReactNode}
 */
const WaitingRoomSummaryView = () : ReactNode => {


    return (
        <>
            <Typography>Game:</Typography>
            <Typography>Timer:</Typography>
            <Typography>Is Global</Typography>
        </>
    )
}

export default WaitingRoomSummaryView;
