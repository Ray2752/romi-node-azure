import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  LinearProgress,
  useTheme,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
} from '@mui/icons-material';

interface TaskCardProps {
  task: {
    id: string;
    title: string;
    description?: string;
    status: 'todo' | 'in-progress' | 'completed';
    priority: 'low' | 'medium' | 'high';
    dueDate?: string;
    assignee?: {
      name: string;
      avatar?: string;
    };
    progress?: number;
    tags?: string[];
  };
  onEdit?: (taskId: string) => void;
  onDelete?: (taskId: string) => void;
  onStatusChange?: (taskId: string, status: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const getStatusColor = () => {
    switch (task.status) {
      case 'completed':
        return theme.palette.success.main;
      case 'in-progress':
        return theme.palette.warning.main;
      default:
        return theme.palette.grey[400];
    }
  };

  const getPriorityColor = () => {
    switch (task.priority) {
      case 'high':
        return theme.palette.error.main;
      case 'medium':
        return theme.palette.warning.main;
      default:
        return theme.palette.info.main;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[8],
        },
      }}
    >
      <CardContent sx={{ p: 3, flexGrow: 1 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: getStatusColor(),
              }}
            />
            <Chip
              label={task.priority.toUpperCase()}
              size="small"
              sx={{
                backgroundColor: getPriorityColor() + '20',
                color: getPriorityColor(),
                fontWeight: 600,
                fontSize: '0.7rem',
              }}
            />
          </Box>
          <IconButton size="small" onClick={handleMenuClick}>
            <MoreVertIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Title & Description */}
        <Typography
          variant="h6"
          sx={{
            mb: 1,
            fontWeight: 600,
            fontSize: '1.1rem',
            lineHeight: 1.3,
            textDecoration: task.status === 'completed' ? 'line-through' : 'none',
            color: task.status === 'completed' ? 'text.secondary' : 'text.primary',
          }}
        >
          {task.title}
        </Typography>

        {task.description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 2, lineHeight: 1.5 }}
          >
            {task.description}
          </Typography>
        )}

        {/* Progress Bar */}
        {task.progress !== undefined && (
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Progress
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {task.progress}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={task.progress}
              sx={{
                height: 6,
                borderRadius: 3,
                backgroundColor: 'grey.200',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 3,
                  backgroundColor: getStatusColor(),
                },
              }}
            />
          </Box>
        )}

        {/* Tags */}
        {task.tags && task.tags.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
            {task.tags.map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                size="small"
                variant="outlined"
                sx={{
                  fontSize: '0.7rem',
                  height: 20,
                  borderColor: 'grey.300',
                  color: 'text.secondary',
                }}
              />
            ))}
          </Box>
        )}

        {/* Footer */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
          {/* Due Date */}
          {task.dueDate && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <CalendarIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary">
                {formatDate(task.dueDate)}
              </Typography>
            </Box>
          )}

          {/* Assignee */}
          {task.assignee && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar
                sx={{ width: 24, height: 24, fontSize: '0.7rem' }}
                src={task.assignee.avatar}
              >
                {task.assignee.name.charAt(0)}
              </Avatar>
              <Typography variant="caption" color="text.secondary">
                {task.assignee.name}
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>

      {/* Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => { onEdit?.(task.id); handleMenuClose(); }}>
          Edit
        </MenuItem>
        <MenuItem onClick={() => { onStatusChange?.(task.id, 'completed'); handleMenuClose(); }}>
          Mark Complete
        </MenuItem>
        <MenuItem onClick={() => { onDelete?.(task.id); handleMenuClose(); }} sx={{ color: 'error.main' }}>
          Delete
        </MenuItem>
      </Menu>
    </Card>
  );
};
