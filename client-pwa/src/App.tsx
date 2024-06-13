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
import {CollectionContextProvider} from "./contexts/CollectionViewContext.tsx";
import ComparingGamesPage from "./pages/boardgame/ComparingGamesPage.tsx";

/**
 * Main app component, controls page routing
 * @returns {ReactNode}
 */
function App(): ReactNode {
    const { setUuid } = useAuth();
    useEffect(() => {
        const token = Cookies.get("token");
        const uuid = Cookies.get("uuid");
        if (token && uuid) {
            setUuid(token);
            setUuid(uuid);
        }
    });

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
                }></Route>
                <Route path="/boardgames/compare" element={<ComparingGamesPage />}></Route>
                <Route path="/boardgames/random" element={<RandomGamePage />}></Route>
                <Route path="/boardgames/search" element={<BoardGameSearch />}></Route>
            </Route>
        </Routes>
    );
}

export default App;
