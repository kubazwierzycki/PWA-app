import {Button, Stack, TextField, Typography} from "@mui/material";
import {ChangeEvent, useState} from "react";
import {getCollectionData} from "../../../utils/wizard/BGGWizardDataParser.ts";
import {useBoardgamesContext} from "../../../contexts/BoardgamesContext.tsx";
import getBestGames from "../../../utils/wizard/WizardLogic.ts";
import {IGameSuggestion, IWizardParams} from "../../../utils/wizard/WizardInterfaces.ts";
import WizardSuggestions from "./WizardSuggestions.tsx";


const WizardGameSelect = () => {

    const [suggestionsReady, setSuggestionsReady] = useState(false);
    const [suggestions, setSuggestions] = useState([] as IGameSuggestion[]);

    const [minPlayTime, setMinPlayTime] = useState("0");
    const [maxPlayTime, setMaxPlayTime] = useState("60");

    const [error, setError] = useState({ minPlayTime: false, maxPlayTime: false });

    // TODO: update with playroom number of players logic
    // @ts-ignore
    const [numPlayers, setNumPlayers] = useState(4);

    // TODO: update with playroom players age list logic (needs to be added to form)
    // @ts-ignore
    const [playersAge, setPlayersAge] = useState([19, 22, 23, 16]);

    const {games, ranking} = useBoardgamesContext();

    const handleMinPlayTimeChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        const intValue = parseInt(event.target.value);
        setMinPlayTime(value);
        if (!Number.isInteger(Number(value))) {
            setError(prev => ({ ...prev, minPlayTime: true }));
            return;
        }
        if (!isNaN(intValue) && intValue >= 0) {
            setError(prev => ({ ...prev, minPlayTime: false }));
        }
        else {
            setError(prev => ({ ...prev, minPlayTime: true }));
        }
    };

    const handleMaxPlayTimeChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        const intValue = parseInt(event.target.value);
        setMaxPlayTime(value);
        if (!Number.isInteger(Number(value))) {
            setError(prev => ({ ...prev, maxPlayTime: true }));
            return;
        }
        if (!isNaN(intValue) && intValue >= 0) {
            setError(prev => ({ ...prev, maxPlayTime: false }));
        }
        else {
            setError(prev => ({ ...prev, maxPlayTime: true }));
        }
    };

    const parseParams = (): IWizardParams => {
        return {
            maxPlayingTime: parseInt(maxPlayTime),
            minPlayingTime: parseInt(minPlayTime),
            numPlayers: numPlayers,
            playersAge: playersAge,
            ranking: ranking
        }
    }

    const handleWizard = async () => {
        const data = await getCollectionData(games, ranking);
        if (data === null) {
            return;
        }
        else {
            const bestGames = getBestGames(data, parseParams());
            setSuggestions(bestGames.suggestions);
            setSuggestionsReady(true);
        }
    }

    return (
        !suggestionsReady ?
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
                            Number of players:
                        </Typography>
                        <TextField value={numPlayers} disabled/>
                    </Stack>
                </div>
                <div style={{flex: 1}}>
                    <Stack direction="row" alignItems={"center"} spacing={2}>
                        <Typography>
                            Players age:
                        </Typography>
                        <TextField value={playersAge} disabled/>
                    </Stack>
                </div>
                <div style={{flex: 1}}>
                    <Stack direction="row" alignItems={"center"} spacing={2}>
                        <Typography>
                            Min play time:
                        </Typography>
                        <TextField
                            value={minPlayTime}
                            onChange={handleMinPlayTimeChange}
                            error={error.minPlayTime}
                            helperText={error.minPlayTime ? "Please enter a valid integer" : ""}
                        />
                        <Typography>
                            Max play time:
                        </Typography>
                        <TextField
                            value={maxPlayTime}
                            onChange={handleMaxPlayTimeChange}
                            error={error.maxPlayTime}
                            helperText={error.maxPlayTime ? "Please enter a valid integer" : ""}
                        />
                    </Stack>
                </div>
                <Button onClick={handleWizard}>
                    Get suggestions
                </Button>
            </div>
            :
            <WizardSuggestions suggestions={suggestions} />
    )
}

export default WizardGameSelect;
