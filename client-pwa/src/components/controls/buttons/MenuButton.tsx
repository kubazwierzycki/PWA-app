import {Button, Menu, MenuItem, Typography} from "@mui/material";
import React, {ReactNode, useState} from "react";
import {useNavigate} from "react-router-dom";


/**
 * @interface
 * @name MenuItem
 * @property {string} name - name displayed on button
 * @property {string} link - routing link for menu button
 * @property {MenuItem[]} sub - list of submenu items
 */
interface MenuItem {
    name: string;
    link: string;
    sub: MenuItem[];
}

/**
 * Single navbar menu button component
 * @param {MenuItem} menu_item - component props
 * @returns {ReactNode}
 */
const MenuButton = ({menu_item}: {menu_item: MenuItem}): ReactNode => {

    const hasSubMenu: boolean = menu_item.sub.length > 0;

    // function for handling routing
    const navigate = useNavigate();

    const [anchorEl, setAnchorEl] =
        useState<HTMLButtonElement | null>(null);

    const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
        if (anchorEl !== event.currentTarget) {
            setAnchorEl(event.currentTarget);
        }
    }

    const handleClose = ()=> {
        setAnchorEl(null);
    }

    const handleClick = ()=> {
        navigate(menu_item.link);
        console.log("click");
    }

    const handleSubItemClick = (link: string)=> {
        // navigate to page pointed by button link
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
                style={{marginLeft: "5px"}}
            >
                <Typography color={"text.primary"}>
                    {menu_item.name}
                </Typography>
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
