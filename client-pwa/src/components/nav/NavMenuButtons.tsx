import styles from "../../styles/navbar.module.css";
import { menu_structure } from "../../config/menu_structure.tsx";
import MenuButton from "../controls/buttons/MenuButton.tsx";
import NestedMenu from "./NestedMenu.tsx";
import { ReactNode } from "react";

/**
 * Group of navigation buttons with optional submenus component
 * Uses config file for menu structure control
 * @param {boolean} vertical - specifies column (true) or row (false) orientation
 * @param {function(): void} closeDrawer - callback to close drawer menu if necessary
 * @returns {ReactNode}
 */
const NavMenuButtons = ({
    vertical,
    closeDrawer,
}: {
    vertical: boolean;
    closeDrawer: () => void;
}): ReactNode => {

    // array of menu items not present in top menu navbar
    const topNavExcluded: string[] = ["Sign In", "Sign Up", "Profile"];

    return (
        <div className={vertical ? styles.verticalMenu : styles.horizontalMenu}>
            <div className={styles.menuButtons}>
                {vertical ? (
                    <NestedMenu closeDrawer={closeDrawer} />
                ) : (
                    menu_structure.map((menu_item) =>
                        !(
                            topNavExcluded.includes(menu_item.name)
                        ) ? (
                            <MenuButton menu_item={menu_item} key={menu_item.name} />
                        ) : (
                            <></>
                        )
                    )
                )}
            </div>
        </div>
    );
};

export default NavMenuButtons;
