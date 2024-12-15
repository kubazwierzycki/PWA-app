import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import HomeIcon from "@mui/icons-material/Home";
import ExtensionIcon from "@mui/icons-material/Extension";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import InfoIcon from "@mui/icons-material/Info";
import KeyIcon from "@mui/icons-material/Key";
import { ReactNode } from "react";

/**
 * @interface
 * @name MenuItem
 * @property {string} name - name displayed on button
 * @property {string} link - routing link for menu button
 * @property {MenuItem[]} sub - list of submenu items
 */
export interface MenuItem {
    name: string;
    link: string;
    sub: MenuItem[];
}

/**
 * Configuration object describing menu structure for menu navbar elements
 */
export const menu_structure: MenuItem[] = [
    {
        name: "Home",
        link: "/",
        sub: [],
    },
    {
        name: "Boardgames",
        link: "/boardgames",
        sub: [
            {
                name: "Collections",
                link: "/boardgames/collection",
                sub: [],
            },
            {
                name: "Update ranking",
                link: "/boardgames/compare",
                sub: [],
            },
            {
                name: "Find game",
                link: "/boardgames/search",
                sub: [],
            },
        ],
    },
    {
        name: "Play",
        link: "/play",
        sub: [
            {
                name: "Create playroom",
                link: "/play/create",
                sub: [],
            },
            {
                name: "Join playroom",
                link: "/play/join",
                sub: [],
            },
        ],
    },
    {
        name: "Profile",
        link: "/profile",
        sub: [],
    },
    {
        name: "Gameplays",
        link: "/gameplays",
        sub: [],
    },
    {
        name: "Sign In",
        link: "/signIn",
        sub: [],
    },
    {
        name: "Sign Up",
        link: "/signUp",
        sub: [],
    },
    {
        name: "About",
        link: "/about",
        sub: [],
    },
];

/**
 * Function mapping menu icons for menu elements name
 * @param {string} item - name of menu element
 * @returns {ReactNode}
 */
export const getMenuItemIcon = (item: string): ReactNode => {
    switch (item) {
        case "Home":
            return <HomeIcon />;
        case "Boardgames":
            return <ExtensionIcon />;
        case "Profile":
            return <PersonOutlineIcon />;
        case "Play":
            return <PlayArrowIcon />;
        case "Sign In":
            return <KeyIcon />;
        case "Sign Up":
            return <KeyIcon />;
        case "About":
            return <InfoIcon />;
        default:
            return <></>;
    }
};

/**
 * Function returning menu item from menu_structure config by its name
 * Assumes two layers of menu structure
 * @param name {string} - name of menu item to look for
 * @returns {MenuItem | null} returns null if not present
 */
export const getMenuItemByName = (name: string) : MenuItem | null => {
    for (let menu_item of menu_structure) {
        if (menu_item.name === name)
            return menu_item;
        for (let sub_item of menu_item.sub) {
            if (sub_item.name === name)
                return sub_item;
        }
    }
    return null;
}
