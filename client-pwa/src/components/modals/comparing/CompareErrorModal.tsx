import {Box} from "@mui/system";
import {Button, Modal, Typography} from "@mui/material";
import {Dispatch, SetStateAction} from "react";


const CompareErrorModal = ({errorModalOpen, setErrorModalOpen, text}: {
    errorModalOpen: boolean,
    setErrorModalOpen: Dispatch<SetStateAction<boolean>>,
    text: string
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
            open={errorModalOpen}
            onClose={() => setErrorModalOpen(false)}
            aria-labelledby="Comparing error"
            aria-describedby={text}
        >
            <Box sx={style}>
                <Typography
                    id="modal-modal-title"
                    variant="h6" component="h2"
                    textAlign="center"
                    color={"error"}
                >
                    Comparing error
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
                        color="error"
                        onClick={() => setErrorModalOpen(false)}
                    >
                        Close
                    </Button>
                </div>
            </Box>
        </Modal>
    )
}

export default CompareErrorModal;
