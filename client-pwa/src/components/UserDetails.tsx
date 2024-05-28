import { Box } from "@mui/material";
import { ReactNode } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function UserDetails(): ReactNode {
    const { user } = useAuth();
    return (
        <Box>
            <p>Username: {user.username}</p>
            <p>BGG username: {user.bggUsername}</p>
            <p>E-mail: {user.email}</p>
        </Box>
    );
}
