import Dexie, { type Table } from 'dexie'
import { type Task, type RichTextNote } from '@/features/tasks/types'
import type { Note } from '@/features/notes/types'

export class TaskDatabase extends Dexie {
  tasks!: Table<Task, string>
  taskText!: Table<RichTextNote, string>
  notes!: Table<Note, string>

  constructor() {
    super('NebulaBoardDatabase')
    this.version(1).stores({
      tasks: 'id, status, createdDate, priority',
      taskText: 'id, updatedDate',
      notes: 'id, title, isPinned, createdDate, updatedDate, *tags',
    })
  }
}

export const db = new TaskDatabase()
