import { Container } from '@mui/material';
import { styled } from '@mui/system';

const BodyWrapper = styled(Container)(({ theme }) => ({
  [theme.breakpoints.up('sm')]: {
    maxWidth: theme.breakpoints.values.sm,
    padding: 0,
  },
  padding: 0,
}));

export default BodyWrapper;
