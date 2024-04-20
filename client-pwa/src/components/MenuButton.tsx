import {Button, Menu, MenuItem} from "@mui/material";
import React, {useState} from "react";


const MenuButton = ({text}: { text: string}) => {

    const [anchorEl, setAnchorEl] =
        useState<HTMLButtonElement | null>(null);

    function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
        if (anchorEl !== event.currentTarget) {
            setAnchorEl(event.currentTarget);
        }
    }

    function handleClose() {
        setAnchorEl(null);
    }

    return (
        <div>
            <Button
                aria-owns={anchorEl ? "simple-menu" : undefined}
                aria-haspopup="true"
                onClick={handleClick}
                onMouseOver={handleClick}

            >
                {text}
            </Button>
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                MenuListProps={{ onMouseLeave: handleClose }}
            >
                <MenuItem onClick={handleClose}>Profile</MenuItem>
                <MenuItem onClick={handleClose}>My account</MenuItem>
                <MenuItem onClick={handleClose}>Logout</MenuItem>
            </Menu>
        </div>
    )
}

export default MenuButton;