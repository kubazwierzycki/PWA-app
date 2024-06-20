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
    UsernameType,
    ValidationResult,
    getBggUserId,
    validateUsername,
} from "./formHelpers.ts";
import authorisationService from "../../services/authorization.ts";
import { useAuth } from "../../contexts/AuthContext.tsx";
import axios from "axios";
import React from "react";

interface State {
    bggUsername: string;
    bggId: string;
}

/**
 *
 * @returns {ReactNode}
 */

/**TODO
 * change IDs
 */
export default function BggUsernameUpdateForm(): ReactNode {
    const [formData, setFormData] = useState<State>({
        bggUsername: "",
        bggId: "",
    });

    const { uuid, token, user, setUser } = useAuth();
    const [alertMessage, setAlertMessage] = useState<Message>({
        message: "",
        severity: Severity.Info,
    });

    const handleChange =
        (prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
            setFormData({ ...formData, [prop]: event.target.value });
        };

    const validateForm = async (): Promise<ValidationResult> => {
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
        return ValidationResult.Success;
    };

    const resetFormData = () => {
        formData.bggUsername = "";
        formData.bggId = "";
    };
    const handleBggUsernameUpdate = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();
        const validationResult = await validateForm();
        if (validationResult === ValidationResult.Success) {
            setUser({
                ...user,
                bggId: formData.bggId,
                bggUsername: formData.bggUsername,
            });
            try {
                await authorisationService.changeBggUsername(
                    token,
                    uuid,
                    formData.bggUsername
                );

                setAlertMessage({
                    message: "BGG username changed.",
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
                message: validationResult,
                severity: Severity.Warning,
            });
        }
        resetFormData();
    };

    return (
        <Box
            component="form"
            onSubmit={handleBggUsernameUpdate}
            id="bggUsernameUpdateForm"
        >
            {alertMessage.message != "" && (
                <Alert
                    aria-label="bggUsernameUpdateFormAlert"
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
            <p>Update BGG username</p>
            <FormControl
                sx={{ m: 1 }}
                variant="filled"
                color="primary"
                required={true}
            >
                <InputLabel shrink htmlFor="newBggUsername">
                    New BGG Username
                </InputLabel>
                <OutlinedInput
                    id="newBggUsername"
                    type="text"
                    value={formData.bggUsername}
                    onChange={handleChange("bggUsername")}
                />
            </FormControl>
            <Button
                sx={{ m: 1 }}
                variant="contained"
                type="submit"
                id="bggUsernameUpdateFormSubmit"
            >
                Update
            </Button>
        </Box>
    );
}
