import {Avatar, Card, Chip, Stack, Typography} from "@mui/material";
import {ReactNode} from "react";


/**
 * Component presenting user account info
 * @returns {ReactNode}
 */
const UserCard = (): ReactNode => {

    // TODO: getting actual account info from context when ready

    return (
        <div>
            <Card sx={{ p: 2.5 }}>
                <Stack direction="row" alignItems="center" spacing={1} useFlexGap>
                    <Avatar variant="rounded" src="avatar.jpg" />
                        <Stack direction="column" alignItems="center"  useFlexGap>
                            <Chip
                                size="small"
                                color={'default'}
                                label={"user_login"}
                            />
                            <Typography fontWeight="semiBold" color="text.primary">{"user_email"}</Typography>
                        </Stack>
                </Stack>
            </Card>
        </div>
    )
}

export default UserCard;