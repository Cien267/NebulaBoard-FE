export interface Task {
  id: string
  title: string
  status: 'todo' | 'in_progress' | 'done'
  createdDate: number // timestamp
  priority: 'low' | 'medium' | 'high'
  tags: string[]
  deadline?: Date // timestamp
  estimatedTime?: number // in minutes
}

export type TaskStatusFilterType = 'all' | 'todo' | 'in_progress' | 'done'

export type TaskPriorityFilterType = 'all' | 'low' | 'medium' | 'high'

export interface RichTextNote {
  id: string
  title: string
  content: string
  updatedDate: number
}
