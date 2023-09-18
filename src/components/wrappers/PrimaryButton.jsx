import { Button } from '@mui/material';
import { styled } from '@mui/system';
import { COLORS } from '../../utils/constants';

const PrimaryButton = styled(Button)(({ theme }) => ({
  backgroundColor: COLORS["PRIMARY"],
  textTransform: "none",
  borderRadius: 10,
  letterSpacing: 0,
  paddingTop: "8px",
  paddingBottom: "8px",
  minWidth: "150px",
  boxShadow: "none",
  fontSize: "14px"
}));

export default PrimaryButton;
