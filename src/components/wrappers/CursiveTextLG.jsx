import { Typography, styled } from "@mui/material";
import { COLORS } from "../../utils/constants";

export const CursiveTextLG = styled(Typography)((theme) => ({
  fontWeight: "500",
  textAlign: "center",
  lineHeight: 2,
  color: COLORS["PRIMARY"],
  textTransform: "capitalize",
  fontFamily: "Pacifico, cursive !important",
}));
