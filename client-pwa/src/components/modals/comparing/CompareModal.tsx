import {Box} from "@mui/system";
import {Button, Modal, Typography} from "@mui/material";
import {Dispatch, SetStateAction} from "react";


/**
 *
 * @param compareModalOpen
 * @param setCompareModalOpen
 * @param header
 * @param text
 * @param actionText
 * @param mode
 * @constructor
 */
const CompareModal = ({compareModalOpen, setCompareModalOpen, header, text, actionText, mode}: {
    compareModalOpen: boolean,
    setCompareModalOpen: Dispatch<SetStateAction<boolean>>,
    header: string,
    text: string,
    actionText: string
    mode: "success" | "error" | "info" | "warning" | undefined
}) => {

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

    return (
        <Modal
            open={compareModalOpen}
            onClose={() => setCompareModalOpen(false)}
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
                        onClick={() => setCompareModalOpen(false)}
                    >
                        {actionText}
                    </Button>
                </div>
            </Box>
        </Modal>
    )
}

export default CompareModal;
