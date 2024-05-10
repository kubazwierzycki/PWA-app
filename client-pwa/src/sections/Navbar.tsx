import styles from '../styles/navbar.module.css'
import {AppBar, Toolbar, styled, Button} from "@mui/material";
import {ReactNode, useState} from "react";
import DrawerMenu from "./DrawerMenu.tsx";
import NavMenuButtons from "../components/nav/NavMenuButtons.tsx";
import LogoText from "../components/logo/LogoText.tsx";
import ColorModeToggle from "../components/controls/ColorModeToggle.tsx";
import MenuIcon from "@mui/icons-material/Menu";
import {useColorMode} from "../contexts/ThemeContext.tsx";
import LogoutButton from '../components/controls/buttons/SignOutButton.tsx';


/**
 * Top navbar menu component.
 * @returns {ReactNode}
 */
const Navbar = (): ReactNode => {

    // state controlling drawer menu visibility
    const [drawerOpen, setDrawerOpen] = useState(false);

    const Offset = styled('div')(({ theme }) => theme.mixins.toolbar);

    const closeDrawer = () => {
        setDrawerOpen(false);
    }

    return (
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
                            <div className={styles.menuToggle}>
                                <Button onClick={() => setDrawerOpen(!drawerOpen)}>
                                    <MenuIcon />
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
