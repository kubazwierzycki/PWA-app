import styles from "../styles/navbar.module.css";
import {Drawer} from "@mui/material";
import NavMenuButtons from "../components/NavMenuButtons.tsx";
import Logo from "../components/Logo.tsx";

interface DrawerState {
    drawerOpen: boolean,
    setDrawerOpen: (newState: boolean) => void
}

const DrawerMenu = ({drawerOpen, setDrawerOpen}: DrawerState) => {

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