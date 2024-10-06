import {ReactNode} from "react";
import {Avatar, Card, Stack, Typography} from "@mui/material";
import styles from "../../../styles/createPlayroom.module.css";
import { PlayroomPlayer } from "../../../services/playroom";


/**
 * View component showing players who have joined the room
 * @param {PlayroomPlayer[]} players - list of players in playroom
 * @returns {ReactNode}
 */
const PlayroomPlayersView = ({players}: {players : PlayroomPlayer[]}): ReactNode => {


    return (
        <Card sx={{borderRadius: "20px"}}>
            <div className={styles.joinedList}>
                {
                    players.map(player => {
                        return (
                            <Card sx={{marginTop: "10px", padding: "5px"}} key={player.name}>
                                <Stack direction="row">
                                    <Avatar />
                                    <Typography sx={{marginLeft: "10px"}}>
                                        {player.name}
                                    </Typography>
                                </Stack>
                            </Card>
                        )
                    })
                }
            </div>
        </Card>
    )
}

export default PlayroomPlayersView;
