import { v4 as uuidv4 } from 'uuid'
import { notesDb } from '../db/notesDb'
import type { Note, NoteSortField, NoteSortOrder } from '../types'

export const notesService = {
  async getAllNotes(
    sortField: NoteSortField = 'updatedDate',
    sortOrder: NoteSortOrder = 'desc'
  ): Promise<Note[]> {
    const table = notesDb.notes
    let collection
    
    // Dexie doesn't natively support dynamic multi-field sorting easily without composite keys,
    // so we get all and sort in memory for simplicity, which is fine for local notes.
    const allNotes = await table.toArray()
    
    return allNotes.sort((a, b) => {
        // Always prioritize pinned notes first
        if (a.isPinned !== b.isPinned) {
            return a.isPinned ? -1 : 1
        }
        
        // Then sort by the requested field
        let comparison = 0
        if (sortField === 'title') {
             comparison = a.title.localeCompare(b.title)
        } else {
             comparison = (a[sortField] as number) - (b[sortField] as number)
        }
        
        return sortOrder === 'asc' ? comparison : -comparison
    })
  },

  async addNote(noteData: Omit<Note, 'id' | 'createdDate' | 'updatedDate'>): Promise<string> {
    const id = uuidv4()
    const now = Date.now()
    const newNote: Note = {
      ...noteData,
      id,
      createdDate: now,
      updatedDate: now,
    }
    await notesDb.notes.add(newNote)
    return id
  },

  async updateNote(id: string, updates: Partial<Omit<Note, 'id' | 'createdDate' | 'updatedDate'>>): Promise<void> {
    await notesDb.notes.update(id, {
      ...updates,
      updatedDate: Date.now(),
    })
  },

  async deleteNote(id: string): Promise<void> {
    await notesDb.notes.delete(id)
  },

  async togglePin(id: string, currentPinStatus: boolean): Promise<void> {
    await notesDb.notes.update(id, {
      isPinned: !currentPinStatus,
      updatedDate: Date.now(),
    })
  },
  
  async searchNotes(query: string): Promise<Note[]> {
      const lowerQuery = query.toLowerCase()
      const allNotes = await notesDb.notes.toArray()
      
      return allNotes.filter(n => 
          n.title.toLowerCase().includes(lowerQuery) || 
          n.content.toLowerCase().includes(lowerQuery) ||
          n.tags.some(t => t.toLowerCase().includes(lowerQuery))
      ).sort((a,b) => b.updatedDate - a.updatedDate) 
      // simple sort by recent for search
  }
}
