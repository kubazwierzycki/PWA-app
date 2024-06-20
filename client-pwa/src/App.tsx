import "./App.css";
import { Route, Routes } from "react-router-dom";
import Layout from "./pages/Layout.tsx";
import About from "./pages/About.tsx";
import Home from "./pages/Home.tsx";
import Profile from "./pages/Profile.tsx";
import Play from "./pages/Play.tsx";
import SignIn from "./pages/SignIn.tsx";
import SignUp from "./pages/SignUp.tsx";
import CollectionPage from "./pages/boardgame/CollectionPage.tsx";
import RandomGamePage from "./pages/boardgame/RandomGamePage.tsx";
import BoardGameSearch from "./pages/boardgame/BoardGameSearch.tsx";
import { ReactNode, useEffect } from "react";
import Cookies from "js-cookie";
import { useAuth } from "./contexts/AuthContext.tsx";

import { CollectionContextProvider } from "./contexts/CollectionViewContext.tsx";
import bggService from "./services/bgg.ts";
import authorisationService from "./services/authorization.ts";
import ComparingGamesPage from "./pages/boardgame/ComparingGamesPage.tsx";
import BoardGameDetailsPage from "./pages/boardgame/BoardGameDetailsPage.tsx";

/**
 * Main app component, controls page routing
 * @returns {ReactNode}
 */
function App(): ReactNode {
    const { setToken, setUuid, setUser } = useAuth();

    useEffect(() => {
        async function fetchUserDetails(uuid: string) {
            const resA = await authorisationService.getUserByUuid(uuid);
            const resB = await bggService.getUserByUsername(resA.bggUsername);
            const bggId = bggService.getUserIdFromResponse(resB);
            setUser({
                username: resA.username,
                bggUsername: resA.bggUsername,
                email: resA.email,
                bggId: bggId,
            });
        }

        const token = Cookies.get("token");
        const uuid = Cookies.get("uuid");
        if (token && uuid) {
            setToken(token);
            setUuid(uuid);
            fetchUserDetails(uuid);
        }
    }, []);

    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route path="/" element={<Home />}></Route>
                <Route path="/about" element={<About />}></Route>
                <Route path="/profile" element={<Profile />}></Route>
                <Route path="/play" element={<Play />}></Route>
                <Route path="/signIn" element={<SignIn />}></Route>
                <Route path="/signUp" element={<SignUp />}></Route>
                <Route path="/boardgames/collection" element={
                    <CollectionContextProvider>
                        <CollectionPage />
                    </CollectionContextProvider>
                }>
                </Route>
                <Route path="/boardgames/collection/:gameId" element={<BoardGameDetailsPage />} />
                <Route path="/boardgames/compare" element={<ComparingGamesPage />}></Route>
                <Route path="/boardgames/random" element={<RandomGamePage />}></Route>
                <Route path="/boardgames/search" element={<BoardGameSearch />}></Route>
            </Route>
        </Routes>
    );
}

export default App;
