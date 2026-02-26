export interface Task {
  id: string
  title: string
  status: 'todo' | 'in_progress' | 'done'
  createdDate: number // timestamp
  priority: 'low' | 'medium' | 'high'
  tags: string[]
  deadline?: number // timestamp
  estimatedTime?: number // in minutes
}

export type TaskStatusType = 'all' | 'todo' | 'in_progress' | 'done'
