import {Avatar, IconButton} from "@mui/material";
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import React from "react";
import {useAuth} from "../../contexts/AuthContext.tsx";
import PersonIcon from '@mui/icons-material/Person';

const UserAvatar = ({onClick}: {onClick: (event: React.MouseEvent<HTMLButtonElement>) => void}) => {

    const {uuid} = useAuth();

    return (
        <div>
            <IconButton onClick={onClick}>
                <Avatar>
                    {
                        uuid === '' ?
                            <PersonOutlineIcon />
                            :
                            <PersonIcon />
                    }
                </Avatar>
            </IconButton>
        </div>
    )
}

export default UserAvatar;
