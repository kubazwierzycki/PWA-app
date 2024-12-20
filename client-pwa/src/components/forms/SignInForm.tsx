import * as React from "react";
import { ReactNode, useState } from "react";
import { Box } from "@mui/system";
import Button from "@mui/material/Button";
import {
    Alert,
    FormControl,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import authorisationService from "../../services/authorization.ts";
import bggService from "../../services/bgg.ts";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useAuth } from "../../contexts/AuthContext.tsx";
import axios from "axios";
import {
    Severity,
    Message,
    ValidationResult,
    UsernameType,
    validatePassword,
    validateUsername,
} from "./formHelpers.ts";
/**
 * Form state.
 */
interface State {
    username: string;
    password: string;
}

/**
 * Component with sign in logic.
 * @returns {ReactNode}
 */
export default function SignInForm(): ReactNode {
    const [formData, setFormData] = useState<State>({
        username: "",
        password: "",
    });

    const { setToken, setUuid, setUser } = useAuth();

    const [alertMessage, setAlertMessage] = useState<Message>({
        message: "",
        severity: Severity.Info,
    });

    const navigate = useNavigate();

    const handleChange =
        (prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
            setFormData({ ...formData, [prop]: event.target.value });
        };

    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (
        event: React.MouseEvent<HTMLButtonElement>
    ) => {
        event.preventDefault();
    };

    const validateForm = (): ValidationResult => {
        const usernameValidationResult: ValidationResult = validateUsername(
            formData.username,
            UsernameType.CoGame
        );
        if (usernameValidationResult !== ValidationResult.Success) {
            return usernameValidationResult;
        }

        const passwordValidationResult: ValidationResult = validatePassword(
            formData.password,
            formData.password
        );
        if (passwordValidationResult !== ValidationResult.Success) {
            return passwordValidationResult;
        }

        return ValidationResult.Success;
    };

    const resetFormData = () => {
        setAlertMessage({
            message: "",
            severity: Severity.Info,
        });
        setFormData({
            username: "",
            password: "",
        });
        setShowPassword(false);
    };

    const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        resetFormData();
        const validationResult: ValidationResult = validateForm();

        if (validationResult == ValidationResult.Success) {
            try {
                const resA = await authorisationService.signIn(
                    formData.username,
                    formData.password
                );
                Cookies.set("token", resA.token);
                Cookies.set("uuid", resA.uuid);
                setToken(resA.token);
                setUuid(resA.uuid);

                const resB = await authorisationService.getUserByUuid(
                    resA.uuid
                );

                const resC = await bggService.getUserByUsername(
                    resB.bggUsername
                );
                const bggId = bggService.getUserIdFromResponse(resC);

                setUser({
                    username: formData.username,
                    email: resB.email,
                    bggUsername: resB.bggUsername,
                    bggId: bggId,
                });
                navigate("/");
            } catch (err) {
                if (axios.isAxiosError(err)) {
                    switch (err.code) {
                        case "ERR_BAD_REQUEST":
                            setAlertMessage({
                                message: "Incorrect username or password.",
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
                message: "Incorrect username or password.",
                severity: Severity.Warning,
            });
        }
    };
    return (
        <Box
            component="form"
            onSubmit={handleSignIn}
            id="signInForm"
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
                    aria-label="formAlert"
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
                <InputLabel shrink htmlFor="signInFormUsername">
                    Username
                </InputLabel>
                <OutlinedInput
                    id="signInFormUsername"
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
                <InputLabel shrink htmlFor="signInFormPassword">
                    Password
                </InputLabel>
                <OutlinedInput
                    id="signInFormPassword"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange("password")}
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                edge="end"
                            >
                                {showPassword ? (
                                    <VisibilityOff />
                                ) : (
                                    <Visibility />
                                )}
                            </IconButton>
                        </InputAdornment>
                    }
                />
            </FormControl>
            <Button
                sx={{ m: 1 }}
                variant="contained"
                type="submit"
                id="signInFormSubmit"
            >
                Sign in
            </Button>
        </Box>
    );
}
