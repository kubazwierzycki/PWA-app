import {ReactNode} from "react";
import {Avatar, Card, Chip, Stack, Tooltip, Typography} from "@mui/material";
import styles from "../../../styles/createPlayroom.module.css";
import { WaitingPlayer } from "../../../services/playroom";


/**
 * View component showing players who have joined the room
 * @param {string} code - code of the created playroom
 * @param {WaitingPlayer[]} players - list of awaiting players
 * @returns {ReactNode}
 */
const AwaitingPlayersView = ({code, players}: {code: string, players : WaitingPlayer[]}): ReactNode => {

    const copyToClipboard = () =>{
        navigator.clipboard.writeText(code);
    }

    return (
        <Card className={styles.awaitBox} sx={{borderRadius: "20px"}}>
            <div className={styles.joinedList}>
                {
                    players.map(player => {
                        return (
                            <Card sx={{marginTop: "10px", padding: "5px"}} key={player.username}>
                                <Stack direction="row">
                                    <Avatar />
                                    <Typography sx={{marginLeft: "10px"}}>
                                        {player.username}
                                    </Typography>
                                </Stack>
                            </Card>
                        )
                    })
                }
            </div>
            <div className={styles.joinedInfo}>
                <Typography className={styles.infoElement}>
                    Your playroom code:
                </Typography>
                <Tooltip title="Click to copy" >
                    <Chip label={code} className={styles.infoElement} onClick={copyToClipboard}/>
                </Tooltip>
                <Typography className={styles.infoElement}>
                    Please share it with your friends so that they can join
                </Typography>
                <Typography>
                    Wait for your friends to join - they should appear on the list
                </Typography>
                <Typography>
                    Once you see everyone you wanted to join, feel free to go NEXT
                </Typography>
            </div>
        </Card>
    )
}

export default AwaitingPlayersView;
