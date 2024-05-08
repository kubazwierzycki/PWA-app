import {createContext, ReactElement, ReactNode, useContext, useMemo, useState} from "react";
import {blue, green, grey, indigo, teal} from "@mui/material/colors";
import {createTheme, CssBaseline, PaletteMode, ThemeProvider} from "@mui/material";


const ColorModeContext = createContext({
    toggleColorMode: () => {}
});

/**
 * Context for webpage theme and color mode control
 * @param {ReactElement} children - elements within context
 * @returns {ReactNode}
 */
export const ThemeModeProvider = ({children}: {children: ReactElement}): ReactNode => {

    /**
     * Returns color theme palette for light/dark mode
     * @param {PaletteMode} mode - light or dark mode
     */
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

    /**
     * Stores current theme mode
     */
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
