import { VoiceEntry, ProcessedResult, Task } from './types'

/**
 * processEntries
 * --------------
 * PURE function — no IO, no mutation, deterministic.
 */

// Frequent action verbs used for task extraction
const actionVerbs = ['do', 'make', 'schedule', 'submit', 
'meet', 'call', 'write', 'read', 'watch', 'listen', 'see', 
'come', 'take', 'send', 'bring', 'do', 'make', 'schedule', 
'submit', 'meet', 'call', 'write', 
'read', 'watch', 'listen', 'see', 'come', 'take', 
'send', 'bring', 'buy', 'email', 'respond', 'reply',
'answer', 'complete', 'finish', 'start', 'begin']

//Frequent time phrases used for due date extraction
const timeWords = ['tomorrow', 'today', 'next week', 'next month', 
  'next year', 'this week', 'this month', 'this year', 'Monday', 'Tuesday', 
  'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'the weekend', 'this weekend']

//Extract tasks from voice entries 
export function extractTasks(entries: VoiceEntry[]): Task[] {
  const taskList: Task[] = []
  
  for (const entry of entries) {
    const sentences = entry.transcript_user.split(/[.!?]/) //split sentences by punctuation

    for (const sentence of sentences) {
      const words = sentence.split(/\s+/) //split sentence into words
      const verbIndex = words.findIndex(word => actionVerbs.includes(word)) //get position of first verb in sentence

      if (verbIndex !== -1) {
        const task = words.slice(verbIndex).join(' ').replace(/[^a-z0-9\s]/gi, '').trim() //get text after verb
        if (task.length > 0) {
          taskList.push({
            task_text: task,
            due_date: null,
            status: 'pending',
            category: 'general'
          })
        }
      }
    }
  }
  return taskList
}

//Extract due date from each task in task list
export function extractDueDateFromTaskList(taskList: Task[]): Task[] {
  return taskList.map(task => {
    let taskText = task.task_text.toLowerCase()
    let dueDate: string | null = null

    for (const timePhrase of timeWords) {
      const regex = new RegExp(`\\b${timePhrase}\\b`, 'i')
      if (regex.test(taskText)) {
        dueDate = timePhrase
        taskText = taskText.replace(regex, '').trim()
        break
      }
    }

    return {
      ...task,
      task_text: taskText,
      due_date: dueDate
    }
  })
}

export function processEntries(entries: VoiceEntry[]): ProcessedResult {
  const tagFrequencies: Record<string, number> = {}
  for (const e of entries) {
    for (const tag of e.tags_user) {
      tagFrequencies[tag] = (tagFrequencies[tag] || 0) + 1
    }
  }
  
  const tasks = extractDueDateFromTaskList(extractTasks(entries))

  return {
    summary: `Analysed ${entries.length} entries`,
    tagFrequencies,
    tasks
  }
}

export default processEntries 