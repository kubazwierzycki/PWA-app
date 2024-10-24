
import { ReactNode } from "react";
import { useAuth } from "../contexts/AuthContext";
import GameplayListView from "../components/views/gameplays/GameplayListView";
import { Box, Typography } from "@mui/material";

/**
 * Gameplays homepage
 * @returns {ReactNode}
 */
const Gameplays = (): ReactNode => {

    const { uuid } = useAuth();

    return (
        <>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", flexDirection:"column"}}>
                <Typography variant="h5">
                    Gameplays
                </Typography>
                <Typography variant="subtitle1">
                    See the games you participated in below
                </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", m: 3 }}>
                <GameplayListView userId={uuid} />
            </Box>
        </>

    )
}

export default Gameplays;
