import {
    Alert,
    Box,
    Button,
    FormControl,
    InputLabel,
    OutlinedInput,
} from "@mui/material";
import { ReactNode, useState } from "react";
import {
    Message,
    Severity,
    ValidationResult,
    validatePassword,
} from "./formHelpers.ts";
import authorisationService from "../../services/authorization.ts";
import { useAuth } from "../../contexts/AuthContext.tsx";
import axios from "axios";
import React from "react";

interface State {
    oldPassword: string;
    newPassword: string;
}

/**
 *
 * @returns {ReactNode}
 */

/**TODO
 * change IDs
 */
export default function PasswordUpdateForm(): ReactNode {
    const [formData, setFormData] = useState<State>({
        oldPassword: "",
        newPassword: "",
    });

    const { uuid, token } = useAuth();
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
        const vPassword: ValidationResult = validatePassword(
            fD.oldPassword,
            fD.oldPassword
        );
        if (vPassword !== ValidationResult.Success) {
            return vPassword;
        }
        return ValidationResult.Success;
    };

    const handlePasswordUpdate = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();
        const vResult = await validateForm();
        if (vResult === ValidationResult.Success) {
            try {
                await authorisationService.changePassword(
                    token,
                    uuid,
                    formData.oldPassword,
                    formData.newPassword
                );

                setAlertMessage({
                    message: "Password changed.",
                    severity: Severity.Info,
                });
                setTimeout(() => {
                    setAlertMessage({
                        message: "",
                        severity: Severity.Info,
                    });
                }, 2000);
            } catch (err) {
                if (axios.isAxiosError(err)) {
                    switch (err.code) {
                        case "ERR_BAD_REQUEST":
                            setAlertMessage({
                                message: "Old password is inccorect.",
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
            onSubmit={handlePasswordUpdate}
            id="passwordUpdateForm"
        >
            {alertMessage.message != "" && (
                <Alert
                    aria-label="passwordUpdateFormAlert"
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
            <p>Update password</p>
            <FormControl
                sx={{ m: 1 }}
                variant="filled"
                color="primary"
                required={true}
            >
                <InputLabel shrink htmlFor="oldPassword">
                    Old password
                </InputLabel>
                <OutlinedInput
                    id="oldPassword"
                    type="password"
                    value={formData.oldPassword}
                    onChange={handleChange("oldPassword")}
                />
            </FormControl>
            <FormControl
                sx={{ m: 1 }}
                variant="filled"
                color="primary"
                required={true}
            >
                <InputLabel shrink htmlFor="newPassword">
                    New password
                </InputLabel>
                <OutlinedInput
                    id="newPassword"
                    type="password"
                    value={formData.newPassword}
                    onChange={handleChange("newPassword")}
                />
            </FormControl>
            <Button
                sx={{ m: 1 }}
                variant="contained"
                type="submit"
                id="passwordUpdateFormSubmit"
            >
                Update
            </Button>
        </Box>
    );
}
