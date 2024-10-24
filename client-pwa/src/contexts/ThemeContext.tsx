import {createContext, ReactElement, ReactNode, useContext, useMemo, useState} from "react";
import {blue, green, grey, indigo, teal} from "@mui/material/colors";
import {createTheme, CssBaseline, PaletteMode, responsiveFontSizes, ThemeProvider} from "@mui/material";
import 'typeface-quicksand'; 

const ColorModeContext = createContext({
    toggleColorMode: () => {}
});

// If you're using TypeScript, then you need to use module augmentation for custom colors.
// https://mui.com/material-ui/guides/typescript/#customization-of-theme
declare module '@mui/material/styles' {
    interface Palette {
        player: string;
    }
    interface PaletteOptions {
        player?: string;
    }
  }


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
        typography: {
            fontFamily: 'Quicksand', //Oxanium, Nunito, Quicksand, 
        },
        palette: {
            mode,
            ...(mode === 'light'
                ? {
                    // palette values for light mode
                    primary: blue,
                    secondary: green,
                    player: blue[200],
                    divider: blue[100],
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
                    player: indigo[400],
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
    const theme = useMemo(() => responsiveFontSizes((createTheme(getDesignTokens(mode as "light" | "dark")))), [mode]);

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
