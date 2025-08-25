import React from 'react';
import { Card as MuiCard, CardProps } from '@mui/material';
import { styled } from '@mui/material/styles';
const StyledCard = styled(MuiCard)(({ theme }) => ({
  borderRadius: 12,
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  border: 'none',
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  
  '&:hover': {
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
    transform: 'translateY(-2px)',
  },
}));

interface CustomCardProps extends CardProps {
  children: React.ReactNode;
}

export const Card: React.FC<CustomCardProps> = ({ children, ...props }) => {
  return (
    <StyledCard {...props}>
      {children}
    </StyledCard>
  );
};
