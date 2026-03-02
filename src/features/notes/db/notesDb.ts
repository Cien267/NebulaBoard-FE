import Dexie, { type Table } from 'dexie'
import type { Note } from '../types'

export class NotesDatabase extends Dexie {
  notes!: Table<Note, string>

  constructor() {
    super('NotesDatabase')
    this.version(1).stores({
      notes: 'id, title, isPinned, createdDate, updatedDate, *tags', // *tags makes array searchable
    })
  }
}

export const notesDb = new NotesDatabase()
