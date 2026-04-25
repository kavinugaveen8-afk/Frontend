const API_URL = 'http://localhost:3000/api/todos';

const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const pendingCount = document.getElementById('pendingCount');
const completedCount = document.getElementById('completedCount');

// Fetch and render todos
async function fetchTodos() {
  try {
    const res = await fetch(API_URL);
    const todos = await res.json();
    renderTodos(todos);
  } catch (err) {
    console.error('Error fetching todos:', err);
  }
}

// Render todos to DOM
function renderTodos(todos) {
  todoList.innerHTML = '';
  
  let pending = 0;
  let completed = 0;
  
  todos.forEach(todo => {
    if (todo.completed) completed++;
    else pending++;
    
    const li = document.createElement('li');
    li.className = todo.completed ? 'completed' : '';
    
    li.innerHTML = `
      <input type="checkbox" class="checkbox" ${todo.completed ? 'checked' : ''}>
      <span class="todo-text">${todo.title}</span>
      <button class="delete-btn" data-id="${todo.id}">Delete</button>
    `;
    
    todoList.appendChild(li);
  });
  
  pendingCount.textContent = pending;
  completedCount.textContent = completed;
}

// Add new todo
async function addTodo() {
  const title = todoInput.value.trim();
  if (!title) return;
  
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title })
    });
    
    if (res.ok) {
      todoInput.value = '';
      fetchTodos();
    }
  } catch (err) {
    console.error('Error adding todo:', err);
  }
}

// Toggle todo completion
async function toggleTodo(id) {
  try {
    await fetch(`${API_URL}/${id}`, { method: 'PATCH' });
    fetchTodos();
  } catch (err) {
    console.error('Error toggling todo:', err);
  }
}

// Delete todo
async function deleteTodo(id) {
  try {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    fetchTodos();
  } catch (err) {
    console.error('Error deleting todo:', err);
  }
}

// Event listeners
addBtn.addEventListener('click', addTodo);

todoInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') addTodo();
});

todoList.addEventListener('click', (e) => {
  if (e.target.classList.contains('checkbox')) {
    const li = e.target.closest('li');
    const id = parseInt(li.querySelector('.delete-btn').dataset.id);
    toggleTodo(id);
  }
  
  if (e.target.classList.contains('delete-btn')) {
    const id = parseInt(e.target.dataset.id);
    deleteTodo(id);
  }
});

// Initial load
fetchTodos();