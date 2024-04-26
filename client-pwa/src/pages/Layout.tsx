import styles from '../styles/layout.module.css'
import {Outlet} from "react-router-dom";
import Navbar from "../sections/Navbar.tsx";
import {AuthProvider} from "../contexts/AuthContext.tsx";
import {ThemeModeProvider} from "../contexts/ThemeContext.tsx";
import Footer from "../sections/Footer.tsx";

const Layout = () => {


    return (
        <ThemeModeProvider>
            <AuthProvider>
                <div className={styles.pageContainer}>
                    <div className={styles.contentWrapper}>
                        <div className={styles.navbar}>
                            <Navbar/>
                        </div>
                        <div className={styles.pageContent}>
                            <Outlet/>
                        </div>
                    </div>
                    <div className={styles.footerContainer}>
                        <Footer />
                    </div>
                </div>
            </AuthProvider>
        </ThemeModeProvider>
    )
}

export default Layout;