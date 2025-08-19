import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Assignment as TaskIcon,
  Category as CategoryIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';

interface NavigationDrawerProps {
  open: boolean;
  currentView: string;
  onClose: () => void;
  onViewChange: (view: string) => void;
}

const NavigationDrawer = ({
  open,
  currentView,
  onClose,
  onViewChange
}: NavigationDrawerProps) => {
  const handleViewChange = (view: string) => {
    onViewChange(view);
    onClose();
  };

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      sx={{ '& .MuiDrawer-paper': { width: 280 } }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" color="primary">
          📝 Task Manager
        </Typography>
      </Box>
      <Divider />
      <List>
        <ListItem 
          button 
          selected={currentView === 'dashboard'}
          onClick={() => handleViewChange('dashboard')}
        >
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem 
          button 
          selected={currentView === 'tasks'}
          onClick={() => handleViewChange('tasks')}
        >
          <ListItemIcon>
            <TaskIcon />
          </ListItemIcon>
          <ListItemText primary="Tareas" />
        </ListItem>
        <ListItem 
          button 
          selected={currentView === 'categories'}
          onClick={() => handleViewChange('categories')}
        >
          <ListItemIcon>
            <CategoryIcon />
          </ListItemIcon>
          <ListItemText primary="Categorías" />
        </ListItem>
        <ListItem 
          button 
          selected={currentView === 'settings'}
          onClick={() => handleViewChange('settings')}
        >
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Configuración" />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default NavigationDrawer;
