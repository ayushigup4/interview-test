### To Test and View Extracted Tasks
`pnpm install`
`pnpm add -D openai`
(Installed dependency to remove warning upon running pnpm lint)
`pnpm test` 

### **Changes made**
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
   On finding a match with a predefined set of time-related words:
   - The time phrase is assigned to the `due_date` field.
   - The phrase is removed from the original `task_text`.


### 3. **CSV Parsing for Mock Voice Entries**

#### `parseCSV(csv: string): Record<string, string>[]`

This segment of the code parses the local CSV file called `Expanded_Diary_Entries.csv`. Here's a flow of how the function works: 
1. Counts the rows 
2. Parses the CSV into Records 
    - Handles escaped double quotes 
    - Handles values wrapped in quotes 
    - Recognizes the commas separating the data entries as opposed to those inside the quote
3. Returns an array of Record objects for VoiceEntry 

### 4. **Extracted Tasks**

Format includes `task_text`, `due_date`, `status`, `category`. Below is an example of a properly extracted task. The original text in `Expanded_Diary_Entries.csv` is "I’m finally sitting down to write my personal statement tomorrow." The task extractor has extracted the following task and assigned it the due date of tomorrow. 

`   {
      task_text: 'write my personal statement',
      due_date: 'tomorrow',
      status: 'pending',
      category: 'general'
    }

### 5. **Future Improvements** 

1. Use AI to detect objects and stop words for phrases
2. Ability to update status depending on the current date 
3. Category detection of the task 