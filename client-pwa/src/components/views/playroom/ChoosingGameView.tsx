import {ReactNode, useState} from "react";
import styles from "../../../styles/createPlayroom.module.css";
import StyledToggleButtonGroup from "../../controls/StyledToggleButtonGroup.tsx";
import ToggleButton from "@mui/material/ToggleButton";
import Paper from "@mui/material/Paper";
import * as React from "react";
import WizardGameSelect from "./WizardGameSelect.tsx";
import SearchGameSelect from "./SearchGameSelect.tsx";
import {TextField} from "@mui/material";

enum SELECTION_MODES {
    WIZARD,
    SEARCH
}

/**
 * View component enabling choosing the right game to play in the playroom
 * @returns {ReactNode}
 */
const ChoosingGameView = (): ReactNode => {

    // current chosen game name
    const [name, setName] = useState<string>("");

    // chosen method of selecting game to play
    const [selectionMode, setSelectionMode] =
        useState<SELECTION_MODES>(SELECTION_MODES.WIZARD);

    const handleSelectionChange = (
        _event: React.MouseEvent<HTMLElement>,
        newSelection: SELECTION_MODES
    ) => {
        setSelectionMode(newSelection);
    };

    return (
        <div className={styles.container}>
            <div className={styles.chooseGameTopBar}>
                <Paper
                    elevation={0}
                    sx={{
                        display: 'flex',
                        border: (theme) => `1px solid ${theme.palette.divider}`,
                        flexWrap: 'wrap',
                        alignItems: 'center'
                    }}
                >
                    <StyledToggleButtonGroup
                        size="small"
                        value={selectionMode}
                        exclusive
                        onChange={handleSelectionChange}
                        aria-label="possesion-state"
                    >
                        <ToggleButton value={SELECTION_MODES.WIZARD} aria-label="wizard">
                            WIZARD
                        </ToggleButton>
                        <ToggleButton value={SELECTION_MODES.SEARCH} aria-label="search">
                            SEARCH
                        </ToggleButton>
                    </StyledToggleButtonGroup>
                </Paper>
                <div className={styles.gameChoiceNameField}>
                    <TextField
                        id="chosen-game-name"
                        label={name}
                        variant="filled"
                        disabled={true}
                        style={name !== "" ? {border: "2px solid green", borderRadius: "5px"} : {}}
                    />
                </div>
            </div>
            <div className={styles.gameSelectWindow}>
                <Paper style={{height: "100%"}}>
                    {
                        selectionMode === SELECTION_MODES.WIZARD ?
                            <WizardGameSelect />
                            :
                            <SearchGameSelect setName={setName} />
                    }
                </Paper>
            </div>
        </div>
    )
}

export default ChoosingGameView;
