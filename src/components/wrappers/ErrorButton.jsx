import { Button } from '@mui/material';
import { styled } from '@mui/system';

const ErrorButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.error.main,
  textTransform: "none",
  borderRadius: 10,
  letterSpacing: 0,
  paddingTop: "8px",
  paddingBottom: "8px",
  minWidth: "150px",
  boxShadow: "none",
  fontSize: "14px"
}));

export default ErrorButton;
