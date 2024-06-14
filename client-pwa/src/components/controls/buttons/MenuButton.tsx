import {Button, Menu, MenuItem, styled, Typography} from "@mui/material";
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


const CustomButton = styled(Button, {
    shouldForwardProp: () => true
})(({ theme }) => ({
    marginLeft: '5px',
    borderBottom: '3px solid transparent',
    borderRadius: 0,
    '&:hover': {
        borderBottom: `3px solid ${theme.palette.primary.main}`
    },
    '&:active': {
        borderBottom: `3px solid ${theme.palette.primary.main}`
    },
}));

const CustomMenuItem = styled(MenuItem, {
    shouldForwardProp: () => true
})(({ theme }) => ({
    borderBottom: '2px solid transparent',
    borderRadius: 0,
    '&:hover': {
        borderBottom: `2px solid ${theme.palette.primary.main}`
    },
    '&:active': {
        borderBottom: `2px solid ${theme.palette.primary.main}`
    },
}));


/**
 * Single navbar menu button component
 * @param {MenuItem} menu_item - component props
 * @param {boolean} outlined - is button variant outlined (no underline on this variant)
 * @returns {ReactNode}
 */
const MenuButton = ({menu_item, outlined}: {menu_item: MenuItem, outlined?: boolean}): ReactNode => {

    const hasSubMenu: boolean = menu_item.sub.length > 0;

    // function for handling routing
    const navigate = useNavigate();

    const [anchorEl, setAnchorEl] =
        useState<HTMLButtonElement | null>(null);

    const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
        if (anchorEl !== event.currentTarget) {
            console.log(event.currentTarget)
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
            {
                hasSubMenu || outlined ?
                    <Button
                        aria-owns={anchorEl ? "simple-menu" : undefined}
                        aria-haspopup="true"
                        onClick={hasSubMenu ? handleOpen : handleClick}
                        onMouseOver={hasSubMenu ? handleOpen : undefined}
                        style={!outlined ? {borderBottom: "3px solid transparent"}:{}}
                    >
                        <Typography color={"text.primary"}>
                            {menu_item.name}
                        </Typography>
                    </Button>
                    :
                    <CustomButton
                        aria-owns={anchorEl ? "simple-menu" : undefined}
                        aria-haspopup="true"
                        onClick={hasSubMenu ? handleOpen : handleClick}
                        onMouseOver={hasSubMenu ? handleOpen : undefined}
                    >
                        <Typography color={"text.primary"}>
                            {menu_item.name}
                        </Typography>
                    </CustomButton>
            }
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
                            <CustomMenuItem
                                key={index}
                                onClick={() => handleSubItemClick(submenuItem.link)}
                            >
                                {submenuItem.name}
                            </CustomMenuItem>
                        ))
                    }
                </Menu>
            }
        </div>
    )
}

export default MenuButton;
