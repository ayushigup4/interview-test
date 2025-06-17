### 1. **New Type Definition**

- Defined a new `Task` type in `types.ts`:
  ```ts
  export type Task = {
    task_text: string
    due_date: string | null
    status: string
    category: string
  }

### 2. **Implemented Task Extraction and Due Date Parsing**

Created two new functions `extractTasks()` and `extractDueDateFromTaskList()` in `sampleFunction.ts`. 

#### `extractTasks(entries: VoiceEntry[]) => Task[]`

This function scans through the `transcript_user` field of each voice entry to extract action-oriented sentences based on a predefined list of **common action verbs**.

**How it works:**

1. **Sentence Splitting**  
   Each transcript is divided into individual sentences using punctuation marks (`.`, `!`, `?`).

2. **Verb Detection**  
   Within each sentence, the function looks for the first occurrence of any action verb (e.g., `call`, `submit`, `buy`, etc.).

3. **Phrase Construction**  
   If a valid verb is found, the rest of the sentence from that verb onward is extracted, cleaned of punctuation, and trimmed.

4. **Task Object Creation**  
   Each phrase is turned into a `Task` object with the following structure:
   ```ts
   {
     task_text: string,     // The extracted intent phrase
     due_date: null,        // To be populated later
     status: "pending",     // Default value
     category: "general"    // Default category
   }

#### `extractDueDateFromTaskList(taskList: Task[]) => Task[]`
1. **Predifined list of due date related words**

2. **Due Date Assignment**  
   On finding a match:
   - The time phrase is assigned to the `due_date` field.
   - The phrase is removed from the original `task_text` for clarity.
