import {Avatar, IconButton} from "@mui/material";
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';

const UserAvatar = ({onClick}: {onClick: () => void}) => {


    return (
        <div>
            <IconButton onClick={onClick}>
                <Avatar>
                    <PersonOutlineIcon />
                </Avatar>
            </IconButton>
        </div>
    )
}

export default UserAvatar;
