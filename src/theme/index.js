import { createTheme, responsiveFontSizes } from "@mui/material";
import { THEME_VALUES } from "../utils/constants";

export const getTheme = (mode) => {
  let theme = createTheme({
    palette: {
      mode: mode,
      primary: {
        main: THEME_VALUES["PALETTE_PRIMARY_MAIN"][mode],
      },
      secondary: {
        main: THEME_VALUES["PALETTE_SECONDARY_MAIN"][mode],
      },
      background: {
        default: THEME_VALUES["PALETTE_BACKGROUND_DEFAULT"][mode],
        paper: THEME_VALUES["PALETTE_PAPER_DEFAULT"][mode],
      },
    },
    typography: {
      subtitle1: {
        color: THEME_VALUES["TEXT_COLOR_PRIMARY"][mode],
      },
      subtitle2: {
        color: THEME_VALUES["TEXT_COLOR_PRIMARY"][mode],
      },
      body1: {
        color: THEME_VALUES["TEXT_COLOR_PRIMARY"][mode],
      },
      h1: {
        color: THEME_VALUES["TEXT_COLOR_PRIMARY"][mode],
      },
      h2: {
        color: THEME_VALUES["TEXT_COLOR_PRIMARY"][mode],
      },
      h3: {
        color: THEME_VALUES["TEXT_COLOR_PRIMARY"][mode],
      },
      h4: {
        color: THEME_VALUES["TEXT_COLOR_PRIMARY"][mode],
      },
      h5: {
        color: THEME_VALUES["TEXT_COLOR_PRIMARY"][mode],
      },
      h6: {
        color: THEME_VALUES["TEXT_COLOR_PRIMARY"][mode],
      },
      caption: {
        color: THEME_VALUES["TEXT_COLOR_SECONDARY"][mode],
      },
    },
    components: {
      MuiTextField: {
        defaultProps: {
          size: "small",
        },
      },
      MuiOutlinedInput: {
        defaultProps: {
          size: "small",
        },
        styleOverrides: {
          root: {
            '&:hover': {
              '& fieldset': {
                borderColor: '#ccc !important', // Set the border width to 1px on hover
              },
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow: THEME_VALUES["CARD_BOXSHADOW"][mode],
          },
        },
      },
      MuiButton: {
        variants: [
          {
            props: { variant: "text" },
            style: {
              textTransform: "none",
              display: "flex",
              alignItems: "center",
              letterSpacing: 0,
              fontWeight: "600",
            },
          },
          {
            props: { variant: "contained" },
            style: {
              textTransform: "none",
              letterSpacing: 0,
            },
          },
          {
            props: { variant: "outlined" },
            style: {
              textTransform: "none",
              letterSpacing: 0,
            },
          },
        ],
      },
      MuiDialogTitle: {
        styleOverrides: {
          root: {
            textAlign: "center",
            letterSpacing: 0,
            fontWeight: "500",
            fontSize: "18px",
          },
        },
      },
      MuiAutocomplete: {
        styleOverrides: {
          popper: {
            boxShadow: "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px !important", // Add your desired box shadow here
          },
        },
      },
    },
  });
  theme = responsiveFontSizes(theme, {
    breakpoints: ["sm"],
    disableAlign: true, // Disable auto-align to maintain custom sizes
  });
  return theme;
};
