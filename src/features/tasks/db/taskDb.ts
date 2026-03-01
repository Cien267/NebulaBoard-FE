import Dexie, { type Table } from 'dexie'
import { type Task, type RichTextNote } from '../types'

export class TaskDatabase extends Dexie {
  tasks!: Table<Task, string>
  notes!: Table<RichTextNote, string>

  constructor() {
    super('TaskDatabase')
    this.version(2).stores({
      tasks: 'id, status, createdDate, priority',
      notes: 'id, updatedDate',
    })
  }
}

export const db = new TaskDatabase()
