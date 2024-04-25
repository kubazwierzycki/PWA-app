import {Button, Menu, MenuItem} from "@mui/material";
import React, {useState} from "react";
import {useNavigate} from "react-router-dom";


interface MenuItem {
    name: string;
    link: string;
    sub: MenuItem[];
}


const MenuButton = ({menu_item}: {menu_item: MenuItem}) => {

    const hasSubMenu: boolean = menu_item.sub.length > 0;

    const navigate = useNavigate();

    const [anchorEl, setAnchorEl] =
        useState<HTMLButtonElement | null>(null);

    function handleOpen(event: React.MouseEvent<HTMLButtonElement>) {
        if (anchorEl !== event.currentTarget) {
            setAnchorEl(event.currentTarget);
        }
    }

    function handleClose() {
        setAnchorEl(null);
    }

    function handleClick() {
        navigate(menu_item.link);
        console.log("click");
    }

    function handleSubItemClick(link: string) {
        navigate(link);
        handleClose();
    }

    return (
        <div>
            <Button
                aria-owns={anchorEl ? "simple-menu" : undefined}
                aria-haspopup="true"
                onClick={hasSubMenu ? handleOpen : handleClick}
                onMouseOver={hasSubMenu ? handleOpen : undefined}
            >
                {menu_item.name}
            </Button>
            {
                hasSubMenu &&
                <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                    MenuListProps={{ onMouseLeave: handleClose }}
                >
                    {
                        menu_item.sub.map((submenuItem, index) => (
                            <MenuItem key={index} onClick={() => handleSubItemClick(submenuItem.link)}>
                                {submenuItem.name}
                            </MenuItem>
                        ))
                    }
                </Menu>
            }
        </div>
    )
}

export default MenuButton;