import styles from "../styles/navbar.module.css";
import {menu_structure} from "../config/menu_structure.tsx";
import MenuButton from "./MenuButton.tsx";
import NestedMenu from "./NestedMenu.tsx";
import React from "react";

const NavMenuButtons = ({vertical, setDrawerOpen}: {vertical: boolean, setDrawerOpen: React.Dispatch<boolean>}) => {

    return (
        <div className={vertical ? styles.verticalMenu : styles.horizontalMenu}>
            <div className={styles.menuButtons}>
                {
                    vertical ?
                        <NestedMenu setDrawerOpen={setDrawerOpen}/>
                        :
                        menu_structure.map(menu_item =>
                            <MenuButton menu_item={menu_item} key={menu_item.name}/>
                        )
                }
            </div>
        </div>
    )
}

export default NavMenuButtons;