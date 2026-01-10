document.addEventListener('DOMContentLoaded', () => {
    const todoInput = document.getElementById('todo-input');
    const addBtn = document.getElementById('add-btn');
    const todoList = document.getElementById('todo-list');
    const pendingCount = document.getElementById('pending-count');
    const clearAllBtn = document.getElementById('clear-all');
    const dateDisplay = document.getElementById('date-display');

    // Set Current Date
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateDisplay.innerText = new Date().toLocaleDateString('ko-KR', options);

    let todos = JSON.parse(localStorage.getItem('todos')) || [];

    const saveTodos = () => {
        localStorage.setItem('todos', JSON.stringify(todos));
        renderTodos();
    };

    const renderTodos = () => {
        todoList.innerHTML = '';
        const pending = todos.filter(t => !t.completed).length;
        pendingCount.innerText = `${pending} tasks left`;

        todos.forEach((todo, index) => {
            const li = document.createElement('li');
            li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
            li.innerHTML = `
                <div class="todo-content" onclick="toggleTodo(${index})">
                    <div class="todo-checkbox">
                        ${todo.completed ? '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>' : ''}
                    </div>
                    <span class="todo-text">${todo.text}</span>
                </div>
                <button class="delete-btn" onclick="deleteTodo(event, ${index})">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                </button>
            `;
            todoList.appendChild(li);
        });
    };

    window.toggleTodo = (index) => {
        todos[index].completed = !todos[index].completed;
        saveTodos();
    };

    window.deleteTodo = (e, index) => {
        e.stopPropagation();
        todos.splice(index, 1);
        saveTodos();
    };

    const addTodo = () => {
        const text = todoInput.value.trim();
        if (text) {
            todos.push({ text, completed: false });
            todoInput.value = '';
            saveTodos();
        }
    };

    addBtn.addEventListener('click', addTodo);
    todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTodo();
    });

    clearAllBtn.addEventListener('click', () => {
        if (todos.length > 0 && confirm('모든 할 일을 삭제하시겠습니까?')) {
            todos = [];
            saveTodos();
        }
    });

    renderTodos();
});
