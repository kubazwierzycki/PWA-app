import {Dispatch, ReactNode, SetStateAction, useState} from "react";
import styles from "../../../styles/createPlayroom.module.css";
import StyledToggleButtonGroup from "../../controls/StyledToggleButtonGroup.tsx";
import ToggleButton from "@mui/material/ToggleButton";
import Paper from "@mui/material/Paper";
import * as React from "react";
import WizardGameSelect from "./WizardGameSelect.tsx";
import SearchGameSelect from "./SearchGameSelect.tsx";
import {TextField} from "@mui/material";
import CustomGameSelect from "./CustomGameSelect.tsx";
import BggSearchGameSelect from "./BggSearchGameSelect.tsx";

enum SELECTION_MODES {
    WIZARD,
    SEARCH,
    BGG,
    CUSTOM
}

interface ChoosingViewProps {
    name: string
    setName: Dispatch<SetStateAction<string>>
    choice: string
    setChoice: Dispatch<SetStateAction<string>>
}

/**
 * View component enabling choosing the right game to play in the playroom
 * @param {string} name - state with chosen game name
 * @param {Dispatch<SetStateAction<string>>} setName - chosen game change callback
 * @param {string} choice - chosen game id
 * @param {Dispatch<SetStateAction<string>>} setChoice - chosen game id change callback
 * @returns {ReactNode}
 */
const ChoosingGameView = ({name, setName, choice, setChoice}: ChoosingViewProps): ReactNode => {

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
                        <ToggleButton value={SELECTION_MODES.BGG} aria-label="bgg_search">
                            BGG SEARCH
                        </ToggleButton>
                        <ToggleButton value={SELECTION_MODES.CUSTOM} aria-label="custom">
                            CUSTOM
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
                {(() => {
                    switch (selectionMode) {
                    case SELECTION_MODES.WIZARD:
                        return <WizardGameSelect setName={setName} choice={choice} setChoice={setChoice}/>
                    case SELECTION_MODES.SEARCH:
                        return  <SearchGameSelect setName={setName} choice={choice} setChoice={setChoice}/>
                    case SELECTION_MODES.BGG:
                        return  <BggSearchGameSelect setName={setName} choice={choice} setChoice={setChoice}/>
                    case SELECTION_MODES.CUSTOM:
                        return <CustomGameSelect setName={setName} name={name} setChoice={setChoice}/>
                    default:
                        return null
                    }
                })()}
                </Paper>
            </div>
        </div>
    )
}

export default ChoosingGameView;
