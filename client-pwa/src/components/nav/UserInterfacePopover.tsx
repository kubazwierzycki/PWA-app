import { Popover } from "@mui/material";

interface UserInterfacePopoverProps {
    anchorEl: Element | null,
    open: boolean,
    handleClose: () => void
}


const UserInterfacePopover = ({anchorEl, open, handleClose}: UserInterfacePopoverProps) => {


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
                User Interface
            </Popover>
        </div>
    )
}

export default UserInterfacePopover;
