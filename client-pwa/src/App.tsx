import "./App.css";
import { Route, Routes } from "react-router-dom";
import Layout from "./pages/Layout.tsx";
import About from "./pages/About.tsx";
import Home from "./pages/Home.tsx";
import Profile from "./pages/Profile.tsx";
import Gameplays from "./pages/Gameplays.tsx"
import PlayroomCreate from "./pages/playroom/PlayroomCreate.tsx";
import SignIn from "./pages/SignIn.tsx";
import SignUp from "./pages/SignUp.tsx";
import CollectionPage from "./pages/boardgame/CollectionPage.tsx";
import BoardGameSearch from "./pages/boardgame/BoardGameSearch.tsx";
import { ReactNode, useEffect } from "react";
import Cookies from "js-cookie";
import { useAuth } from "./contexts/AuthContext.tsx";

import { CollectionContextProvider } from "./contexts/CollectionViewContext.tsx";
import bggService from "./services/bgg.ts";
import authorisationService from "./services/authorization.ts";
import ComparingGamesPage from "./pages/boardgame/ComparingGamesPage.tsx";
import BoardGameDetailsPage from "./pages/boardgame/BoardGameDetailsPage.tsx";
import PlayroomJoin from "./pages/playroom/PlayroomJoin.tsx";
import Playroom from "./pages/playroom/Playroom.tsx";
import axios from "axios";

/**
 * Main app component, controls page routing
 * @returns {ReactNode}
 */
function App(): ReactNode {
    const { setToken, setUuid, setUser } = useAuth();

    useEffect(() => {

        async function fetchUserDetails(uuid: string) {
            try{
                const responseApi = await authorisationService.getUserByUuid(uuid);
                const responseBgg = await bggService.getUserByUsername(responseApi.bggUsername);
                const bggId = bggService.getUserIdFromResponse(responseBgg);
                setUser({
                    username: responseApi.username,
                    bggUsername: responseApi.bggUsername,
                    email: responseApi.email,
                    bggId: bggId,
                });
            } catch(err){
                //TODO more errors
                if (axios.isAxiosError(err)) {
                    switch (err.code) {
                        case "ERR_BAD_REQUEST":
                            //token or uuid expired
                            setToken("");
                            setUuid("");
                            Cookies.set("token","");
                            Cookies.set("uuid","");
                            break;
                        default:
                            break;
                    }
                }
            }
        }

        const token = Cookies.get("token");
        const uuid = Cookies.get("uuid");
        if (token && uuid) {
            setToken(token);
            setUuid(uuid);
            fetchUserDetails(uuid);
        }
    }, []);


    useEffect(()=>{

            if (!("Notification" in window)) {
              console.log("This browser does not support notifications.");
            }
            Notification.requestPermission().then((permission) => {
                console.log(permission);
            });

    }, [])


    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route path="/" element={<Home />}></Route>
                <Route path="/about" element={<About />}></Route>
                <Route path="/profile" element={<Profile />}></Route>
                <Route path="/gameplays" element={<Gameplays />}></Route>
                <Route path="/play/create" element={<PlayroomCreate />}></Route>
                <Route path="/play/join" element={<PlayroomJoin />}></Route>
                <Route path="/signIn" element={<SignIn />}></Route>
                <Route path="/signUp" element={<SignUp />}></Route>
                <Route path="/playroom" element={<Playroom />}></Route>
                <Route path="/boardgames/collection" element={
                    <CollectionContextProvider>
                        <CollectionPage />
                    </CollectionContextProvider>
                }>
                </Route>
                <Route path="/boardgames/collection/:gameId" element={<BoardGameDetailsPage />} />
                <Route path="/boardgames/compare" element={<ComparingGamesPage />}></Route>
                <Route path="/boardgames/search" element={<BoardGameSearch />}></Route>
            </Route>
        </Routes>
    );
}

export default App;
