import EditIcon from "@mui/icons-material/Edit";
import Box from "@mui/material/Box";
import { ReactNode } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function UserDetails({
    setChoice,
}: {
    setChoice: React.Dispatch<React.SetStateAction<string>>;
}): ReactNode {
    const { user } = useAuth();

    const handleChange = (value: string) => {
        setChoice(value);
    };

    return (
        <Box>
            <p>
                Username: {user.username}
                <br />
                {`BGG username: ${user.bggUsername} `}
                <EditIcon onClick={() => handleChange("bggUsername")} />
                <br />
                BGG id: {user.bggId}
                <br />
                {`E-mail: ${user.email} `}
                <EditIcon onClick={() => handleChange("email")} />
                <br />
                {`Password `}
                <EditIcon onClick={() => handleChange("password")} />
            </p>
        </Box>
    );
}
