import {Button, Card, Input, Typography} from "@mui/material";
import {Dispatch, ReactNode, SetStateAction} from "react";
import styles from "../../../styles/createPlayroom.module.css"


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

    /**
     * Function generating playroom code for a new playroom
     * Assumes 16 characters long code
     * Uses numbers, upper and lower case letters
     * Sets resulting code to state
     * @returns {void}
     */
    const generateCode = (): void => {
        // code length
        const length = 16;
        // possible characters
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let code = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            code += characters.charAt(randomIndex);
        }
        setCode(code);
    }

    return (
        <Card className={styles.generateBox} sx={{borderRadius: "20px"}}>
            <Button
                variant="contained"
                onClick={generateCode}
                style={{marginBottom: "20px"}}
            >
                Generate Playroom Code
            </Button>
            <Input
                disabled={true}
                value={"Code: \t\t" + code}
                size="medium"
                style={{width: "80%", marginBottom: "10px"}}
            />
            <Typography>
                Please generate code and choose next when ready
            </Typography>
        </Card>
    )
}

export default GeneratePlayroomView;
