import styles from '../styles/navbar.module.css'
import {AppBar, Toolbar, styled, Button} from "@mui/material";
import {useState} from "react";
import DrawerMenu from "./DrawerMenu.tsx";
import NavMenuButtons from "../components/NavMenuButtons.tsx";
import LongLogo from "../components/LongLogo.tsx";
import ColorModeToggle from "../components/ColorModeToggle.tsx";
import MenuIcon from "@mui/icons-material/Menu";


/**
 * Top navbar menu component.
 * @constructor
 */
const Navbar = () => {

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
                                <LongLogo/>
                            </div>
                            <NavMenuButtons
                                vertical={false}
                                closeDrawer={closeDrawer}
                            />
                        </div>
                        <div className={styles.rightPanel}>
                            <ColorModeToggle />
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
