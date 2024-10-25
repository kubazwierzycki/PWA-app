import {ReactNode, useState} from "react";
import {Box} from "@mui/system";
import {Button, Card, CardContent, Grid, IconButton, TextField, Typography} from "@mui/material";
import {Add, Delete} from "@mui/icons-material";

interface Player {
    age: number;
}

/**
 * Board game search page
 * @returns {ReactNode}
 */
const BoardGameSearch = (): ReactNode => {

    const [players, setPlayers] = useState<Player[]>([{ age: 0 }]);
    const [minPlayTime, setMinPlayTime] = useState<number>(0);
    const [maxPlayTime, setMaxPlayTime] = useState<number>(0);

    // Handle adding a new player
    const addPlayer = () => {
        setPlayers([...players, { age: 0 }]);
    };

    // Handle removing a player
    const removePlayer = (index: number) => {
        setPlayers(players.filter((_, i) => i !== index));
    };

    // Handle change in player's age, ensuring positive values only
    const handlePlayerAgeChange = (index: number, age: number) => {
        if (age >= 0) {
            const updatedPlayers = players.map((player, i) => (i === index ? { ...player, age } : player));
            setPlayers(updatedPlayers);
        }
    };

    // Handle submit button
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = {
            players,
            minPlayTime,
            maxPlayTime,
        };
        console.log(formData);
        // Further submit logic can go here
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600, margin: 'auto', padding: 2 }}>
            <Typography variant="h4" gutterBottom textAlign="center">GAME WIZARD</Typography>

            {/* Players List */}
            {players.map((player, index) => (
                <Card key={index} sx={{ mb: 2 }}>
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

            {/* Add New Player Button */}
            <Button
                onClick={addPlayer}
                startIcon={<Add />}
                variant="outlined"
                fullWidth
                sx={{ mb: 3 }}
            >
                Add Player
            </Button>

            {/* Min and Max Playtime Inputs with validation */}
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

            {/* Submit Button */}
            <Button type="submit" variant="contained" color="primary" fullWidth>
                Submit
            </Button>
        </Box>
    );
}

export default BoardGameSearch;
