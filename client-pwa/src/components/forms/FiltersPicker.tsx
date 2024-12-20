import {ChangeEvent, ReactNode, useState} from "react";
import {Button, Checkbox, FormControlLabel, FormGroup, Popover, Slider} from "@mui/material";
import styles from "../../styles/collections.module.css"
import {useCollectionViewContext} from "../../contexts/CollectionViewContext.tsx";

interface FiltersState {
    rated: boolean;
    commented: boolean;
    minRating: boolean;
}

/**
 * Popover component enabling BGG collection filters control
 * Uses {@link CollectionViewContext} that controls state
 * @param {HTMLElement | null} anchorEl - anchor element for popover positioning
 * @return ReactNode
 */
const FiltersPicker = ({anchorEl}: {anchorEl: HTMLElement | null}): ReactNode => {

    const {
        filtersOpen,
        setFiltersOpen,
        filtersState,
        setFiltersState,
        setMinRating,
        setLoading
    } = useCollectionViewContext();

    // popover filters state
    const [currentFiltersState, setCurrentFiltersState] = useState<FiltersState>({
        rated: filtersState.rated,
        commented: filtersState.commented,
        minRating: filtersState.minRating,
    });
    const [sliderValue, setSliderValue] = useState(5);

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

    const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = event.target;
        setCurrentFiltersState(prevState => ({
            ...prevState,
            [name]: checked,
        } as FiltersState));
    };

    const handleApply = () => {
        setFiltersState({
            rated: currentFiltersState.rated,
            commented: currentFiltersState.commented,
            minRating: currentFiltersState.minRating,
        });
        setFiltersOpen(false);
        setMinRating(sliderValue);
        setLoading(true);
    }

    const handleSliderChange = (_event: Event, newValue: number | number[]) => {
        if (typeof newValue === 'number') {
            setSliderValue(newValue);
        }
    };

    const handlePopoverClose = () => {
        setFiltersOpen(false);
        setCurrentFiltersState({
            rated: filtersState.rated,
            commented: filtersState.commented,
            minRating: filtersState.minRating
        });
    }

    return (
        <Popover
            open={filtersOpen}
            anchorEl={anchorEl}
            onClose={handlePopoverClose}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'center'
            }}
        >
            <div className={styles.filters} onClick={e => e.stopPropagation()}>
                <FormGroup>
                    <FormControlLabel
                        control={
                            <Checkbox  checked={currentFiltersState.rated} onChange={handleCheckboxChange}/>
                        }
                        label={
                            <div style={{width:"180px", textAlign:"center"}}>
                                Rated only
                            </div>
                        }
                        name="rated"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox checked={currentFiltersState.commented} onChange={handleCheckboxChange}/>
                        }
                        label={
                            <div style={{width:"180px", textAlign:"center"}}>
                                Commented only
                            </div>
                        }
                        name="commented"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox  checked={currentFiltersState.minRating} onChange={handleCheckboxChange}/>
                        }
                        label={
                            <FormControlLabel
                                label="Min BGG rating"
                                labelPlacement="top"
                                control={
                                    <Slider
                                        defaultValue={5}
                                        min={0}
                                        max={10}
                                        step={1}
                                        marks={marks}
                                        valueLabelDisplay="auto"
                                        value={sliderValue}
                                        onChange={handleSliderChange}
                                        sx={{ width: 150 }}
                                    />
                                }
                            />
                        }
                        name="minRating"
                    />
                </FormGroup>
                <Button sx={{marginTop:"10px"}} onClick={handleApply}>
                    Apply
                </Button>
            </div>
        </Popover>
    )
}

export default FiltersPicker;
