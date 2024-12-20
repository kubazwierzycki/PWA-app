import styles from '../styles/navbar.module.css'
import {AppBar, Toolbar, styled, Button} from "@mui/material";
import {ReactNode} from "react";
import DrawerMenu from "./DrawerMenu.tsx";
import NavMenuButtons from "../components/nav/NavMenuButtons.tsx";
import ColorModeToggle from "../components/controls/ColorModeToggle.tsx";
import MenuIcon from "@mui/icons-material/Menu";
import {useColorMode} from "../contexts/ThemeContext.tsx";
import UserAvatar from "../components/nav/UserAvatar.tsx";
import {useNavContext} from "../contexts/NavbarContext.tsx";
import UserInterfacePopover from "../components/nav/UserInterfacePopover.tsx";
import Logo from "../components/logo/LogoHourglass.tsx";


/**
 * Top navbar menu component.
 * @returns {ReactNode}
 */
const Navbar = (): ReactNode => {

    const {drawerOpen, setDrawerOpen} = useNavContext();
    const {anchorEl, setAnchorEl, userPopupOpen, setUserPopupOpen, handlePopoverClose} = useNavContext();

    // custom height navbar offset
    const Offset = styled('div')(({ theme }) => ({
        ...theme.mixins.toolbar,
        minHeight: '32px', // adjust this value for desired height
        [`${theme.breakpoints.up('sm')}`]: {
            minHeight: '32px', // adjust this value for desired height for larger screens
        },
    }));

    const handleDrawerClick = () => {
        setDrawerOpen(!drawerOpen);
    }

    const handlePopoverOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
        setUserPopupOpen(true);
        setAnchorEl(event.currentTarget);
    }

    return (
        <nav>
            <AppBar color="default" position="sticky">
                <Toolbar>
                    <div className={styles.navbarContainer}>
                        <div className={styles.centerPanel}>
                            <div className={styles.logoContainer}>
                                <div className={styles.navLogo}>
                                    <Logo/>
                                    <div className={styles.logoTextNavbar}>
                                        CoGame
                                    </div>
                                </div>
                            </div>
                            <NavMenuButtons
                                vertical={false}
                                closeDrawer={() => setDrawerOpen(false)}
                            />
                        </div>
                        <div className={styles.rightPanel}>
                            <ColorModeToggle colorMode={useColorMode()}/>
                            <div>
                                <UserAvatar onClick={handlePopoverOpen}/>
                                <UserInterfacePopover
                                    anchorEl={anchorEl}
                                    open={userPopupOpen}
                                    handleClose={handlePopoverClose}
                                />
                            </div>
                            <div className={styles.menuToggle}>
                                <Button onClick={handleDrawerClick}>
                                    <MenuIcon/>
                                </Button>
                            </div>
                        </div>
                    </div>
                </Toolbar>
            </AppBar>
            <Offset/>
            <DrawerMenu
                drawerOpen={drawerOpen}
                setDrawerOpen={setDrawerOpen}
            />
        </nav>
    )
}

export default Navbar;
