import {Box} from "@mui/system";
import {Button, Modal, Typography} from "@mui/material";
import {Dispatch, ReactNode, SetStateAction} from "react";
import {useNavigate} from "react-router-dom";


/**
 * Modal showing information during comparing pairs session
 * @param {boolean} compareModalOpen - modal state
 * @param {Dispatch<SetStateAction<boolean>>} setCompareModalOpen - modal state change function
 * @param {string} header - modal title header
 * @param {string} text - text to be shown under the header
 * @param {string} actionText - action button text
 * @param {string} mode - MUI color class, decides modal type
 * @returns {ReactNode}
 */
const CompareModal = ({compareModalOpen, setCompareModalOpen, header, text, actionText, mode}: {
    compareModalOpen: boolean,
    setCompareModalOpen: Dispatch<SetStateAction<boolean>>,
    header: string,
    text: string,
    actionText: string
    mode: "success" | "error" | "info" | "warning" | undefined
}): ReactNode => {

    const style = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4
    };

    const navigate = useNavigate();

    const handleClose = () => {
        setCompareModalOpen(false)
        if (mode === "success") {
            navigate("/boardgames/collection");
        }
    }

    return (
        <Modal
            open={compareModalOpen}
            onClose={handleClose}
            aria-labelledby="Comparing error"
            aria-describedby={text}
        >
            <Box sx={style}>
                <Typography
                    id="modal-modal-title"
                    variant="h6" component="h2"
                    textAlign="center"
                    color={mode}
                >
                    {header}
                </Typography>
                <Typography
                    id="modal-modal-description"
                    sx={{ mt: 2, marginBottom: "10px" }}
                    textAlign="center"
                >
                    {text}
                </Typography>
                <div style={{width: "100%", display: "flex", justifyContent: "center"}}>
                    <Button
                        variant="contained"
                        color={mode}
                        onClick={handleClose}
                    >
                        {actionText}
                    </Button>
                </div>
            </Box>
        </Modal>
    )
}

export default CompareModal;
