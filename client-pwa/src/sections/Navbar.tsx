import LongLogo from '../components/LongLogo.tsx';
import styles from '../styles/navbar.module.css'
import MenuButton from "../components/MenuButton.tsx";
import {AppBar, Button, Drawer, Toolbar, styled} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import {useState} from "react";
import menu_structure from "../config/menu_structure.ts";


/**
 * Top navbar menu component.
 * @constructor
 */
const Navbar = () => {

    const [drawerOpen, setDrawerOpen] = useState(false);

    const Offset = styled('div')(({ theme }) => theme.mixins.toolbar);

    return (
        <nav>
            <AppBar color="default" position="sticky">
                <Toolbar>
                    <div className={styles.navbarContainer}>
                        <LongLogo/>
                        <div className={styles.menuButtons}>
                            {
                                menu_structure.map(menu_item =>
                                    <MenuButton menu_item={menu_item} />
                                )
                            }
                        </div>
                        <div className={styles.menuToggle}>
                            <Button onClick={() => setDrawerOpen(!drawerOpen)}>
                                <MenuIcon />
                            </Button>
                        </div>
                    </div>
                </Toolbar>
            </AppBar>
            <Offset/>
            <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
                <div className={styles.drawerContainer}>

                </div>
            </Drawer>
        </nav>
    )
}

export default Navbar;
