export interface Note {
  id: string
  title: string
  content: string
  color: string // Tailwind color class or hex, e.g., 'bg-red-200'
  isPinned: boolean
  tags: string[]
  createdDate: number // timestamp
  updatedDate: number // timestamp
}

export type NoteSortField = 'updatedDate' | 'createdDate' | 'title'
export type NoteSortOrder = 'asc' | 'desc'
