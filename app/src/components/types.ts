// Types for Task Manager
export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  dueDate: string;
  completed: boolean;
  createdAt: string;
  tags: string[];
}

export interface TaskFormData {
  title: string;
  description: string;
  status: Task['status'];
  priority: Task['priority'];
  category: string;
  dueDate: string;
  tags: string[];
}
