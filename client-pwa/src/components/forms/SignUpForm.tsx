import * as React from "react";
import { ReactNode, useState } from "react";
import { Box } from "@mui/system";
import Button from "@mui/material/Button";
import { Alert, FormControl, InputLabel, OutlinedInput } from "@mui/material";
import authorisationService from "../../services/authorization.tsx";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useAuth } from "../../contexts/AuthContext.tsx";
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
    const [formData, setFormData] = useState<State>({
        username: "",
        email: "",
        bgg: "",
        password: "",
        passwordConfirmation: "",
    });

    const { setToken, setUuid } = useAuth();
    const navigate = useNavigate();
    const [alertMessage, setAlertMessage] = useState<Message>({
        message: "",
        severity: Severity.Info,
    });

    const handleChange = (prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [prop]: event.target.value });
    };

    const validateUsername = (username: string, type: string): boolean => {
        const usernameLength = username.length;
        if (usernameLength < 4) {
            setAlertMessage({
                message: `${type} must be at least 4 characters long.`,
                severity: Severity.Warning,
            });
            return false;
        }
        if (usernameLength > 20) {
            setAlertMessage({
                message: `${type} must be no more than 20 characters long.`,
                severity: Severity.Warning,
            });
            return false;
        }
        const regexp = new RegExp("^[a-zA-Z][\\w\\d]{3,19}$");
        const hasValidCharacters = regexp.test(username);
        console.log("hasValidCharacters: ", hasValidCharacters, username);
        if (!hasValidCharacters) {
            setAlertMessage({
                message: `${type} must start with a letter, and may contain only letters, numbers and underscores (_).`,
                severity: Severity.Warning,
            });
            return false;
        }

        return true;
    };

    const validatePassword = (password: string, passwordConfirmation: string): boolean => {
        if (password.length < 6) {
            setAlertMessage({
                message: "Password must be at least  6 characters long.",
                severity: Severity.Warning,
            });
            return false;
        }
        if (password !== passwordConfirmation) {
            setAlertMessage({
                message: "Password and password confirmation do not match.",
                severity: Severity.Warning,
            });
            return false;
        }
        return true;
    };

    const validateForm = (): boolean => {
        const fD = formData;

        const isValid =
            validateUsername(fD.username, "Username") &&
            (fD.bgg === "" || validateUsername(fD.bgg, "BGG")) &&
            validatePassword(fD.password, fD.passwordConfirmation);
        return isValid;
    };

    const handleSignUp = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setAlertMessage({
            message: "",
            severity: Severity.Info,
        });
        const fD = formData;
        const isValid: boolean = validateForm();

        if (isValid) {
            authorisationService
                .singUp(fD.email, fD.username, fD.password, fD.bgg)
                .then((res) => {
                    navigate("/");
                    Cookies.set("token", res.token);
                    Cookies.set("uuid", res.uuid);
                    setToken(res.token);
                    setUuid(res.uuid);
                })
                .catch((err) => {
                    console.log(err);
                    switch (err.code) {
                        case "ERR_BAD_REQUEST":
                            setAlertMessage({
                                message: "Username or e-mail address is already in use.",
                                severity: Severity.Warning,
                            });
                            break;
                        case "ERR_BAD_RESPONSE":
                            setAlertMessage({
                                message: "Internal server error.",
                                severity: Severity.Error,
                            });
                            break;
                        case "ERR_NETWORK":
                            setAlertMessage({
                                message: "Network error.",
                                severity: Severity.Error,
                            });
                            break;
                    }
                });
        }
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
                    type="email"
                    value={formData.email}
                    onChange={handleChange("email")}
                />
            </FormControl>
            <FormControl sx={{ m: 1 }} variant="filled" color="primary">
                <InputLabel shrink htmlFor="signUpFormBGG">
                    BGG Username (Not required)
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
                    type="password"
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
                    type="password"
                    onChange={handleChange("passwordConfirmation")}
                />
            </FormControl>
            <Button sx={{ m: 1 }} variant="contained" type="submit" id="signUpFormSubmit">
                Sign up
            </Button>
        </Box>
    );
}
