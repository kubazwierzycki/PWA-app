import {
    createContext,
    ReactElement,
    useContext,
    useState,
} from "react";
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { SendJsonMessage } from "react-use-websocket/dist/lib/types";

interface WebSocketContextType {
    sendJsonMessage: SendJsonMessage;
    lastJsonMessage: unknown;
    readyState: ReadyState;
    socketUrl: string | null,
    setSocketUrl: React.Dispatch<React.SetStateAction<string | null>>,
  }

const WebSocketContext = createContext<WebSocketContextType>({} as WebSocketContextType);

export const WebSocketProvider = ({children}: {children: ReactElement}) => {
  // Establish the WebSocket connection using the hook
  const [socketUrl, setSocketUrl] = useState<string | null>(null);
  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(socketUrl, {
        share: true,
        onOpen: () => {
            console.log("WebSocket connection established.");
        },
    });

  return (
    <WebSocketContext.Provider value={{ sendJsonMessage, lastJsonMessage, readyState,socketUrl, setSocketUrl }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocketContext = () => {
    return useContext(WebSocketContext);
};
