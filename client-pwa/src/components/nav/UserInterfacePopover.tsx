import {Popover, Typography} from "@mui/material";
import UserCard from "./UserCard.tsx";
import {useAuth} from "../../contexts/AuthContext.tsx";
import MenuButton from "../controls/buttons/MenuButton.tsx";
import {getMenuItemByName} from "../../config/menu_structure.tsx";
import styles from "../../styles/userPopover.module.css"

interface UserInterfacePopoverProps {
    anchorEl: HTMLButtonElement | null,
    open: boolean,
    handleClose: () => void
}


const UserInterfacePopover = ({anchorEl, open, handleClose}: UserInterfacePopoverProps) => {

    const {uuid} = useAuth();

    const AnonInterface = () => (
        <div className={styles.notLoggedContainer}>
            <MenuButton menu_item={getMenuItemByName("Sign In")!}/>
            <Typography>Don't have an account yet?</Typography>
            <MenuButton menu_item={getMenuItemByName("Sign Up")!}/>
        </div>
    )

    const LoggedInterface = () => (
        <div>
            <UserCard />
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
