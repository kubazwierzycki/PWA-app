import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import HomeIcon from '@mui/icons-material/Home';
import ExtensionIcon from '@mui/icons-material/Extension';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import InfoIcon from '@mui/icons-material/Info';
import {ReactNode} from "react";


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
 * Configuration object describing menu structure for menu navbar elements
 */
export const menu_structure: MenuItem[] = [
    {
        name: "Home",
        link: "/",
        sub: []
    },
    {
        name: "Boardgames",
        link: "/boardgames",
        sub: [
            {
                name: "My collection",
                link: "/boardgames/collection",
                sub: []
            },
            {
                name: "Random game",
                link: "/boardgames/random",
                sub: []
            },
            {
                name: "Find game",
                link: "/boardgames/search",
                sub: []
            }
        ]
    },
    {
        name: "Play",
        link: "/play",
        sub: []
    },
    {
        name: "Profile",
        link: "/profile",
        sub: []
    },
    {
        name: "About",
        link: "/about",
        sub: []
    }
]

/**
 * Function mapping menu icons for menu elements name
 * @param {string} item - name of menu element
 * @returns {ReactNode}
 */
export const getMenuItemIcon = (item: string): ReactNode => {
    switch (item) {
        case "Home":
            return <HomeIcon/>
        case "Boardgames":
            return <ExtensionIcon/>
        case "Profile":
            return <PersonOutlineIcon/>
        case "Play":
            return <PlayArrowIcon/>
        case "About":
            return <InfoIcon/>
        default:
            return <></>
    }
}