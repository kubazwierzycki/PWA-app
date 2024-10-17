import {ChangeEvent, ReactNode, useEffect, useState} from "react";
import styles from "../../styles/createPlayroom.module.css";
import {Button, Card, Checkbox, FormControlLabel, FormGroup, Input, Typography} from "@mui/material";
import {Link, useNavigate} from "react-router-dom";
import { ReadyState }  from "react-use-websocket";
import { buildJoinWaitingRoomMessage, WaitingPlayer, SimpleMessage, WaitingRoomMessage, PlayroomMessage } from "../../services/playroom";
import { useAuth } from "../../contexts/AuthContext";
import AwaitingPlayersView from "../../components/views/playroom/AwaitingPlayersView";
import { useWebSocketContext } from "../../contexts/WebSocketContext";
import { usePlayroomContext } from "../../contexts/PlayroomContext";
import api_address from "../../config/api_address";

/**
 * Live board game playing room joining page
 * @returns {ReactNode}
 */
const PlayroomJoin = (): ReactNode => {

    const navigate = useNavigate();

    const {uuid, user } = useAuth();
    
    const {code, setCode, setUsername, setTimer} = usePlayroomContext();

    const {sendJsonMessage, lastJsonMessage, readyState, setSocketUrl } = useWebSocketContext();

    // entered nick value for playroom
    const [nick, setNick] = useState<string>("");

    // should username be used as nick
    const [useUsername, setUseUsername] = useState<boolean>(true);

    // waiting room joining status
    const [joinSuccessfully, setJoinSuccessfully] = useState<boolean>(false);

    // waiting room player list
    const [waitingRoomPlayers, setWaitingRoomPlayers] = useState<WaitingPlayer[]>([]);

    // web socket messages processing
    useEffect(() => {
        console.log(lastJsonMessage);
        
        if (lastJsonMessage) {
            const messageType : string = (lastJsonMessage as SimpleMessage).type;
            switch(messageType){
                case "welcomeInfo": {
                    setJoinSuccessfully(true);
                    break;
                }
                case "waitingRoom": {
                    const waitingRoomMessage : WaitingRoomMessage = (lastJsonMessage as WaitingRoomMessage);
                    setWaitingRoomPlayers(waitingRoomMessage.players);
                    break;
                }
                case "playroom": {
                    const playroomMessage : PlayroomMessage = (lastJsonMessage as PlayroomMessage);
                    setTimer(playroomMessage.timer);
                    navigate("/playroom");
                    break;
                }
                default: {
                    console.log("Unknown message type");
                    break;
                }
            }
        } else{            
            setSocketUrl(api_address.backend_ws);
        }
    }, [lastJsonMessage, navigate]);

    const handleCodeInputChange = (
        inputVal: ChangeEvent<HTMLInputElement>
    ) => setCode(inputVal.target.value);

    const handleNickInputChange = (
        inputVal: ChangeEvent<HTMLInputElement>
    ) => setNick(inputVal.target.value);

    const handleCheckboxChange = (
        event: ChangeEvent<HTMLInputElement>
    ) => setUseUsername(event.target.checked);

    const handleJoinPlayroom = () =>{
        //webSocket
            if (readyState === ReadyState.OPEN) {
                if(!joinSuccessfully){
                    if(useUsername && uuid !== ""){
                        setUsername(user.username);
                        sendJsonMessage(buildJoinWaitingRoomMessage(code, user.username, uuid));
                    } else{
                        setUsername(nick);
                        sendJsonMessage(buildJoinWaitingRoomMessage(code, nick));
                    }
                }
            }
    } 

    const isJoinPlayroomButtonDisabled = () => {
        return !((code !== "" && useUsername) || (code !== "" && nick !== ""))
    }

    return ( joinSuccessfully ? <div className={styles.container}>
         <AwaitingPlayersView  code={code} players={waitingRoomPlayers}/></div> :
        <div className={styles.container}>
            <Card className={styles.generateBox} sx={{borderRadius: "20px"}}>
                <Typography>
                    Please fill in the playroom code
                </Typography>
                <Input
                    disabled={false}
                    value={code}
                    size="medium"
                    style={{width: "80%", marginBottom: "10px"}}
                    onChange={handleCodeInputChange}
                    placeholder="Playroom code"
                />
                <div style={{width: "80%", textAlign: "center"}}>
                    <Typography>
                        Enter your desired playroom nick:
                    </Typography>
                    <div className={styles.nickInput}>
                        <Input
                            disabled={false}
                            value={nick}
                            size="medium"
                            style={{width: "100%", marginBottom: "10px"}}
                            onChange={handleNickInputChange}
                            placeholder="Your nick"
                        />
                        <FormGroup>
                            {uuid !== "" && <FormControlLabel
                                label="Use my username"
                                control={
                                    <Checkbox
                                        defaultChecked
                                        value={useUsername}
                                        onChange={handleCheckboxChange}
                                    />
                                }
                            />}
                        </FormGroup>
                    </div>
                </div>
                <Button variant="contained" sx={{marginTop: "10px"}} onClick={handleJoinPlayroom} disabled={isJoinPlayroomButtonDisabled()}>
                    Join playroom
                </Button>
                <br/>
                <hr style={{width: "80%"}}/>
                <Typography>
                    Don't have a code? You can create a playroom&nbsp;
                    <Link to={"/play/create"}>
                        here
                    </Link>
                </Typography>
            </Card>
        </div>
    )
}

export default PlayroomJoin;
