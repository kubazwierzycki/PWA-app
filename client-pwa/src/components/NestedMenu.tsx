import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { ReactNode, useState } from "react";
import { getMenuItemIcon, menu_structure } from "../config/menu_structure.tsx";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.tsx";

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

    return (
        <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }} component="nav">
            {menu_structure.map((element) =>
                !(uuid !== "" && (element.name === "Sign In" || element.name === "Sign Up")) ? (
                    <div key={element.name}>
                        <ListItemButton
                            key={element.name}
                            onClick={() =>
                                handleClick(element.name, element.sub.length > 0, element.link)
                            }
                        >
                            <ListItemIcon>{getMenuItemIcon(element.name)}</ListItemIcon>
                            <ListItemText primary={element.name} />
                            {element.sub.length > 0 ? (
                                expandedItems.get(element.name) ? (
                                    <ExpandLess />
                                ) : (
                                    <ExpandMore />
                                )
                            ) : (
                                <></>
                            )}
                        </ListItemButton>
                        {element.sub.length > 0 && (
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
                        )}
                    </div>
                ) : (
                    <></>
                )
            )}
        </List>
    );
};

export default NestedMenu;
