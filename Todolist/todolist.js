// ===== TO-DO LIST LOGIC =====

// Get elements
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const totalTasksSpan = document.getElementById('totalTasks');
const completedTasksSpan = document.getElementById('completedTasks');
const filterButtons = document.querySelectorAll('.filter-btn');

// Array to store tasks
let tasks = [];

// Current filter
let currentFilter = 'all';

// Add task function
function addTask(text) {
    if (text.trim() === '') return;
    
    const task = {
        id: Date.now(),           // Unique ID using timestamp
        text: text.trim(),
        completed: false,
        createdAt: new Date()
    };
    
    tasks.push(task);
    saveTasks();
    renderTasks();
    taskInput.value = '';
    taskInput.focus();
}

// Toggle complete
function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
    }
}

// Delete task
function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    renderTasks();
}

// Save to localStorage
function saveTasks() {
    localStorage.setItem('myTasks', JSON.stringify(tasks));
}

// Load from localStorage
function loadTasks() {
    const saved = localStorage.getItem('myTasks');
    if (saved) {
        tasks = JSON.parse(saved);
        renderTasks();
    }
}

// Render tasks
function renderTasks() {
    // Filter tasks
    let filteredTasks = tasks;
    if (currentFilter === 'active') {
        filteredTasks = tasks.filter(t => !t.completed);
    } else if (currentFilter === 'completed') {
        filteredTasks = tasks.filter(t => t.completed);
    }

    // Update stats
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    totalTasksSpan.textContent = `${total} task${total !== 1 ? 's' : ''}`;
    completedTasksSpan.textContent = `${completed} completed`;

    // Clear list
    taskList.innerHTML = '';

    // Show empty state
    if (filteredTasks.length === 0) {
        const emptyMsg = tasks.length === 0 
            ? 'No tasks yet. Add one above!' 
            : 'No tasks in this filter.';
        taskList.innerHTML = `<li class="empty-state">${emptyMsg}</li>`;
        return;
    }

    // Render each task
    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        
        li.innerHTML = `
            <div class="checkbox ${task.completed ? 'checked' : ''}" onclick="toggleTask(${task.id})"></div>
            <span class="task-text">${escapeHtml(task.text)}</span>
            <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
        `;
        
        taskList.appendChild(li);
    });
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Filter click handlers
filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        renderTasks();
    });
});

// Event listeners
addBtn.addEventListener('click', () => addTask(taskInput.value));

taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask(taskInput.value);
    }
});

// Load saved tasks on start
loadTasks();
// Send height to parent window
function sendHeight() {
    const height = document.body.scrollHeight;
    window.parent.postMessage({ type: 'resize', height: height }, '*');
}

// Send height on load and when tasks change
window.addEventListener('load', sendHeight);
new MutationObserver(sendHeight).observe(document.body, { childList: true, subtree: true });