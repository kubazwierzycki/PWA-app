import {
    createContext,
    ReactElement,
    useContext,
} from "react";
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { SendJsonMessage } from "react-use-websocket/dist/lib/types";

interface WebSocketContextType {
    sendJsonMessage: SendJsonMessage;
    lastJsonMessage: unknown;
    readyState: ReadyState;
  }

const WebSocketContext = createContext<WebSocketContextType>({} as WebSocketContextType);

export const WebSocketProvider = ({children}: {children: ReactElement}) => {
  // Establish the WebSocket connection using the hook
  const WS_URL = "ws://localhost:8080/ws-playrooms";

  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(WS_URL, {
        share: true,
        onOpen: () => {
            console.log("WebSocket connection established.");
        },
    });

  return (
    <WebSocketContext.Provider value={{ sendJsonMessage, lastJsonMessage, readyState }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocketContext = () => {
    return useContext(WebSocketContext);
};
