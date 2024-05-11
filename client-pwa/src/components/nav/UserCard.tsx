import {Avatar, Card, Chip, Stack, Typography} from "@mui/material";


const UserCard = () => {


    return (
        <div>
            <Card sx={{ p: 2.5 }}>
                <Stack direction="row" alignItems="center" spacing={1} useFlexGap>
                    <Avatar variant="rounded" src="avatar.jpg" />
                        <Stack direction="column" alignItems="center"  useFlexGap>
                            <Typography fontWeight="semiBold" color="text.primary">{"user name"}</Typography>
                            <Chip
                                size="small"
                                color={'default'}
                                label={"login"}
                            />
                        </Stack>
                </Stack>
            </Card>
        </div>
    )
}

export default UserCard;