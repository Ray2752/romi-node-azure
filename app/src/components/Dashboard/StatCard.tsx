import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  LinearProgress,
  useTheme,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Assignment as TaskIcon,
  CheckCircle as CompletedIcon,
  Schedule as PendingIcon,
} from '@mui/icons-material';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: React.ReactNode;
  color: 'primary' | 'secondary' | 'success' | 'warning';
  trend?: 'up' | 'down';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  icon,
  color,
  trend
}) => {
  const theme = useTheme();

  const getBackgroundColor = () => {
    switch (color) {
      case 'primary':
        return 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)';
      case 'secondary':
        return 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
      case 'success':
        return 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)';
      case 'warning':
        return 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
      default:
        return theme.palette.primary.main;
    }
  };

  return (
    <Card sx={{ height: '100%', position: 'relative', overflow: 'visible' }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Box>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 1, fontWeight: 500 }}
            >
              {title}
            </Typography>
            <Typography
              variant="h4"
              sx={{ mb: 1, fontWeight: 700, color: 'text.primary' }}
            >
              {value}
            </Typography>
            {change && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <TrendingUpIcon
                  sx={{
                    fontSize: 16,
                    color: trend === 'up' ? 'success.main' : 'error.main',
                    transform: trend === 'down' ? 'rotate(180deg)' : 'none',
                  }}
                />
                <Typography
                  variant="body2"
                  sx={{
                    color: trend === 'up' ? 'success.main' : 'error.main',
                    fontWeight: 500,
                  }}
                >
                  {change}
                </Typography>
              </Box>
            )}
          </Box>
          <Avatar
            sx={{
              width: 56,
              height: 56,
              background: getBackgroundColor(),
              boxShadow: `0 8px 24px ${theme.palette[color].main}40`,
            }}
          >
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );
};
export const TotalTasksCard: React.FC<{ count: number; change?: string }> = ({ count, change }) => (
  <StatCard
    title="Total Tasks"
    value={count}
    change={change}
    icon={<TaskIcon />}
    color="primary"
    trend="up"
  />
);

export const CompletedTasksCard: React.FC<{ count: number; change?: string }> = ({ count, change }) => (
  <StatCard
    title="Completed"
    value={count}
    change={change}
    icon={<CompletedIcon />}
    color="success"
    trend="up"
  />
);

export const PendingTasksCard: React.FC<{ count: number; change?: string }> = ({ count, change }) => (
  <StatCard
    title="Pending"
    value={count}
    change={change}
    icon={<PendingIcon />}
    color="warning"
    trend="down"
  />
);
interface TaskProgressCardProps {
  completed: number;
  total: number;
}

export const TaskProgressCard: React.FC<TaskProgressCardProps> = ({ completed, total }) => {
  const progress = (completed / total) * 100;

  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Task Progress
        </Typography>
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Progress
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {completed}/{total}
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: 'grey.200',
              '& .MuiLinearProgress-bar': {
                borderRadius: 4,
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              },
            }}
          />
        </Box>
        <Typography
          variant="h4"
          sx={{ fontWeight: 700, color: 'primary.main' }}
        >
          {Math.round(progress)}%
        </Typography>
      </CardContent>
    </Card>
  );
};
