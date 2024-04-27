import {createContext, ReactElement, useContext, useMemo, useState} from "react";
import {blue, green, grey, indigo, teal} from "@mui/material/colors";
import {createTheme, CssBaseline, PaletteMode, ThemeProvider} from "@mui/material";


const ColorModeContext = createContext({
    toggleColorMode: () => {}
});

export const ThemeModeProvider = ({children}: {children: ReactElement}) => {

    const getDesignTokens = (mode: PaletteMode) => ({
        palette: {
            mode,
            ...(mode === 'light'
                ? {
                    // palette values for light mode
                    primary: blue,
                    secondary: green,
                    divider: blue[200],
                    background: {
                        default: '#fff',
                        paper: 'rgba(239,246,248)',
                    },
                    text: {
                        primary: '#000',
                        secondary: blue[800],
                    },
                }
                : {
                    // palette values for dark mode
                    primary: indigo,
                    secondary: teal,
                    divider: blue[600],
                    background: {
                        default: '#3C3C3C',
                        paper: '#383838',
                    },
                    text: {
                        primary: '#fff',
                        secondary: grey[500],
                    },
                }),
        },
    });


    const [mode, setMode] = useState('light');

    const colorMode = useMemo(
        () => ({
            toggleColorMode: () => {
                setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
            },
        }),
        [],
    );

    // Update the theme only if the mode changes
    const theme = useMemo(() => createTheme(getDesignTokens(mode as "light" | "dark")), [mode]);

    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </ColorModeContext.Provider>
    )
}

export const useColorMode = () => {
    return useContext(ColorModeContext);
};