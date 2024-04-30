import styles from "../styles/navbar.module.css";
import {Drawer} from "@mui/material";
import NavMenuButtons from "../components/NavMenuButtons.tsx";
import Logo from "../components/Logo.tsx";
import {ReactNode} from "react";

interface DrawerState {
    drawerOpen: boolean,
    setDrawerOpen: (newState: boolean) => void
}

/**
 * Side drawer menu component
 * @param {boolean} drawerOpen - state controlling visibility of drawer menu
 * @param {function(boolean): void} setDrawerOpen - function changing drawer state
 * @returns {ReactNode}
 */
const DrawerMenu = ({drawerOpen, setDrawerOpen}: DrawerState): ReactNode => {

    return (
        <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
            <div className={styles.drawerContainer}>
                <div className={styles.drawerLogo}>
                    <Logo />
                    <div className={styles.logoText}>
                        CoGame
                    </div>
                </div>
                <NavMenuButtons
                    vertical={true}
                    closeDrawer={() => setDrawerOpen(false)}
                />
            </div>
        </Drawer>
    )
}

export default DrawerMenu;