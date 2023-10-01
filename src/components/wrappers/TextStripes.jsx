import { Typography, styled } from "@mui/material";

export const TextStripes = styled(Typography)(({ theme }) => ({
  textAlign: "center",
  position: "relative",
  // fontWeight: "bold",
  textTransform: "capitalize",
  marginBottom: theme.spacing(2), // Adjust the margin as needed

  "&::before, &::after": {
    content: '""',
    position: "absolute",
    bottom: 0,
    width: "50%",
    height: "3px",
    backgroundColor: theme.palette.primary.main, // Use the primary color from the theme
  },

  "&::before": {
    left: 0,
    bottom: "-4px"
  },

  "&::after": {
    left: 0,
    width: "20%",
    bottom: "-10px",
  },
}));
