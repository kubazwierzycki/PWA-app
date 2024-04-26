import styles from "../styles/navbar.module.css";
import {Drawer} from "@mui/material";
import NavMenuButtons from "../components/NavMenuButtons.tsx";

interface DrawerState {
    drawerOpen: boolean,
    setDrawerOpen: (newState: boolean) => void
}

const DrawerMenu = ({drawerOpen, setDrawerOpen}: DrawerState) => {

    return (
        <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
            <div className={styles.drawerContainer}>
                <NavMenuButtons
                    vertical={true}
                />
            </div>
        </Drawer>
    )
}

export default DrawerMenu;