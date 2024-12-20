
import { Stack, TextField, Typography } from "@mui/material";
import { Dispatch, ReactNode, SetStateAction } from "react";
import { usePlayroomContext } from "../../../contexts/PlayroomContext";

interface SearchSelectProps {
    setName: Dispatch<SetStateAction<string>>
    name: string
    setChoice: Dispatch<SetStateAction<string>>
}

/**
 * View presenting cutom input
 * (Alternative to search bar choice)
 * @param {Dispatch<SetStateAction<string>>} setName - callback for game choice info
 * @param {name} name - name of game
 * @param {Dispatch<SetStateAction<string>>} setChoice - id of chosen game change callback
 * @returns {ReactNode}
 */
const CustomGameSelect = ({setName, name, setChoice}: SearchSelectProps): ReactNode => {

    const {setThumbnailSrc} = usePlayroomContext();

    const handleSetName = (event: React.ChangeEvent<HTMLInputElement>) => {
        setThumbnailSrc("");
        setName(event.currentTarget.value);
        setChoice("0");
    }

    return (
        <div style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            padding: "20px 40px"
        }}>
            <div style={{flex: 1}}>
                <Stack direction="row" alignItems={"center"} spacing={2}>
                    <Typography>
                        The title of a game outside your collection:
                    </Typography>
                    <TextField
                        value={name}
                        onChange={handleSetName}
                    />
                </Stack>
            </div>
        </div>
    )
}

export default CustomGameSelect;
