import React from 'react';
import { Button as MuiButton, ButtonProps } from '@mui/material';
import { styled } from '@mui/material/styles';
const StyledButton = styled(MuiButton)(({ theme, variant }) => ({
  borderRadius: 8,
  textTransform: 'none',
  fontWeight: 500,
  padding: '12px 24px',
  

  ...(variant === 'contained' && {
    backgroundColor: theme.palette.primary.main,
    color: '#ffffff',
    boxShadow: '0 2px 8px rgba(25, 118, 210, 0.3)',
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
      boxShadow: '0 4px 12px rgba(25, 118, 210, 0.4)',
    },
  }),
  

  ...(variant === 'outlined' && {
    borderColor: theme.palette.primary.main,
    color: theme.palette.primary.main,
    borderWidth: 2,
    '&:hover': {
      borderWidth: 2,
      backgroundColor: 'rgba(25, 118, 210, 0.04)',
    },
  }),
}));

interface CustomButtonProps extends ButtonProps {
  children: React.ReactNode;
}

export const Button: React.FC<CustomButtonProps> = ({ children, ...props }) => {
  return (
    <StyledButton {...props}>
      {children}
    </StyledButton>
  );
};
