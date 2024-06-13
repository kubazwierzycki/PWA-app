import {
    Alert,
    Box,
    Button,
    FormControl,
    InputLabel,
    OutlinedInput,
} from "@mui/material";
import { ReactNode, useState } from "react";
import { Message, Severity } from "./formHelpers.ts";
import authorisationService from "../../services/authorization.ts";
import { useAuth } from "../../contexts/AuthContext.tsx";
import axios from "axios";
import React from "react";

interface State {
    email: string;
}

/**
 *
 * @returns {ReactNode}
 */

/**TODO
 * change IDs
 */

export default function EmailUpdateForm(): ReactNode {
    const [formData, setFormData] = useState<State>({
        email: "",
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

    const handleEmailUpdate = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();
        setUser({
            ...user,
            email: formData.email,
        });
        try {
            await authorisationService.changeEmail(token, uuid, formData.email);

            setAlertMessage({
                message: "Email changed.",
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
    };

    return (
        <Box component="form" onSubmit={handleEmailUpdate} id="emailUpdateForm">
            {alertMessage.message != "" && (
                <Alert
                    aria-label="emailUpdateFormAlert"
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
            <p>Update email</p>
            <FormControl
                sx={{ m: 1 }}
                variant="filled"
                color="primary"
                required={true}
            >
                <InputLabel shrink htmlFor="newEmail">
                    New Email
                </InputLabel>
                <OutlinedInput
                    id="newEmail"
                    type="email"
                    value={formData.email}
                    onChange={handleChange("email")}
                />
            </FormControl>
            <Button
                sx={{ m: 1 }}
                variant="contained"
                type="submit"
                id="emailUpdateFormSubmit"
            >
                Update
            </Button>
        </Box>
    );
}
