import * as React from "react";
import { ReactNode, useState } from "react";
import { Box } from "@mui/system";
import Button from "@mui/material/Button";
import { Alert, FormControl, InputLabel, OutlinedInput } from "@mui/material";
import authorisationService from "../../services/authorization.ts";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useAuth } from "../../contexts/AuthContext.tsx";
import axios from "axios";
import {
    Severity,
    Message,
    ValidationResult,
    validateUsername,
    validatePassword,
    getBggUserId,
    UsernameType,
} from "./formHelpers.ts";

/**
 * Form state.
 */
interface State {
    username: string;
    email: string;
    bggUsername: string;
    bggId: string;
    password: string;
    passwordConfirmation: string;
}

/**
 * Component with sign in logic.
 * @returns {ReactNode}
 */
export default function SignUpForm(): ReactNode {
    const [formData, setFormData] = useState<State>({
        username: "",
        email: "",
        bggUsername: "",
        bggId: "",
        password: "",
        passwordConfirmation: "",
    });

    const { setToken, setUuid, setUser } = useAuth();
    const navigate = useNavigate();
    const [alertMessage, setAlertMessage] = useState<Message>({
        message: "",
        severity: Severity.Info,
    });

    const handleChange =
        (prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
            setFormData({ ...formData, [prop]: event.target.value });
        };

    const validateForm = async (): Promise<ValidationResult> => {
        const usernamevalidationResult: ValidationResult = validateUsername(
            formData.username,
            UsernameType.CoGame
        );
        if (usernamevalidationResult !== ValidationResult.Success) {
            return usernamevalidationResult;
        }

        if (formData.bggUsername !== "") {
            const bggUsernameValidationResult: ValidationResult =
                validateUsername(formData.bggUsername, UsernameType.Bgg);
            if (bggUsernameValidationResult !== ValidationResult.Success) {
                return bggUsernameValidationResult;
            }
            const bggIdValidationResult: string = await getBggUserId(
                formData.bggUsername
            );
            if (bggIdValidationResult === "") {
                return ValidationResult.BggUserNotFound;
            } else {
                formData.bggId = bggIdValidationResult;
            }
        }

        const passwordValidationResult: ValidationResult = validatePassword(
            formData.password,
            formData.passwordConfirmation
        );
        if (passwordValidationResult !== ValidationResult.Success) {
            return passwordValidationResult;
        }

        return ValidationResult.Success;
    };

    const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setAlertMessage({
            message: "",
            severity: Severity.Info,
        });
        const validationResult: ValidationResult = await validateForm();

        if (validationResult == ValidationResult.Success) {
            try {
                const res = await authorisationService.signUp(
                    formData.email,
                    formData.username,
                    formData.password,
                    formData.bggUsername
                );
                Cookies.set("token", res.token);
                Cookies.set("uuid", res.uuid);
                setToken(res.token);
                setUuid(res.uuid);
                setUser({
                    username: formData.username,
                    bggUsername: formData.bggUsername,
                    bggId: formData.bggId,
                    email: formData.email,
                });
                navigate("/");
            } catch (err) {
                if (axios.isAxiosError(err)) {
                    switch (err.code) {
                        case "ERR_BAD_REQUEST":
                            setAlertMessage({
                                message:
                                    "Username or e-mail address is already in use.",
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
                        default:
                            setAlertMessage({
                                message: "Unknown error.",
                                severity: Severity.Error,
                            });
                    }
                } else {
                    setAlertMessage({
                        message: "Unknown error.",
                        severity: Severity.Error,
                    });
                }
            }
        } else {
            setAlertMessage({
                message: validationResult,
                severity: Severity.Warning,
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
            <FormControl
                sx={{ m: 1 }}
                variant="filled"
                color="primary"
                required={true}
            >
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
            <FormControl
                sx={{ m: 1 }}
                variant="filled"
                color="primary"
                required={true}
            >
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
                    value={formData.bggUsername}
                    onChange={handleChange("bggUsername")}
                />
            </FormControl>
            <FormControl
                sx={{ m: 1 }}
                variant="filled"
                color="primary"
                required={true}
            >
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
            <FormControl
                sx={{ m: 1 }}
                variant="filled"
                color="primary"
                required={true}
            >
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
            <Button
                sx={{ m: 1 }}
                variant="contained"
                type="submit"
                id="signUpFormSubmit"
            >
                Sign up
            </Button>
        </Box>
    );
}
