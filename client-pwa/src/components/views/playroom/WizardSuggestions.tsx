import {IGameSuggestion} from "../../../utils/wizard/WizardInterfaces.ts";
import {Typography} from "@mui/material";


const WizardSuggestions = ({suggestions}: {suggestions: IGameSuggestion[]}) => {


    return (
        <div style={{width: "100%", display: "flex", flexDirection: "column"}}>
            {
                suggestions.map((item, index) => (
                    <div style={{width: "100%", display: "flex", flexDirection: "row", alignItems: "center"}} key={index}>
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
