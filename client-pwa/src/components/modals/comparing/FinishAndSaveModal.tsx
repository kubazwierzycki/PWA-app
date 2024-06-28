import {Box} from "@mui/system";
import {Button, Modal, Stack, Typography} from "@mui/material";
import styles from "../../../styles/comparing.module.css";
import {Dispatch, ReactNode, SetStateAction} from "react";
import {useNavigate} from "react-router-dom";


/**
 * Modal component for handling ending comparing pairs session
 * @param {boolean} modalOpen - state controlling whether modal is open
 * @param {Dispatch<SetStateAction<boolean>>} setModalOpen - changing modal state
 * @param {() => void} handleFinish - callback to be used when user ends session
 * @returns {ReactNode}
 */
const FinishAndSaveModal = ({modalOpen, setModalOpen, handleFinish}: {
    modalOpen: boolean,
    setModalOpen: Dispatch<SetStateAction<boolean>>,
    handleFinish: () => void
}): ReactNode => {

    const style = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
    };

    const navigate = useNavigate();

    const handleDiscard = () => {
        setModalOpen(false);
        navigate("/boardgames/collection");
    }

    return (
        <Modal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2" textAlign="center">
                    Finish and save
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2, marginBottom: "10px" }}>
                    Are you sure you want finish comparing and save your ranking update?
                </Typography>
                <div className={styles.buttonsContainer}>
                    <Stack direction="row" spacing={1}>
                        <Button
                            variant="contained"
                            color="warning"
                            onClick={() => setModalOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={handleDiscard}
                        >
                            Discard
                        </Button>
                        <Button
                            variant="contained"
                            color="success"
                            onClick={handleFinish}
                        >
                            Save
                        </Button>
                    </Stack>
                </div>
            </Box>
        </Modal>
    )
}

export default FinishAndSaveModal;
