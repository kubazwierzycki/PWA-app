import * as React from "react";
import { ReactNode, useState } from "react";
import { Box } from "@mui/system";
import Button from "@mui/material/Button";
import { Alert, FormControl, InputLabel, OutlinedInput } from "@mui/material";

/**
 * Form state.
 */
interface State {
    username: string;
    email: string;
    bgg: string;
    password: string;
    passwordConfirmation: string;
}

enum Severity {
    Error = "error",
    Info = "info",
    Success = "success",
    Warning = "warning",
}

interface Message {
    message: string;
    severity: Severity;
}
/**
 * Component with sign in logic.
 * @returns {ReactNode}
 */
export default function SignUpForm(): ReactNode {
    const [formData, setAuthData] = useState<State>({
        username: "",
        email: "",
        bgg: "",
        password: "",
        passwordConfirmation: "",
    });

    const [alertMessage, setAlertMessage] = useState<Message>({
        message: "",
        severity: Severity.Info,
    });

    const handleChange = (prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setAuthData({ ...formData, [prop]: event.target.value });
    };

    const handleSignUp = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    };
    return (
        <Box
            component="form"
            onSubmit={handleSignUp}
            id="signUpForm"
            sx={{
                display: "flex",
                flexDirection: "column",
                flexWrap: "wrap",
                boxShadow: 1,
                borderRadius: 2,
                maxWidth: "300px",
                p: 2,
            }}
        >
            {alertMessage.message != "" && (
                <Alert
                    severity={alertMessage.severity}
                    onClose={() =>
                        setAlertMessage({
                            message: "",
                            severity: Severity.Info,
                        })
                    }
                >
                    {alertMessage.message}
                </Alert>
            )}
            <FormControl sx={{ m: 1 }} variant="filled" color="primary" required={true}>
                <InputLabel shrink htmlFor="signUpFormUsername">
                    Username
                </InputLabel>
                <OutlinedInput
                    id="signUpFormUsername"
                    type="text"
                    value={formData.username}
                    onChange={handleChange("username")}
                />
            </FormControl>
            <FormControl sx={{ m: 1 }} variant="filled" color="primary" required={true}>
                <InputLabel shrink htmlFor="signUpFormEmail">
                    E-mail
                </InputLabel>
                <OutlinedInput
                    id="signUpFormEmail"
                    type="text"
                    value={formData.email}
                    onChange={handleChange("email")}
                />
            </FormControl>
            <FormControl sx={{ m: 1 }} variant="filled" color="primary">
                <InputLabel shrink htmlFor="signUpFormBGG">
                    BGG Username
                </InputLabel>
                <OutlinedInput
                    id="signUpFormBGG"
                    type="text"
                    value={formData.bgg}
                    onChange={handleChange("bgg")}
                />
            </FormControl>
            <FormControl sx={{ m: 1 }} variant="filled" color="primary" required={true}>
                <InputLabel shrink htmlFor="signUpFormPassword">
                    Password
                </InputLabel>
                <OutlinedInput
                    id="signUpFormPassword"
                    value={formData.password}
                    onChange={handleChange("password")}
                />
            </FormControl>
            <FormControl sx={{ m: 1 }} variant="filled" color="primary" required={true}>
                <InputLabel shrink htmlFor="signUpFormPasswordConfirmation">
                    Password confirmation
                </InputLabel>
                <OutlinedInput
                    id="signUpFormPasswordConfirmation"
                    value={formData.passwordConfirmation}
                    onChange={handleChange("passwordConfirmation")}
                />
            </FormControl>
            <Button sx={{ m: 1 }} variant="contained" type="submit" id="signUpFormSubmit">
                Sign up
            </Button>
        </Box>
    );
}
