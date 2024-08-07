import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { ReactNode, useState } from "react";
import {getMenuItemIcon, menu_structure, MenuItem} from "../../config/menu_structure.tsx";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.tsx";

/**
 * Nested vertical drawer menu component
 * Uses config file for menu structure control
 * @param {function(): void} closeDrawer - callback to close drawer menu if necessary
 * @returns {ReactNode}
 */
const NestedMenu = ({ closeDrawer }: { closeDrawer: () => void }): ReactNode => {
    const [expandedItems, setExpandedItems] = useState<Map<string, boolean>>(new Map());

    const navigate = useNavigate();

    const { uuid } = useAuth();

    // array of menu items not present in top menu navbar
    const topNavExcluded: string[] = ["Sign In", "Sign Up", "Profile"];

    /**
     * Function to handle nested menu links
     * @param {string} item - name of menu item element
     * @param {boolean} expandable - states if menu element has subelements
     * @param {string} link - routing link of menu element
     */
    const handleClick = (item: string, expandable: boolean, link: string) => {
        if (expandable) {
            const newExpandedItems = new Map(expandedItems);
            if (expandedItems.has(item)) {
                newExpandedItems.set(item, !expandedItems.get(item));
            } else {
                newExpandedItems.set(item, true);
            }
            setExpandedItems(newExpandedItems);
        } else {
            // not expandable, use plain link
            navigate(link);
            // close the drawer menu
            closeDrawer();
        }
    };

    const MenuListItemButton = ({name, sub, link}: MenuItem): ReactNode => {
        return (
            <ListItemButton
                key={name}
                onClick={() =>
                    handleClick(name, sub.length > 0, link)
                }
            >
                <ListItemIcon>{getMenuItemIcon(name)}</ListItemIcon>
                <ListItemText primary={name} />
                {sub.length > 0 && (
                    expandedItems.get(name) ? (
                        <ExpandLess />
                    ) : (
                        <ExpandMore />
                    )
                )}
            </ListItemButton>
        )
    }

    const MenuCollapse = (element: MenuItem): ReactNode => {
        return (
            <Collapse
                in={expandedItems.get(element.name)}
                timeout="auto"
                unmountOnExit
            >
                <List component="div" disablePadding>
                    {element.sub.map((subElement) => (
                        <ListItemButton
                            sx={{ pl: 4 }}
                            key={subElement.name}
                            onClick={() =>
                                handleClick(subElement.name, false, subElement.link)
                            }
                        >
                            <ListItemText primary={subElement.name} />
                        </ListItemButton>
                    ))}
                </List>
            </Collapse>
        )
    }

    return (
        <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }} component="nav">
            {menu_structure.map((element) =>
                {
                    if (topNavExcluded.includes(element.name)) return <div></div>;
                    else return (
                        !(uuid !== "" && (element.name === "Sign In" || element.name === "Sign Up")) && (
                            <div key={element.name}>
                                <MenuListItemButton
                                    name={element.name}
                                    link={element.link}
                                    sub={element.sub}
                                />
                                {element.sub.length > 0 && (
                                    <MenuCollapse
                                        name={element.name}
                                        link={element.link}
                                        sub={element.sub}
                                    />
                                )}
                            </div>
                        )
                    )}
                    )
                }
        </List>
    );
};

export default NestedMenu;
