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
import authorisationService from "../services/authorization.tsx";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useAuth } from "../contexts/AuthContext.tsx";

/**
 * Form state.
 */
interface State {
    username: string;
    password: string;
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
export default function SignInForm(): ReactNode {
    const [authData, setAuthData] = useState<State>({
        username: "",
        password: "",
    });
    const { setToken, setUuid } = useAuth();
    const [alertMessage, setAlertMessage] = useState<Message>({
        message: "",
        severity: Severity.Info,
    });

    const navigate = useNavigate();
    const handleChange =
        (prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
            setAuthData({ ...authData, [prop]: event.target.value });
        };

    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (
        event: React.MouseEvent<HTMLButtonElement>
    ) => {
        event.preventDefault();
    };

    const handleSignIn = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        let hasError: boolean = false;
        if (authData.username == "") {
            hasError = true;
        }
        if (authData.password == "") {
            hasError = true;
        }
        setAuthData({
            username: "",
            password: "",
        });
        setShowPassword(false);
        if (!hasError) {
            authorisationService
                .signIn(authData.username, authData.password)
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
                    }
                });
        }
    };
    return (
        <Box
            component="form"
            onSubmit={handleSignIn}
            id="authForm"
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
            {alertMessage.message != "" ? (
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
            ) : (
                false
            )}
            <FormControl
                sx={{ m: 1 }}
                variant="filled"
                color="primary"
                required={true}
            >
                <InputLabel shrink htmlFor="authFormUsername">
                    Username
                </InputLabel>
                <OutlinedInput
                    id="authFormUsername"
                    type="text"
                    value={authData.username}
                    onChange={handleChange("username")}
                />
            </FormControl>
            <FormControl
                sx={{ m: 1 }}
                variant="filled"
                color="primary"
                required={true}
            >
                <InputLabel shrink htmlFor="authFormPassword">
                    Password
                </InputLabel>
                <OutlinedInput
                    id="authFormPassword"
                    type={showPassword ? "text" : "password"}
                    value={authData.password}
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
                id="authFormSubmit"
            >
                Sign in
            </Button>
        </Box>
    );
}
