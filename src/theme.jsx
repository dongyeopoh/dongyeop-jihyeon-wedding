import { createTheme } from "@mui/material";

export const theme = (mode) => createTheme({
    palette: {
        mode : mode,
        primary: {
            main: '#598bba',
            light: '#31608d',
            dark: '#1565c0',
            // light: will be calculated from palette.primary.main,
            // dark: will be calculated from palette.primary.main,
            // contrastText: will be calculated to contrast with palette.primary.main
        },
        secondary: {
            main: '#8eb264',
            light: '#ccff90',
            // dark: will be calculated from palette.secondary.main,
            
        },
        other:{
            main:'#385f7f'

        },
        action: {
            disabledBackground: '',
            disabled: '#adadad36',
        }
    },
    typography:{
        fontFamily: ['"Noto Sans KR"','Roboto', 'sans-serif'],
        fontSize:14,
        fontWeightLight:300,
        fontWeightRegular:400,
        fontWeightMedium:500,
        fontWeightBold:700,

        // fontFamily: ["Noto Sans KR", "sans-serif", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue"].join(",")
    },

})