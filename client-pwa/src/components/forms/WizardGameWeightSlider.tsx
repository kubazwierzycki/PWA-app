import Box from "@mui/material/Box";
import {Slider, Typography} from "@mui/material";
import {Dispatch, SetStateAction} from "react";


const WizardGameWeightSlider = ({value, setValue}: {value: number,setValue: Dispatch<SetStateAction<number>>}) => {

    const handleChange = (_event: Event, newValue: number | number[]) => {
        setValue(newValue as number);
    };

    return (
        <Box width={"100%"} padding={2}>
            <Typography gutterBottom>Game weight: {value}</Typography>
            <Slider
                value={value}
                min={1}
                max={5}
                step={0.5}
                onChange={handleChange}
                valueLabelDisplay="auto"
                marks
                aria-labelledby="rating-slider"
            />
        </Box>
    );
}

export default WizardGameWeightSlider;
