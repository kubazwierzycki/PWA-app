import {ButtonGroup, Popover, Typography} from "@mui/material";
import UserCard from "./UserCard.tsx";
import {useAuth} from "../../contexts/AuthContext.tsx";
import MenuButton from "../controls/buttons/MenuButton.tsx";
import {getMenuItemByName} from "../../config/menu_structure.tsx";
import styles from "../../styles/userPopover.module.css"
import SignOutButton from "../controls/buttons/SignOutButton.tsx";
import {useNavContext} from "../../contexts/NavbarContext.tsx";
import {ReactNode} from "react";

interface UserInterfacePopoverProps {
    anchorEl: HTMLButtonElement | null,
    open: boolean,
    handleClose: () => void
}

/**
 * Popover component providing access to log in/out actions and other user related pages
 * @param anchorEl {HTMLButtonElement | null} - element to which popover should be anchored
 * @param open {boolean} - state controlling whether popover is open or closed
 * @param handleClose {function() => void} - callback function to close the popover
 * @returns {ReactNode}
 */
const UserInterfacePopover = ({anchorEl, open, handleClose}: UserInterfacePopoverProps): ReactNode => {

    const {uuid} = useAuth();

    const {handlePopoverClose} = useNavContext();

    const AnonInterface = () => (
        <div className={styles.notLoggedContainer}>
            <ButtonGroup orientation="vertical" fullWidth={true} variant="outlined" onClick={handlePopoverClose}>
                <MenuButton menu_item={getMenuItemByName("Sign In")!} outlined={true}/>
            </ButtonGroup>
            <Typography style={{marginTop: "5px", marginBottom: "5px"}}>
                Don't have an account yet?
            </Typography>
            <ButtonGroup orientation="vertical" fullWidth={true} variant="outlined" onClick={handlePopoverClose}>
                <MenuButton menu_item={getMenuItemByName("Sign Up")!} outlined={true}/>
            </ButtonGroup>
        </div>
    )

    const LoggedInterface = () => (
        <div>
            <UserCard />
            <ButtonGroup orientation="vertical" fullWidth={true} variant="text" onClick={handlePopoverClose}>
                <MenuButton menu_item={getMenuItemByName("Profile")!}/>
                <MenuButton menu_item={getMenuItemByName("Gameplays")!}/>
                <MenuButton menu_item={getMenuItemByName("Collections")!}/>
                <SignOutButton />
            </ButtonGroup>
        </div>
    )

    return (
        <div>
            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                {
                    uuid === '' ? <AnonInterface/> : <LoggedInterface/>
                }
            </Popover>
        </div>
    )
}

export default UserInterfacePopover;
