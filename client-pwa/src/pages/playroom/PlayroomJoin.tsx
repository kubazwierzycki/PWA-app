import {ChangeEvent, ReactNode, useEffect, useState} from "react";
import styles from "../../styles/createPlayroom.module.css";
import {Button, Card, Checkbox, FormControlLabel, FormGroup, Input, Typography} from "@mui/material";
import {Link} from "react-router-dom";
import useWebSocket, { ReadyState }  from "react-use-websocket";
import { buildJoinWaitingRoomMessage, Player, PlayroomMessage, waitingRoomMessage } from "../../services/playroom";
import { useAuth } from "../../contexts/AuthContext";
import AwaitingPlayersView from "../../components/views/playroom/AwaitingPlayersView";

/**
 * Live board game playing room joining page
 * @returns {ReactNode}
 */
const PlayroomJoin = (): ReactNode => {
    const [joinSuccessfully, setJoinSuccessfully] = useState<boolean>(false);
    const [waitingRoomPlayers, setWaitingRoomPlayers] = useState<Player[]>([]);
    const {uuid, user } = useAuth();
    
    //webSocket
    const WS_URL = "ws://localhost:8080/ws-playrooms";

    const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(WS_URL, {
        share: true,
        onOpen: () => {
            console.log("WebSocket connection established.");
        },
    });

    useEffect(() => {
        if (lastJsonMessage) {
            console.log(lastJsonMessage);
            
            const messageType : string = (lastJsonMessage as PlayroomMessage).type;
            switch(messageType){
                case "welcomeInfo": {
                    console.log("welcomeInfo");
                    setJoinSuccessfully(true);
                    break;
                }
                case "waitingRoom": {
                    const waitingRoomMessage : waitingRoomMessage = (lastJsonMessage as waitingRoomMessage);
                    setWaitingRoomPlayers(waitingRoomMessage.players);
                    console.log("waitingRoom");
                    break;
                }
                default: {
                    console.log("Unknown message type");
                    break;
                }
            }
        } else {
            console.log("None");
        }
    }, [lastJsonMessage]);

    // playroom code entered by user
    const [code, setCode] = useState<string>("");

    // entered nick value for playroom
    const [nick, setNick] = useState<string>("");

    // should username be used as nick
    const [useUsername, setUseUsername] = useState<boolean>(true);

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
            console.log("ready");
            if(!joinSuccessfully){
                if(useUsername){
                    sendJsonMessage(buildJoinWaitingRoomMessage(code, user.username, uuid));
                } else{
                    sendJsonMessage(buildJoinWaitingRoomMessage(code, nick));
                }
            }
        }
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
                            <FormControlLabel
                                label="Use my username"
                                control={
                                    <Checkbox
                                        defaultChecked
                                        value={useUsername}
                                        onChange={handleCheckboxChange}
                                    />
                                }
                            />
                        </FormGroup>
                    </div>
                </div>
                <Button variant="contained" sx={{marginTop: "10px"}} onClick={handleJoinPlayroom}>
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
