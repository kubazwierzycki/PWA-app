import {IGameSuggestion} from "../../../utils/wizard/WizardInterfaces.ts";


const WizardSuggestions = ({suggestions}: {suggestions: IGameSuggestion[]}) => {


    return (
        <div style={{width: "100%", display: "flex", flexDirection: "column"}}>
            {
                suggestions.map(item => (
                    <div style={{width: "100%", display: "flex", flexDirection: "row"}}>
                        <div style={{width: "10%"}}>
                            <img src={item.thumbnail} alt={item.name} width="100%"/>
                        </div>
                        <div style={{flex: 1, display: "flex", flexDirection: "column"}}>
                            <div style={{flex: 1}}>
                                {
                                    item.name
                                }
                            </div>
                            <div style={{flex: 1}}>
                                {
                                    item.categories.join(", ")
                                }
                            </div>
                        </div>
                        <div>
                            {
                                item.score
                            }
                        </div>
                    </div>
                ))
            }
        </div>
    )
}

export default WizardSuggestions;
