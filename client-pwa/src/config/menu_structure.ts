
interface MenuItem {
    name: string;
    link: string;
    sub: MenuItem[];
}


const menu_structure: MenuItem[] = [
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
        name: "profile",
        link: "/profile",
        sub: []
    },
    {
        name: "about",
        link: "/about",
        sub: []
    }
]

export default menu_structure;
