import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, TextField } from "@mui/material";
import { ChangeEvent, Dispatch, ReactNode, useState } from "react";

interface AgeSettingViewProps {
    isAgeDialogOpen: boolean
    setIsAgeDialogOpen: Dispatch<React.SetStateAction<boolean>>
    setAge: Dispatch<React.SetStateAction<number | null>>
}

/**
 * View component for setting age
 * @param {boolean} isAgeDialogOpen - visibility of age setting dialog
 * @param {Dispatch<SetStateAction<boolean>>} setIsAgeDialogOpen - set visibility of age setting dialog
 * @param {Dispatch<SetStateAction<number>>} setAge - set player age
 * @returns {ReactNode}
 */

const AgeSettingsView = ({isAgeDialogOpen, setIsAgeDialogOpen, setAge}: AgeSettingViewProps): ReactNode => {

    const [formData, setFormData] = useState({
        age: "18",
    });

    const [formErrors, setFormErrors] = useState({
        age: false,
    });

    const validateInputs = (name : string, value: string) => {
        const ageRegex = /^([1-9]{1,1}[0-9]{0,2})$/;

        switch (name) {
            case "age":
                setFormErrors({...formErrors, age: !ageRegex.test(value)});
                break;
            }
    }

    const isValidForm = () : boolean =>{
        return !formErrors.age
    }

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;

        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));

        validateInputs(name, value);
    }

    const handleClose = () => {
        setIsAgeDialogOpen(false);
    }

    const handleNext = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if(isValidForm()){
            setAge(Number.parseInt(formData.age));
            handleClose();
        }
    }

    return (
        <>
            <Dialog
                open={isAgeDialogOpen}
                onClose={handleClose}
                aria-labelledby="age-settings"
                aria-describedby="set-age"
            >
                <DialogTitle id="age-settings">
                    {"Age settings"}
                </DialogTitle>
                <DialogContent>
                    <Box component="form" onSubmit={handleNext}>
                        <Box display={"flex"}>
                            <FormControl
                                sx={{ m: 1 }}
                                variant="filled"
                                color="primary"
                                required={true}
                            >
                                <InputLabel error={formErrors.age} shrink htmlFor="ageSetup">
                                    Your age
                                </InputLabel>
                                <TextField
                                    id="ageSetup"
                                    type={"number"}
                                    name="age"
                                    value={formData.age}
                                    onChange={handleInputChange}
                                    error={formErrors.age}
                                />
                            </FormControl>
                        </Box>
                        <DialogActions>
                            <Button onClick={handleClose}>Back</Button>
                            <Button type="submit" autoFocus>
                                Go next
                            </Button>
                        </DialogActions>
                    </Box>
                </DialogContent>
            </Dialog>
        </>
    );
}

export default AgeSettingsView;
