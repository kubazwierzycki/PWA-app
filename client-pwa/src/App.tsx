import './App.css'
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Layout from "./pages/Layout.tsx";
import About from "./pages/About.tsx";
import Home from "./pages/Home.tsx";
import Profile from "./pages/Profile.tsx";

function App() {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route path="/" element={<Home />}></Route>
                    <Route path="/about" element={<About />}></Route>
                    <Route path="/profile" element={<Profile />}></Route>
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App
