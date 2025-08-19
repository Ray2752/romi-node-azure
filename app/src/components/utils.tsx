import {
  CheckCircle as CompleteIcon,
  PlayArrow as InProgressIcon,
  Schedule as PendingIcon
} from '@mui/icons-material';

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed': return 'success';
    case 'in-progress': return 'primary';
    case 'todo': return 'warning';
    default: return 'default';
  }
};

export const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'urgent': return 'error';
    case 'high': return 'warning';
    case 'medium': return 'info';
    case 'low': return 'success';
    default: return 'default';
  }
};

export const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed': return <CompleteIcon />;
    case 'in-progress': return <InProgressIcon />;
    case 'todo': return <PendingIcon />;
    default: return <PendingIcon />;
  }
};
