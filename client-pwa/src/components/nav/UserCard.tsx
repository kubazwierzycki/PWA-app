import { Avatar, Card, Chip, Stack, Typography } from "@mui/material";
import { ReactNode } from "react";
import { useAuth } from "../../contexts/AuthContext";

/**
 * Component presenting user account info
 * @returns {ReactNode}
 */
const UserCard = (): ReactNode => {
    const { user } = useAuth();
    return (
        <div>
            <Card sx={{ p: 2.5 }}>
                <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1}
                    useFlexGap
                >
                    <Avatar variant="rounded" src="avatar.jpg" />
                    <Stack direction="column" alignItems="center" useFlexGap>
                        <Chip
                            size="small"
                            color={"default"}
                            label={user.username}
                        />
                        <Typography fontWeight="semiBold" color="text.primary">
                            {user.email}
                        </Typography>
                    </Stack>
                </Stack>
            </Card>
        </div>
    );
};

export default UserCard;
