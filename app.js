
const taskForm = document.getElementById('task-form');
const tasksList = document.getElementById('tasks-list');
const formTitle = document.getElementById('form-title');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');
const searchInput = document.getElementById('search');
const filterStatus = document.getElementById('filter-status');
const filterPriority = document.getElementById('filter-priority');
const noTasksDiv = document.getElementById('no-tasks');
const confirmationModal = document.getElementById('confirmation-modal');
const confirmDeleteBtn = document.getElementById('confirm-delete');
const cancelDeleteBtn = document.getElementById('cancel-delete');


const taskIdInput = document.getElementById('task-id');
const titleInput = document.getElementById('title');
const descriptionInput = document.getElementById('description');
const dueDateInput = document.getElementById('due-date');
const priorityInput = document.getElementById('priority');
const statusInput = document.getElementById('status');


let tasks = [];
let taskToDelete = null;


function init() {
    loadTasks();
    renderTasks();
    setupEventListeners();
    setMinDueDate();
}


function setMinDueDate() {
    const today = new Date().toISOString().split('T')[0];
    dueDateInput.min = today;
}


function loadTasks() {
    const storedTasks = localStorage.getItem('tasks');
    tasks = storedTasks ? JSON.parse(storedTasks) : [];
}


function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}


function setupEventListeners() {
   
    taskForm.addEventListener('submit', handleFormSubmit);
    
   
    cancelBtn.addEventListener('click', resetForm);
    
    
    searchInput.addEventListener('input', renderTasks);
    filterStatus.addEventListener('change', renderTasks);
    filterPriority.addEventListener('change', renderTasks);
    
   
    confirmDeleteBtn.addEventListener('click', confirmDelete);
    cancelDeleteBtn.addEventListener('click', closeModal);
}


function handleFormSubmit(e) {
    e.preventDefault();
    
    
    if (!validateForm()) {
        return;
    }
    
    const taskData = {
        title: titleInput.value.trim(),
        description: descriptionInput.value.trim(),
        dueDate: dueDateInput.value,
        priority: priorityInput.value,
        status: statusInput.value
    };
    
    
    const id = taskIdInput.value;
    if (id) {
       
        updateTask(id, taskData);
        showStatusMessage('Task updated successfully!', 'success');
    } else {
      
        createTask(taskData);
        showStatusMessage('Task added successfully!', 'success');
    }
    
 
    resetForm();
    renderTasks();
}


function validateForm() {
    
    if (!titleInput.value.trim()) {
        showStatusMessage('Title is required', 'error');
        titleInput.focus();
        return false;
    }
    
    
    if (!descriptionInput.value.trim()) {
        showStatusMessage('Description is required', 'error');
        descriptionInput.focus();
        return false;
    }
    
  
    if (!dueDateInput.value) {
        showStatusMessage('Due date is required', 'error');
        dueDateInput.focus();
        return false;
    }
    
    
    if (!priorityInput.value) {
        showStatusMessage('Please select a priority level', 'error');
        priorityInput.focus();
        return false;
    }
    
   
    if (!statusInput.value) {
        showStatusMessage('Please select a status', 'error');
        statusInput.focus();
        return false;
    }
    
    return true;
}


function createTask(taskData) {
    const newTask = {
        id: generateId(),
        ...taskData,
        createdAt: new Date().toISOString()
    };
    
    tasks.unshift(newTask); 
    saveTasks();
}


function updateTask(id, taskData) {
    const index = tasks.findIndex(task => task.id === id);
    
    if (index !== -1) {
        tasks[index] = {
            ...tasks[index],
            ...taskData,
            updatedAt: new Date().toISOString()
        };
        
        saveTasks();
    }
}


function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
    
    showStatusMessage('Task deleted successfully!', 'success');
}


function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
}


function showDeleteConfirmation(id) {
    taskToDelete = id;
    confirmationModal.classList.remove('hidden');
}


