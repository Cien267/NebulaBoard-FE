import Dexie, { type Table } from 'dexie'
import { type Task } from '../types'

export class TaskDatabase extends Dexie {
  tasks!: Table<Task, string>

  constructor() {
    super('TaskDatabase')
    this.version(1).stores({
      tasks: 'id, status, createdDate, priority', // Primary key and indexed props
    })
  }
}

export const db = new TaskDatabase()
