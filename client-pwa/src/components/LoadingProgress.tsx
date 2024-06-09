import {CircularProgress} from "@mui/material";
import {ReactNode} from "react";


/**
 * Circular loading component used when data isn't ready yet
 * @returns {ReactNode}
 */
const LoadingProgress = (): ReactNode => {

    return (
        <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "80vh"
        }}>
            <CircularProgress color="inherit" size="5rem"/>
        </div>
    )
}

export default LoadingProgress;
