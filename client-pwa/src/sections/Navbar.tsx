import LongLogo from '../components/LongLogo.tsx';
import styles from '../styles/navbar.module.css'
import MenuButton from "../components/MenuButton.tsx";


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
        </div>
    )
}

export default Navbar;