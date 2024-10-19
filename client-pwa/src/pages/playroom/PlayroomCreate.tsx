import {ReactNode} from "react";
import CreatePlayroomStepper from "../../components/views/CreatePlayroomStepper.tsx";
import { Box, Button, Paper, Typography } from "@mui/material";
import { useAuth } from "../../contexts/AuthContext.tsx";
import styles from "../../styles/playroomCreate.module.css"
import { useNavigate } from "react-router-dom";

/**
 * Live board game playing room creation page
 * @returns {ReactNode}
 */
const PlayroomCreate = (): ReactNode => {
    const navigate = useNavigate();
    const {uuid} = useAuth();

    return (
        <div>
            {uuid !== "" ?
                <CreatePlayroomStepper /> :
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                }}>
                    <Paper 
                    className={styles.paper}
                    >
                        <Button onClick={() => navigate('/signIn')}
                                variant="outlined"
                        >
                            Sign in
                        </Button>
                        <Typography>Don't have an account yet?</Typography>
                        <Button onClick={() => navigate('/signUp')}
                                variant="outlined"
                        >
                            Sign up
                        </Button>
                    </Paper>
                </Box>
            }
        </div>
    )
}

export default PlayroomCreate;
