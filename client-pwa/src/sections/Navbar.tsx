import styles from '../styles/navbar.module.css'
import {AppBar, Toolbar, styled, Button} from "@mui/material";
import {ReactNode} from "react";
import DrawerMenu from "./DrawerMenu.tsx";
import NavMenuButtons from "../components/nav/NavMenuButtons.tsx";
import LogoText from "../components/logo/LogoText.tsx";
import ColorModeToggle from "../components/controls/ColorModeToggle.tsx";
import MenuIcon from "@mui/icons-material/Menu";
import {useColorMode} from "../contexts/ThemeContext.tsx";
import LogoutButton from '../components/controls/buttons/SignOutButton.tsx';
import UserAvatar from "../components/nav/UserAvatar.tsx";
import {NavContextProvider, useNavContext} from "../contexts/NavbarContext.tsx";
import UserInterfacePopover from "../components/nav/UserInterfacePopover.tsx";


/**
 * Top navbar menu component.
 * @returns {ReactNode}
 */
const Navbar = (): ReactNode => {

    const {drawerOpen, setDrawerOpen} = useNavContext();

    const Offset = styled('div')(({ theme }) => theme.mixins.toolbar);

    const closeDrawer = () => {
        setDrawerOpen(false);
    }

    return (
        <NavContextProvider>
            <nav>
                <AppBar color="default" position="sticky">
                    <Toolbar>
                        <div className={styles.navbarContainer}>
                            <div className={styles.centerPanel}>
                                <div className={styles.logoContainer}>
                                    <LogoText/>
                                </div>
                                <NavMenuButtons
                                    vertical={false}
                                    closeDrawer={closeDrawer}
                                />
                            </div>
                            <div>
                                <LogoutButton/>
                            </div>
                            <div className={styles.rightPanel}>
                                <ColorModeToggle colorMode={useColorMode()}/>
                                <div>
                                    <UserAvatar onClick={() => alert("click")}/>
                                    <UserInterfacePopover
                                        anchorEl={useNavContext().anchorEl}
                                        open={useNavContext().userPopupOpen}
                                        handleClose={useNavContext().handlePopoverClose}
                                    />
                                </div>
                                <div className={styles.menuToggle}>
                                    <Button onClick={() => setDrawerOpen(!drawerOpen)}>
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
        </NavContextProvider>
    )
}

export default Navbar;
