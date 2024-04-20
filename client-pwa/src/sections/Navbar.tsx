import LongLogo from '../components/LongLogo.tsx';
import styles from '../styles/navbar.module.css'
import MenuButton from "../components/MenuButton.tsx";
import {Button} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';


/**
 * Top navbar menu component.
 * @constructor
 */
const Navbar = () => {


    return (
        <div className={styles.navbarContainer}>
            <LongLogo/>
            <div className={styles.menuButtons}>
                <MenuButton text={"Home"} />
                <MenuButton text={"Boardgames"} />
                <MenuButton text={"Play"} />
                <MenuButton text={"Profile"} />
                <MenuButton text={"About"} />
            </div>
            <div className={styles.menuToggle}>
                <Button>
                    <MenuIcon />
                </Button>
            </div>
        </div>
    )
}

export default Navbar;