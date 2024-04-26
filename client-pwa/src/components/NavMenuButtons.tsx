import styles from "../styles/navbar.module.css";
import menu_structure from "../config/menu_structure.ts";
import MenuButton from "./MenuButton.tsx";

const NavMenuButtons = ({vertical}: {vertical: boolean}) => {

    return (
        <div className={vertical ? styles.verticalMenu : styles.horizontalMenu}>
            <div className={styles.menuButtons}>
                {
                    menu_structure.map(menu_item =>
                        <MenuButton menu_item={menu_item}/>
                    )
                }
            </div>
        </div>
    )
}

export default NavMenuButtons;