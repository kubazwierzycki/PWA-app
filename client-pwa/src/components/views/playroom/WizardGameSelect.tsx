import {Button, Stack, TextField, Typography} from "@mui/material";
import {useState} from "react";
import {getCollectionData} from "../../../utils/wizard/BGGWizardDataParser.ts";
import {useBoardgamesContext} from "../../../contexts/BoardgamesContext.tsx";


const WizardGameSelect = () => {

    const [minPlayTime, setMinPlayTime] = useState("0");
    const [maxPlayTime, setMaxPlayTime] = useState("60");

    const {games} = useBoardgamesContext();

    return (
        <div style={{width: "100%", height: "100%", display: "flex", flexDirection: "column", padding: "20px 40px"}}>
            <div style={{flex: 1}}>
                <Stack direction="row" alignItems={"center"} spacing={2}>
                    <Typography>
                        Number of players:
                    </Typography>
                    <TextField value={"4"} disabled/>
                </Stack>
            </div>
            <div style={{flex: 1}}>
                <Stack direction="row" alignItems={"center"} spacing={2}>
                    <Typography>
                        Players age:
                    </Typography>
                    <TextField value={"19, 22, 23, 14"} disabled/>
                </Stack>
            </div>
            <div style={{flex: 1}}>
                <Stack direction="row" alignItems={"center"} spacing={2}>
                    <Typography>
                        Min play time:
                    </Typography>
                    <TextField
                        value={minPlayTime}
                        onChange={event => setMinPlayTime(event.target.value)}
                    />
                    <Typography>
                        Max play time:
                    </Typography>
                    <TextField
                        value={maxPlayTime}
                        onChange={event => setMaxPlayTime(event.target.value)}
                    />
                </Stack>
            </div>
            <Button onClick={() => getCollectionData(games)}>
                Prepare data
            </Button>
        </div>
    )
}

export default WizardGameSelect;
