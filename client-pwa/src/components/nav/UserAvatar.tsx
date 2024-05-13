import {Avatar, IconButton} from "@mui/material";
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import React, {ReactNode} from "react";
import {useAuth} from "../../contexts/AuthContext.tsx";
import PersonIcon from '@mui/icons-material/Person';

/**
 * Avatar button component used to open account popover
 * @param onClick {function(event: MouseEvent) => void} - callback to function opening popover
 * @returns {ReactNode}
 */
const UserAvatar = ({onClick}: {onClick: (event: React.MouseEvent<HTMLButtonElement>) => void}): ReactNode => {

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
