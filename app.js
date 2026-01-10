document.addEventListener('DOMContentLoaded', () => {
    const taskTitleInput = document.getElementById('task-title');
    const taskPrioritySelect = document.getElementById('task-priority');
    const taskEstimationSelect = document.getElementById('task-estimation');
    const addTaskBtn = document.getElementById('add-task-btn');
    const backlogList = document.getElementById('backlog-list');
    const doneList = document.getElementById('done-list');
    const backlogCount = document.getElementById('backlog-count');
    const doneCount = document.getElementById('done-count');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    const saveTasks = () => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
    };

    const renderTasks = () => {
        backlogList.innerHTML = '';
        doneList.innerHTML = '';

        let bCount = 0;
        let dCount = 0;

        tasks.forEach(task => {
            const taskElement = createTaskElement(task);
            if (task.status === 'backlog') {
                backlogList.appendChild(taskElement);
                bCount++;
            } else {
                doneList.appendChild(taskElement);
                dCount++;
            }
        });

        backlogCount.textContent = bCount;
        doneCount.textContent = dCount;
    };

    const createTaskElement = (task) => {
        const div = document.createElement('div');
        div.className = `task-item ${task.status}`;
        div.innerHTML = `
            <div class="task-header">
                <span class="task-title">${task.title}</span>
                <div class="task-meta">
                    <span class="tag tag-priority ${task.priority}">${task.priority}</span>
                    <span class="tag tag-estimation">${task.estimation} pt</span>
                </div>
            </div>
            <div class="task-actions">
                ${task.status === 'backlog' ?
                `<button class="action-btn complete-btn" onclick="toggleStatus('${task.id}')">완료</button>` :
                `<button class="action-btn complete-btn" onclick="toggleStatus('${task.id}')">복구</button>`
            }
                <button class="action-btn delete-btn" onclick="deleteTask('${task.id}')">삭제</button>
            </div>
        `;
        return div;
    };

    addTaskBtn.addEventListener('click', () => {
        const title = taskTitleInput.value.trim();
        const priority = taskPrioritySelect.value;
        const estimation = taskEstimationSelect.value;

        if (!title || !priority || !estimation) {
            alert('제목, 우선순위, 공수 산정을 모두 입력해주세요!');
            return;
        }

        const newTask = {
            id: Date.now().toString(),
            title,
            priority,
            estimation,
            status: 'backlog',
            createdAt: new Date().toISOString()
        };

        tasks.unshift(newTask);
        saveTasks();

        // Reset inputs
        taskTitleInput.value = '';
        taskPrioritySelect.selectedIndex = 0;
        taskEstimationSelect.selectedIndex = 0;
    });

    window.toggleStatus = (id) => {
        tasks = tasks.map(task => {
            if (task.id === id) {
                return { ...task, status: task.status === 'backlog' ? 'done' : 'backlog' };
            }
            return task;
        });
        saveTasks();
    };

    window.deleteTask = (id) => {
        if (confirm('정말 이 작업을 삭제하시겠습니까?')) {
            tasks = tasks.filter(task => task.id !== id);
            saveTasks();
        }
    };

    renderTasks();
});
