import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import HomeIcon from '@mui/icons-material/Home';
import ExtensionIcon from '@mui/icons-material/Extension';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import InfoIcon from '@mui/icons-material/Info';


interface MenuItem {
    name: string;
    link: string;
    sub: MenuItem[];
}


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

export const getMenuItemIcon = (item: string) => {
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
