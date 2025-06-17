// // eslint-disable-next-line import/no-extraneous-dependencies
// import { describe, it, expect } from 'vitest'
import { mockVoiceEntries } from '../src/lib/mockData.js'
// import processEntries from '../src/lib/sampleFunction.js'


// eslint-disable-next-line import/no-extraneous-dependencies
import { describe, it, expect } from 'vitest'
import processEntries, {
  extractTasks,
  extractDueDateFromTaskList,
} from '../src/lib/sampleFunction.js'
import { VoiceEntry } from '../src/lib/types.js'

describe('processEntries', () => {
  it('counts reflection tag correctly', () => {
    const result = processEntries(mockVoiceEntries)
    // console.log(mockVoiceEntries[0])
    console.log(result)
    expect(result.tagFrequencies.reflection).toBe(mockVoiceEntries.length)
  })
}) 
describe('processEntries', () => {
  it('counts reflection tag correctly', () => {
    const mock: VoiceEntry[] = [
      {
        id: '1',
        user_id: 'test',
        audio_url: null,
        transcript_raw: 'raw',
        transcript_user: 'I feel like I should call mom.',
        language_detected: 'en',
        language_rendered: 'en',
        tags_model: [],
        tags_user: ['reflection'],
        category: null,
        created_at: '',
        updated_at: '',
        emotion_score_score: null,
        embedding: null
      }
    ]
    const result = processEntries(mock)
    expect(result.tagFrequencies.reflection).toBe(1)
    expect(result.tasks.length).toBe(1)
    expect(result.tasks[0].task_text).toBe('call mom')
  })

  it('handles entries with no tags', () => {
    const mock: VoiceEntry[] = [
      {
        id: '2',
        user_id: 'test',
        audio_url: null,
        transcript_raw: 'raw',
        transcript_user: 'I need to submit the form by tomorrow.',
        language_detected: 'en',
        language_rendered: 'en',
        tags_model: [],
        tags_user: [],
        category: null,
        created_at: '',
        updated_at: '',
        emotion_score_score: null,
        embedding: null
      }
    ]
    const result = processEntries(mock)
    expect(result.tagFrequencies).toEqual({})
    expect(result.tasks.length).toBe(1)
    expect(result.tasks[0].due_date).toBe('tomorrow')
  })


  it('ignores entries with no actionable verbs', () => {
    const mock: VoiceEntry[] = [
      {
        id: '4',
        user_id: 'test',
        audio_url: null,
        transcript_raw: 'raw',
        transcript_user: 'I was thinking about the beach.',
        language_detected: 'en',
        language_rendered: 'en',
        tags_model: [],
        tags_user: ['reflection'],
        category: null,
        created_at: '',
        updated_at: '',
        emotion_score_score: null,
        embedding: null
      }
    ]
    const result = processEntries(mock)
    expect(result.tasks.length).toBe(0)
  })
})

describe('extractTasks', () => {
  it('extracts verb and object from a sentence', () => {
    const mock: VoiceEntry[] = [
      {
        id: '5',
        user_id: 'test',
        audio_url: null,
        transcript_raw: 'raw',
        transcript_user: 'I need to submit the assignment.',
        language_detected: 'en',
        language_rendered: 'en',
        tags_model: [],
        tags_user: [],
        category: null,
        created_at: '',
        updated_at: '',
        emotion_score_score: null,
        embedding: null
      }
    ]
    const tasks = extractTasks(mock)
    expect(tasks[0].task_text).toBe('submit the assignment')
  })
})

