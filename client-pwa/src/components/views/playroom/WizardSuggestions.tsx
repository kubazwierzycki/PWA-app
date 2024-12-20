import {IGameSuggestion} from "../../../utils/wizard/WizardInterfaces.ts";
import {Typography} from "@mui/material";
import {CSSProperties, Dispatch, ReactNode, SetStateAction} from "react";

interface WizardSuggestionsProps {
    suggestions: IGameSuggestion[]
    choice: string | null
    setChoice: Dispatch<SetStateAction<string>> | null
    setName: Dispatch<SetStateAction<string>> | null
}

/**
 * View component displaying wizard result suggestions
 * @param {IGameSuggestion[]} suggestions - wizard algorithm output
 * @param {string} choice - variable storing playroom game choice
 * @param {Dispatch<SetStateAction<string>>} setChoice - callback changing variable storing playroom game choice
 * @param {Dispatch<SetStateAction<string>>} setName - callback setting playroom chosen game name
 * @returns {ReactNode}
 */
const WizardSuggestions = ({suggestions, choice, setChoice, setName}: WizardSuggestionsProps): ReactNode => {

    const handleClick = (gameId: string, gameName: string) => {
        if (setChoice) {
            setChoice(gameId);
        }
        if (setName) {
            setName(gameName);
        }
    }

    const containerStyle: CSSProperties = {
        width: "100%",
        display: "flex",
        flexDirection: "row",
        alignItems: "center"
    }

    return (
        <div style={{width: "100%", display: "flex", flexDirection: "column"}}>
            {
                suggestions.map((item, index) => (
                    <div
                        style={{...containerStyle, ...(choice === item.id && {border: "1px solid green"})}}
                        key={index}
                        onClick={() => handleClick(item.id, item.name)}
                    >
                        <div>
                            {
                                `${index + 1}.`
                            }
                            &nbsp;
                            &nbsp;
                        </div>
                        <div style={{width: "10%"}}>
                            <img src={item.thumbnail} alt={item.name} width="100%"/>
                        </div>
                        <div style={{flex: 1, display: "flex", flexDirection: "column"}}>
                            <div style={{flex: 1, textAlign: "center"}}>
                                <Typography variant="h6" fontStyle="bold">
                                    {
                                        item.name
                                    }
                                </Typography>
                            </div>
                            <div style={{flex: 1, textAlign: "center"}}>
                                <Typography variant="body2" fontStyle="italic">
                                    {
                                        item.categories.join(", ")
                                    }
                                </Typography>
                            </div>
                        </div>
                        <div>
                            {
                                item.score.toFixed(2)
                            }
                        </div>
                    </div>
                ))
            }
        </div>
    )
}

export default WizardSuggestions;
