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
        const fD = formData;

        const vUsername: ValidationResult = validateUsername(
            fD.username,
            UsernameType.CoGame
        );
        if (vUsername !== ValidationResult.Success) {
            return vUsername;
        }

        if (fD.bggUsername !== "") {
            const vBggUsername: ValidationResult = validateUsername(
                fD.bggUsername,
                UsernameType.Bgg
            );
            if (vBggUsername !== ValidationResult.Success) {
                return vBggUsername;
            }
            const vBggId: string = await getBggUserId(fD.bggUsername);
            if (vBggId === "") {
                return ValidationResult.BggUserNotFound;
            } else {
                fD.bggId = vBggId;
            }
        }

        const vPassword: ValidationResult = validatePassword(
            fD.password,
            fD.passwordConfirmation
        );
        if (vPassword !== ValidationResult.Success) {
            return vPassword;
        }

        return ValidationResult.Success;
    };

    const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setAlertMessage({
            message: "",
            severity: Severity.Info,
        });
        const fD = formData;
        const vResult: ValidationResult = await validateForm();

        if (vResult == ValidationResult.Success) {
            try {
                const res = await authorisationService.signUp(
                    fD.email,
                    fD.username,
                    fD.password,
                    fD.bggUsername
                );
                Cookies.set("token", res.token);
                Cookies.set("uuid", res.uuid);
                setToken(res.token);
                setUuid(res.uuid);
                setUser({
                    username: fD.username,
                    bggUsername: fD.bggUsername,
                    bggId: fD.bggId,
                    email: fD.email,
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
                message: vResult,
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
