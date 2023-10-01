import { Stack, styled } from "@mui/material";

export const HorizontalScroll = styled(Stack)(({ theme }) => ({
  // Your wrapper styles go here
  overflowX: "scroll",
  marginTop: theme.spacing(1),
  "&::-webkit-scrollbar": {
    width: "0.5rem", // Adjust as needed
  },
  "&::-webkit-scrollbar-track": {
    background: "transparent",
  },
  "&::-webkit-scrollbar-thumb": {
    background: "transparent",
    border: "none",
    display: "none",
  },
  [theme.breakpoints.down("sm")]: {
    marginBottom: theme.spacing(2), // Apply margin-top: 1 on small screens
  },
}));
