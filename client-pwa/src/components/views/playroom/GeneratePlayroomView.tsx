import {Alert, Button, Card, Input, Snackbar, Typography} from "@mui/material";
import {Dispatch, ReactNode, SetStateAction, SyntheticEvent, useState} from "react";
import styles from "../../../styles/createPlayroom.module.css"
import {createPlayroom} from "../../../services/playroom.ts";


interface IGeneratePlayroomProps {
    code: string
    setCode: Dispatch<SetStateAction<string>>
}

/**
 * View component enabling code generation for a new playroom
 * @param {string} code - code generated for new playroom
 * @param {Dispatch<SetStateAction<string>>} setCode - function setting code state
 * @returns {ReactNode}
 */
const GeneratePlayroomView = ({code, setCode}: IGeneratePlayroomProps): ReactNode => {

    // has the playroom been created already
    const [created, setCreated] = useState(false);

    // is snackbar info open
    const [open, setOpen] = useState(false);

    const handleClose = (_event: SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    /**
     * Function generating playroom code for a new playroom
     * Assumes 16 characters long code
     * Uses numbers, upper and lower case letters
     * Sets resulting code to state
     * @returns {Promise<void>}
     */
    const generateCode = async (): Promise<void> => {
        const code = await createPlayroom();
        setCode(code);
        setOpen(true);
        setCreated(true);
    }

    return (
        <Card className={styles.generateBox} sx={{borderRadius: "20px"}}>
            <Button
                variant="contained"
                onClick={generateCode}
                style={{marginBottom: "20px"}}
                disabled={created}
            >
                Create your playroom
            </Button>
            <Input
                disabled={true}
                value={"Code: \t\t" + code}
                size="medium"
                style={{width: "80%", marginBottom: "15px"}}
            />
            {
                code !== "" ?
                    <div>
                        <Typography
                            variant="body2"
                            style={{marginBottom: "15px"}}
                            color={"success.main"}
                        >
                            You've successfully created a playroom
                        </Typography>
                    </div> :
                    <></>
            }
            <Typography variant="body2">
                Please request creating new playroom to generate code and <b>choose next when ready</b>
            </Typography>
            <Snackbar
                open={open}
                autoHideDuration={6000}
                onClose={handleClose}
            >
                <Alert
                    onClose={handleClose}
                    severity="success"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    Playroom has been created
                </Alert>
            </Snackbar>
        </Card>
    )
}

export default GeneratePlayroomView;
