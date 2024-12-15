import {Button, Stack, TextField, Typography} from "@mui/material";
import {ChangeEvent, Dispatch, ReactNode, SetStateAction, useState} from "react";
import {getCollectionData} from "../../../utils/wizard/BGGWizardDataParser.ts";
import {useBoardgamesContext} from "../../../contexts/BoardgamesContext.tsx";
import getBestGames from "../../../utils/wizard/WizardLogic.ts";
import {IGameSuggestion, IWizardParams} from "../../../utils/wizard/WizardInterfaces.ts";
import WizardSuggestions from "./WizardSuggestions.tsx";
import ProgressBar from "../../ProgressBar.tsx";
import WizardGameWeightSlider from "../../forms/WizardGameWeightSlider.tsx";


interface SearchSelectProps {
    setName: Dispatch<SetStateAction<string>>
    choice: string
    setChoice: Dispatch<SetStateAction<string>>
    numPlayers :number
    playersAge : number[]
}

/**
 * View presenting wizard functionality as means of choosing game to play in a playroom
 * (Alternative to search bar choice)
 * @param {Dispatch<SetStateAction<string>>} setName - callback for game choice info
 * @param {string} choice - id of chosen game
 * @param {Dispatch<SetStateAction<string>>} setChoice - id of chosen game change callback
 * @param {number} numPlayers - number of players
 * @param {number[]} playersAge - players age
 * @returns {ReactNode}
 */
const WizardGameSelect = ({setName, choice, setChoice, numPlayers, playersAge}: SearchSelectProps): ReactNode => {

    const [suggestionsReady, setSuggestionsReady] = useState(false);

    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState<number>(0);

    const [suggestions, setSuggestions] = useState([] as IGameSuggestion[]);

    const [minPlayTime, setMinPlayTime] = useState("0");
    const [maxPlayTime, setMaxPlayTime] = useState("60");

    const [gameWeight, setGameWeight] = useState<number>(2.5);

    const [error, setError] = useState({ minPlayTime: false, maxPlayTime: false });

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
            gameWeight: gameWeight,
            ranking: ranking
        }
    }

    const handleWizard = async () => {
        setLoading(true);
        const data = await getCollectionData(games, ranking, setProgress);
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
                        <TextField value={numPlayers} disabled size="small"/>
                    </Stack>
                </div>
                <div style={{flex: 1}}>
                    <Stack direction="row" alignItems={"center"} spacing={2}>
                        <Typography>
                            Players age:
                        </Typography>
                        <TextField value={playersAge} disabled size="small"/>
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
                            size="small"
                        />
                        <Typography>
                            Max play time:
                        </Typography>
                        <TextField
                            value={maxPlayTime}
                            onChange={handleMaxPlayTimeChange}
                            error={error.maxPlayTime}
                            helperText={error.maxPlayTime ? "Please enter a valid integer" : ""}
                            size="small"
                        />
                    </Stack>
                </div>
                <div style={{flex: 1}}>
                    <WizardGameWeightSlider value={gameWeight} setValue={setGameWeight} />
                </div>
                {
                    loading ?
                        <div>
                            <ProgressBar progress={progress}/>
                        </div>
                        :
                        <Button onClick={handleWizard}>
                            Get suggestions
                        </Button>
                }
            </div>
            :
            <div style={{
                overflowY: "auto",
                width: "100%",
                height: "100%",
                padding: "20px 40px"
            }}>
                <div style={{width: "100%", textAlign: "center", padding: "10px 0"}}>
                    <Typography fontWeight="bold">
                    HERE ARE YOUR TOP WIZARD SUGGESTIONS:
                    </Typography>
                </div>
                <WizardSuggestions
                    suggestions={suggestions}
                    choice={choice}
                    setChoice={setChoice}
                    setName={setName}
                />
            </div>
    )
}

export default WizardGameSelect;
