import fs from 'node:fs'
import path from 'node:path'

import { VoiceEntry } from './types'

// Path to the CSV that ships with the template
const csvPath = path.resolve(
  new URL('.', import.meta.url).pathname,
  'Expanded_Diary_Entries.csv'
)

let raw = ''
try {
  raw = fs.readFileSync(csvPath, 'utf8')
} catch {
  // If the file cannot be read for some reason (e.g. distributed without CSV)
  // fall back to a small stub so tests keep working.
  raw = 'transcript_raw,transcript_user'
}

// Remove first header line and empty trailing newline, then count rows
const rowCount = Math.max(0, raw.trim().split('\n').length - 1)

// 
function parseCSV(csv: string): Record<string, string>[] {
  const lines = csv.trim().split('\n')
  const headers = lines[0].split(',').map(h => h.trim())
  return lines.slice(1).map(line => {
  const values: string[] = []
  let current = ''
  let insideQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    const nextChar = line[i + 1]

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        current += '"' // Escaped quote
      i++
    } else {
      insideQuotes = !insideQuotes
    }
  } else if (char === ',' && !insideQuotes) {
    values.push(current.trim().replace(/^"|"$/g, ''))
    current = ''
  } else {
    current += char
  }
}

  values.push(current.trim().replace(/^"|"$/g, '')) 
    const record: Record<string, string> = {}
    headers.forEach((header, i) => {
      record[header] = values[i] ?? ''
    })
    return record
  })
}


const records = parseCSV(raw)
// Build a minimal VoiceEntry object. For unit-tests we only care about tags_user,
// but we populate required fields to satisfy the strict compiler.
function buildEntry(id: number): VoiceEntry {
  const iso = new Date().toISOString()
  return {
    id: String(id),
    user_id: 'mock',
    audio_url: null,
    transcript_raw: records[id].transcript_raw,
    transcript_user: records[id].transcript_user,
    language_detected: 'en',
    language_rendered: 'en',
    tags_model: [],
    tags_user: ['reflection'],
    category: null,
    created_at: iso,
    updated_at: iso,
    emotion_score_score: null,
    embedding: null,
  }
}

// Create entries from CSV data
const csvEntries: VoiceEntry[] = Array.from({ length: rowCount }).map((_, i) => buildEntry(i))


const testEntries: VoiceEntry[] = [
  {
    id: 'extra1',
    user_id: 'mock',
    audio_url: null,
    transcript_raw: 'I have to buy groceries tomorrow.',
    transcript_user: 'I have to buy groceries tomorrow.',
    language_detected: 'en',
    language_rendered: 'en',
    tags_model: [],
    tags_user: ['reflection'],
    category: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    emotion_score_score: 0.8,
    embedding: null,
  },
  {
    id: 'extra2',
    user_id: 'mock',
    audio_url: null,
    transcript_raw: 'Tomorrow, I have to email Sarah about the project update.',
    transcript_user: 'Tomorrow, I have to email Sarah about the project update.',
    language_detected: 'en',
    language_rendered: 'en',
    tags_model: [],
    tags_user: ['reflection'],
    category: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    emotion_score_score: -0.3,
    embedding: null,
  },
  {
    id: 'extra3',
    user_id: 'mock',
    audio_url: null,
    transcript_raw: 'Spent quality time with family today and go grocery shopping.',
    transcript_user: 'Spent quality time with family today and go grocery shopping.',
    language_detected: 'en',
    language_rendered: 'en',
    tags_model: [],
    tags_user: ['reflection'],
    category: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    emotion_score_score: 0.9,
    embedding: null,
  },
  {
    id: 'extra4',
    user_id: 'mock',
    audio_url: null,
    transcript_raw: 'I must remind her to finish her book by Monday.',
    transcript_user: 'I must remind her to finish her book by Monday.',
    language_detected: 'en',
    language_rendered: 'en',
    tags_model: [],
    tags_user: ['reflection'],
    category: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    emotion_score_score: 0.7,
    embedding: null,
  },
  {
    id: 'extra5',
    user_id: 'mock',
    audio_url: null,
    transcript_raw: 'I have to watch the onboarding video for the meeting tomorrow.',
    transcript_user: 'I have to watch the onboarding video for the meeting tomorrow.',
    language_detected: 'en',
    language_rendered: 'en',
    tags_model: [],
    tags_user: ['reflection'],
    category: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    emotion_score_score: 0.7,
    embedding: null,
  }
]

// Combine CSV entries with test entries
export const mockVoiceEntries: VoiceEntry[] = [...csvEntries, ...testEntries] 
