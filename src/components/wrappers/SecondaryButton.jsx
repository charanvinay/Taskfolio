import { Button } from '@mui/material';
import { styled } from '@mui/system';
import { COLORS } from '../../utils/constants';

const SecondaryButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#EDF2F8",
  color: COLORS["PRIMARY"],
  textTransform: "none",
  borderRadius: 10,
  letterSpacing: 0,
  paddingTop: "8px",
  paddingBottom: "8px",
  minWidth: "150px",
  fontSize: "14px"
}));

export default SecondaryButton;
