import React, {ReactNode, useState} from "react";
import {Box} from "@mui/system";
import {Button, Card, CardContent, Grid, IconButton, TextField, Typography} from "@mui/material";
import {Add, Delete} from "@mui/icons-material";
import getBestGames from "../../utils/wizard/WizardLogic.ts";
import {getCollectionData} from "../../utils/wizard/BGGWizardDataParser.ts";
import {useBoardgamesContext} from "../../contexts/BoardgamesContext.tsx";
import {IGameSuggestion, IWizardParams} from "../../utils/wizard/WizardInterfaces.ts";
import WizardSuggestions from "../../components/views/playroom/WizardSuggestions.tsx";

interface Player {
    age: number;
}

/**
 * Board game search page
 * @returns {ReactNode}
 */
const BoardGameSearch = (): ReactNode => {

    const [resultsReady, setResultsReady] = useState<boolean>(false);

    const [suggestions, setSuggestions] = useState([] as IGameSuggestion[]);

    const [players, setPlayers] = useState<Player[]>([{ age: 0 }]);
    const [minPlayTime, setMinPlayTime] = useState<number>(0);
    const [maxPlayTime, setMaxPlayTime] = useState<number>(0);

    const {games, ranking} = useBoardgamesContext();

    const addPlayer = () => {
        setPlayers([...players, { age: 0 }]);
    };

    const removePlayer = (index: number) => {
        setPlayers(players.filter((_, i) => i !== index));
    };

    const handlePlayerAgeChange = (index: number, age: number) => {
        if (age >= 0) {
            const updatedPlayers = players.map((player, i) => (i === index ? { ...player, age } : player));
            setPlayers(updatedPlayers);
        }
    };

    const parseParams = (): IWizardParams => {
        return {
            maxPlayingTime: maxPlayTime,
            minPlayingTime: minPlayTime,
            numPlayers: players.length,
            playersAge: players.map(player => player.age),
            ranking: ranking
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const input = await getCollectionData(games, ranking);
        const results = getBestGames(input, parseParams());
        setSuggestions(results.suggestions);
        setResultsReady(true);
    };

    return (
        resultsReady ?
            <div style={{
                overflowY: "auto",
                width: "100%",
                height: "100%",
                padding: "20px 40px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
            }}>
                <div style={{width: "100%", textAlign: "center", padding: "10px 0"}}>
                    <Typography fontWeight="bold">
                        HERE ARE YOUR TOP WIZARD SUGGESTIONS:
                    </Typography>
                </div>
                <WizardSuggestions
                    suggestions={suggestions}
                    choice={null}
                    setChoice={null}
                    setName={null}
                />
                <Button onClick={() => setResultsReady(false)} variant="contained" style={{width: "200px", marginTop: "20px"}}>
                    <Typography>
                        Try again
                    </Typography>
                </Button>
            </div>
            :
            <Box component="form" onSubmit={handleSubmit} sx={{maxWidth: 600, margin: 'auto', padding: 2}}>
                <Typography variant="h4" gutterBottom textAlign="center">GAME WIZARD</Typography>

                {players.map((player, index) => (
                    <Card key={index} sx={{mb: 2}}>
                        <CardContent>
                            <Grid container spacing={2} alignItems="center">
                                <Grid item xs={10}>
                                    <TextField
                                        label={`Player ${index + 1} Age`}
                                        type="number"
                                        inputProps={{ min: 0 }}
                                        value={player.age}
                                        onChange={(e) => handlePlayerAgeChange(index, Math.max(0, Number(e.target.value)))}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <IconButton onClick={() => removePlayer(index)} color="error">
                                        <Delete />
                                    </IconButton>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                ))}

                <Button
                    onClick={addPlayer}
                    startIcon={<Add />}
                    variant="outlined"
                    fullWidth
                    sx={{ mb: 3 }}
                >
                    Add Player
                </Button>

                <TextField
                    label="Minimum Play Time (minutes)"
                    type="number"
                    inputProps={{ min: 0 }}
                    value={minPlayTime}
                    onChange={(e) => setMinPlayTime(Math.max(0, Number(e.target.value)))}
                    fullWidth
                    sx={{ mb: 2 }}
                />
                <TextField
                    label="Maximum Play Time (minutes)"
                    type="number"
                    inputProps={{ min: 0 }}
                    value={maxPlayTime}
                    onChange={(e) => setMaxPlayTime(Math.max(0, Number(e.target.value)))}
                    fullWidth
                    sx={{ mb: 3 }}
                />

                <Button type="submit" variant="contained" color="primary" fullWidth>
                    Submit
                </Button>
            </Box>
    );
}

export default BoardGameSearch;
