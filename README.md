# Task Manager CRUD Application - Documentation

## Project Overview

The Task Manager is a responsive web application that implements CRUD (Create, Read, Update, Delete) operations for task management. It allows users to organize and track their tasks with the following features:

- Create new tasks with title, description, due date, priority level, and status
- View all tasks in a searchable, filterable table
- Update existing task information
- Delete tasks with confirmation
- Visual indicators for task priority and status
- Overdue task highlighting

## Project Structure

```
task-manager/
│
├── index.html          # Main HTML structure
├── styles.css          # CSS styling
├── app.js              # JavaScript functionality
└── README.md           # Project documentation
```

## Key Components

### 1. HTML Structure (index.html)

The HTML file establishes the structure of the application with the following key sections:

- **Header**: Contains the application title and description
- **Form Section**: For creating and updating tasks
- **List Section**: Displays the tasks table with search and filter functionality
- **Confirmation Modal**: Appears when deleting tasks to prevent accidental deletion
- **Footer**: Contains application information

### 2. CSS Styling (styles.css)

The CSS file provides responsive styling with:

- CSS variables for consistent color themes and easy customization
- Responsive grid layout for adapting to different screen sizes
- Styling for form elements, buttons, tables, and modal
- Visual indicators for task priority (Low, Medium, High) and status (Pending, In Progress, Completed)
- Highlighting for overdue tasks
- Transitions and hover effects for better user experience

### 3. JavaScript Functionality (app.js)

The JavaScript file handles all the application logic:

#### Core Functions:

- **Data Management**:
  - `loadTasks()`: Retrieves tasks from local storage
  - `saveTasks()`: Stores tasks in local storage
  - `createTask()`: Adds a new task to the data store
  - `updateTask()`: Modifies an existing task
  - `deleteTask()`: Removes a task from the data store

- **UI Operations**:
  - `renderTasks()`: Displays the filtered tasks list
  - `editTask()`: Populates the form with task data for editing
  - `resetForm()`: Clears the form and resets to "Add" mode
  - `showDeleteConfirmation()`: Displays the confirmation modal
  - `showStatusMessage()`: Shows success/error notifications

- **Task-Specific Features**:
  - `formatDate()`: Formats date values for display
  - `getStatusBadge()`: Creates visual indicators for task status
  - `getPriorityBadge()`: Creates visual indicators for task priority
  - `isTaskOverdue()`: Determines if a task is past its due date

## Implementation Details

### Local Storage

The application uses the browser's localStorage to persist task data, allowing it to retain information between sessions without requiring a backend server.

```javascript
// Save tasks to local storage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Load tasks from local storage
function loadTasks() {
    const storedTasks = localStorage.getItem('tasks');
    tasks = storedTasks ? JSON.parse(storedTasks) : [];
}
```
