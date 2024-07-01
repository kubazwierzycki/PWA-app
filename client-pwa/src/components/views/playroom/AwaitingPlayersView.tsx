import {ReactNode} from "react";
import {Avatar, Card, Chip, Stack, Typography} from "@mui/material";
import styles from "../../../styles/createPlayroom.module.css";


/**
 * View component showing players who have joined the room
 * @param {string} code - code of the created playroom
 * @returns {ReactNode}
 */
const AwaitingPlayersView = ({code}: {code: string}): ReactNode => {


    return (
        <Card className={styles.awaitBox} sx={{borderRadius: "20px"}}>
            <div className={styles.joinedList}>
                {
                    [1,2,3,4,5].map(value => {
                        return (
                            <Card sx={{marginTop: "10px", padding: "5px"}}>
                                <Stack direction="row">
                                    <Avatar />
                                    <Typography sx={{marginLeft: "10px"}}>
                                        User{value}
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
                <Chip label={code} className={styles.infoElement}/>
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
