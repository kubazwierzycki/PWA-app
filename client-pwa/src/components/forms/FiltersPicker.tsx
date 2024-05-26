import {ReactNode} from "react";
import {Button, Checkbox, FormControlLabel, FormGroup, Popover, Slider} from "@mui/material";
import styles from "../../styles/collections.module.css"


const FiltersPicker = ({anchorEl}: {anchorEl: HTMLButtonElement | null}): ReactNode => {

    const marks = [
        {
            value: 0,
            label: '0',
        },
        {
            value: 10,
            label: '10',
        }
    ];

    return (
        <Popover open={true} anchorEl={anchorEl}>
            <div className={styles.filters}>
                <FormGroup>
                    <FormControlLabel control={<Checkbox />} label={
                        <div style={{width:"180px", textAlign:"center"}}>
                            Rated only
                        </div>
                    }/>
                    <FormControlLabel control={<Checkbox />} label={
                        <div style={{width:"180px", textAlign:"center"}}>
                            Commented only
                        </div>
                    }/>
                    <FormControlLabel control={<Checkbox />} label={
                        <FormControlLabel
                            label="Min BGG rating"
                            labelPlacement="top"
                            control={
                                <Slider
                                    defaultValue={5}
                                    min={0}
                                    max={10}
                                    step={0.1}
                                    marks={marks}
                                    valueLabelDisplay="auto"
                                    sx={{ width: 150 }}
                                />
                            }
                        />

                    } />
                </FormGroup>
                <Button sx={{marginTop:"10px"}}>Apply</Button>
            </div>
        </Popover>
    )
}

export default FiltersPicker;