function closeModal() {
    confirmationModal.classList.add('hidden');
    taskToDelete = null;
}


function confirmDelete() {
    if (taskToDelete) {
        deleteTask(taskToDelete);
        closeModal();
    }
}


function editTask(id) {
    const task = tasks.find(task => task.id === id);
    
    if (task) {
     
        taskIdInput.value = task.id;
        titleInput.value = task.title;
        descriptionInput.value = task.description;
        dueDateInput.value = task.dueDate;
        priorityInput.value = task.priority;
        statusInput.value = task.status;
        
     
        formTitle.textContent = 'Edit Task';
        submitBtn.textContent = 'Update Task';
        cancelBtn.classList.remove('hidden');
        
     
        taskForm.scrollIntoView({ behavior: 'smooth' });
    }
}


function resetForm() {
    taskForm.reset();
    taskIdInput.value = '';
    formTitle.textContent = 'Add New Task';
    submitBtn.textContent = 'Add Task';
    cancelBtn.classList.add('hidden');
    setMinDueDate();
}


function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}


function getStatusBadge(status) {
    const statusClasses = {
        'Pending': 'status-pending',
        'In Progress': 'status-progress',
        'Completed': 'status-completed'
    };
    
    return `<span class="status-badge ${statusClasses[status]}">${status}</span>`;
}


function getPriorityBadge(priority) {
    const priorityClasses = {
        'Low': 'priority-low',
        'Medium': 'priority-medium',
        'High': 'priority-high'
    };
    
    return `<span class="priority-badge ${priorityClasses[priority]}">${priority}</span>`;
}


function isTaskOverdue(dueDate, status) {
    return status !== 'Completed' && new Date(dueDate) < new Date().setHours(0, 0, 0, 0);
}


function renderTasks() {
 
    const searchTerm = searchInput.value.toLowerCase();
    const statusFilter = filterStatus.value;
    const priorityFilter = filterPriority.value;
    
    const filteredTasks = tasks.filter(task => {
        const matchesSearch = 
            task.title.toLowerCase().includes(searchTerm) || 
            task.description.toLowerCase().includes(searchTerm);
            
        const matchesStatus = statusFilter === '' || task.status === statusFilter;
        const matchesPriority = priorityFilter === '' || task.priority === priorityFilter;
        
        return matchesSearch && matchesStatus && matchesPriority;
    });
    
   
    if (filteredTasks.length === 0) {
        noTasksDiv.classList.remove('hidden');
        tasksList.innerHTML = '';
    } else {
        noTasksDiv.classList.add('hidden');
        
       
        tasksList.innerHTML = filteredTasks.map(task => {
            const isOverdue = isTaskOverdue(task.dueDate, task.status);
            const rowClass = isOverdue ? 'overdue-task' : '';
            
            return `
                <tr class="${rowClass}">
                    <td>
                        <h4 class="task-title">${task.title}</h4>
                        <p class="task-description">${task.description}</p>
                    </td>
                    <td>${formatDate(task.dueDate)}</td>
                    <td>${getPriorityBadge(task.priority)}</td>
                    <td>${getStatusBadge(task.status)}</td>
                    <td>
                        <div class="action-buttons">
                            <button class="edit-btn" onclick="editTask('${task.id}')">
                                <i class="fas fa-edit"></i> Edit
                            </button>
                            <button class="delete-btn" onclick="showDeleteConfirmation('${task.id}')">
                                <i class="fas fa-trash-alt"></i> Delete
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }
}


function showStatusMessage(message, type) {
    
    const existingMessage = document.querySelector('.status-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
   
    const statusDiv = document.createElement('div');
    statusDiv.className = `status-message ${type}`;
    statusDiv.textContent = message;
    
 
    taskForm.parentNode.insertBefore(statusDiv, taskForm.nextSibling);
    
    
    setTimeout(() => {
        statusDiv.remove();
    }, 5000);
}


document.addEventListener('DOMContentLoaded', init);