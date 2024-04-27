import './App.css'
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Layout from "./pages/Layout.tsx";
import About from "./pages/About.tsx";
import Home from "./pages/Home.tsx";
import Profile from "./pages/Profile.tsx";
import Play from "./pages/Play.tsx";
import CollectionPage from "./pages/boardgame/CollectionPage.tsx";
import RandomGamePage from "./pages/boardgame/RandomGamePage.tsx";
import BoardGameSearch from "./pages/boardgame/BoardGameSearch.tsx";

function App() {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route path="/" element={<Home />}></Route>
                    <Route path="/about" element={<About />}></Route>
                    <Route path="/profile" element={<Profile />}></Route>
                    <Route path="/play" element={<Play />}></Route>
                    <Route path="/boardgames/collection" element={<CollectionPage />}></Route>
                    <Route path="/boardgames/random" element={<RandomGamePage />}></Route>
                    <Route path="/boardgames/search" element={<BoardGameSearch />}></Route>
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App
