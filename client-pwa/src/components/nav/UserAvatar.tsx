import {Avatar, IconButton} from "@mui/material";
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import React from "react";

const UserAvatar = ({onClick}: {onClick: (event: React.MouseEvent<HTMLButtonElement>) => void}) => {


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
