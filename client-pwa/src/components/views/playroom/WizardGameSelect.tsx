import {Button, Stack, TextField, Typography} from "@mui/material";
import {useState} from "react";
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

    const {games, ranking} = useBoardgamesContext();

    const parseParams = (): IWizardParams => {
        return {
            maxPlayingTime: 500,
            minPlayingTime: 0,
            numPlayers: 3,
            playersAge: [18, 19, 24],
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
            console.log(bestGames);
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
                <Button onClick={handleWizard}>
                    Get suggestions
                </Button>
            </div>
            :
            <WizardSuggestions suggestions={suggestions} />
    )
}

export default WizardGameSelect;
