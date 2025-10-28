// Gerenciamento de Tarefas
let tasks = [];

function initializeTasks() {
    loadTasks();
    renderTasks();
    populateTaskSelects();
}

function loadTasks() {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
    } else {
        // Dados de exemplo
        tasks = [
            {
                id: 'task-1',
                title: 'Criar wireframes',
                description: 'Desenvolver wireframes para as principais páginas',
                projectId: 'proj-1',
                assignee: 'admin@example.com',
                status: 'done',
                priority: 'alta',
                startDate: '2024-01-15',
                dueDate: '2024-01-25',
                estimatedHours: 16,
                actualHours: 18,
                progress: 100,
                createdAt: new Date().toISOString()
            },
            {
                id: 'task-2',
                title: 'Desenvolver layout responsivo',
                description: 'Implementar design responsivo para mobile e tablet',
                projectId: 'proj-1',
                assignee: 'user@example.com',
                status: 'in-progress',
                priority: 'alta',
                startDate: '2024-01-26',
                dueDate: '2024-02-15',
                estimatedHours: 32,
                actualHours: 20,
                progress: 65,
                createdAt: new Date().toISOString()
            },
            {
                id: 'task-3',
                title: 'Análise de requisitos',
                description: 'Levantar requisitos funcionais do sistema CRM',
                projectId: 'proj-2',
                assignee: 'admin@example.com',
                status: 'review',
                priority: 'critica',
                startDate: '2024-02-01',
                dueDate: '2024-02-10',
                estimatedHours: 24,
                actualHours: 22,
                progress: 90,
                createdAt: new Date().toISOString()
            },
            {
                id: 'task-4',
                title: 'Setup do ambiente',
                description: 'Configurar ambiente de desenvolvimento',
                projectId: 'proj-2',
                assignee: 'user@example.com',
                status: 'todo',
                priority: 'media',
                startDate: '2024-02-11',
                dueDate: '2024-02-15',
                estimatedHours: 8,
                actualHours: 0,
                progress: 0,
                createdAt: new Date().toISOString()
            }
        ];
        saveTasks();
    }
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    
    // Atualizar progresso dos projetos
    if (typeof updateProjectProgress === 'function') {
        const projectIds = [...new Set(tasks.map(t => t.projectId))];
        projectIds.forEach(projectId => updateProjectProgress(projectId));
    }
}

function renderTasks() {
    const tableBody = document.getElementById('tasksTableBody');
    if (!tableBody) return;

    tableBody.innerHTML = '';

    const filteredTasks = getFilteredTasks();

    filteredTasks.forEach(task => {
        const project = getProjectById(task.projectId);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <strong>${task.title}</strong>
                <br><small class="text-muted">${task.description}</small>
            </td>
            <td>${project ? project.name : 'Projeto não encontrado'}</td>
            <td>${task.assignee}</td>
            <td><span class="task-status status-${task.status}">${getStatusLabel(task.status)}</span></td>
            <td><span class="project-priority priority-${task.priority}">${task.priority}</span></td>
            <td>${formatDate(task.dueDate)}</td>
            <td>
                <div class="progress-indicator">
                    <div class="fill" style="width: ${task.progress}%"></div>
                </div>
                <small>${task.progress}%</small>
            </td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="editTask('${task.id}')">✏️</button>
                <button class="btn btn-sm btn-success" onclick="startTimer('${task.id}')">⏱️</button>
                <button class="btn btn-sm btn-danger" onclick="deleteTask('${task.id}')">🗑️</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function getFilteredTasks() {
    let filteredTasks = [...tasks];
    
    const projectFilter = document.getElementById('filterProject')?.value;
    const assigneeFilter = document.getElementById('filterAssignee')?.value;
    const statusFilter = document.getElementById('filterStatus')?.value;
    
    if (projectFilter) {
        filteredTasks = filteredTasks.filter(task => task.projectId === projectFilter);
    }
    
    if (assigneeFilter) {
        filteredTasks = filteredTasks.filter(task => task.assignee === assigneeFilter);
    }
    
    if (statusFilter) {
        filteredTasks = filteredTasks.filter(task => task.status === statusFilter);
    }
    
    return filteredTasks;
}

function filterTasks() {
    renderTasks();
    if (typeof renderKanban === 'function') {
        renderKanban();
    }
}

function openTaskModal(taskId = null) {
    const modal = document.getElementById('taskModal');
    const form = document.getElementById('taskForm');
    const title = document.getElementById('taskModalTitle');
    
    if (taskId) {
        const task = tasks.find(t => t.id === taskId);
        if (task) {
            title.textContent = 'Editar Tarefa';
            document.getElementById('taskId').value = task.id;
            document.getElementById('taskTitle').value = task.title;
            document.getElementById('taskDescription').value = task.description;
            document.getElementById('taskProject').value = task.projectId;
            document.getElementById('taskAssignee').value = task.assignee;
            document.getElementById('taskStatus').value = task.status;
            document.getElementById('taskPriority').value = task.priority;
            document.getElementById('taskStartDate').value = task.startDate;
            document.getElementById('taskDueDate').value = task.dueDate;
            document.getElementById('taskEstimatedHours').value = task.estimatedHours;
        }
    } else {
        title.textContent = 'Nova Tarefa';
        form.reset();
        document.getElementById('taskId').value = '';
    }
    
    populateTaskSelects();
    modal.style.display = 'block';
}

function closeTaskModal() {
    document.getElementById('taskModal').style.display = 'none';
}

function saveTaskForm(event) {
    return saveTask(event);
}

function editTask(taskId) {
    openTaskModal(taskId);
}

function deleteTask(taskId) {
    if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
        tasks = tasks.filter(t => t.id !== taskId);
        saveTasks();
        renderTasks();
        
        if (typeof renderKanban === 'function') {
            renderKanban();
        }
        if (typeof updateDashboard === 'function') {
            updateDashboard();
        }
    }
}

function startTimer(taskId) {
    if (typeof startTaskTimer === 'function') {
        startTaskTimer(taskId);
        switchTab('tempo');
    }
}

function populateTaskSelects() {
    // Popular select de projetos
    const projectSelect = document.getElementById('taskProject');
    if (projectSelect && typeof projects !== 'undefined') {
        const currentValue = projectSelect.value;
        projectSelect.innerHTML = '<option value="">Selecione um projeto</option>';
        
        projects.forEach(project => {
            const option = document.createElement('option');
            option.value = project.id;
            option.textContent = project.name;
            projectSelect.appendChild(option);
        });
        
        projectSelect.value = currentValue;
    }
    
    // Popular select de responsáveis
    const assigneeSelects = ['taskAssignee', 'filterAssignee'];
    assigneeSelects.forEach(selectId => {
        const select = document.getElementById(selectId);
        if (select) {
            const currentValue = select.value;
            select.innerHTML = selectId.includes('filter') ? 
                '<option value="">Todos os Responsáveis</option>' : 
                '<option value="">Selecione um responsável</option>';
            
            // Adicionar usuários (implementar quando sistema de usuários estiver disponível)
            select.innerHTML += '<option value="admin@example.com">Admin</option>';
            select.innerHTML += '<option value="user@example.com">Usuário</option>';
            
            select.value = currentValue;
        }
    });
}

function getStatusLabel(status) {
    const labels = {
        'todo': 'A Fazer',
        'in-progress': 'Em Progresso',
        'review': 'Em Revisão',
        'done': 'Concluído'
    };
    return labels[status] || status;
}

function getTaskById(taskId) {
    return tasks.find(t => t.id === taskId);
}

function updateTaskStatus(taskId, newStatus) {
    const task = getTaskById(taskId);
    if (task) {
        task.status = newStatus;
        task.progress = newStatus === 'done' ? 100 : (newStatus === 'in-progress' ? 50 : 0);
        saveTasks();
        renderTasks();
        
        if (typeof renderKanban === 'function') {
            renderKanban();
        }
    }
}

function getTasksByProject(projectId) {
    return tasks.filter(t => t.projectId === projectId);
}

function getTasksByStatus(status) {
    return tasks.filter(t => t.status === status);
}

function getOverdueTasks() {
    const today = new Date().toISOString().split('T')[0];
    return tasks.filter(t => t.dueDate && t.dueDate < today && t.status !== 'done');
}

function getTasksDueSoon(days = 7) {
    const today = new Date();
    const futureDate = new Date(today.getTime() + (days * 24 * 60 * 60 * 1000));
    const todayStr = today.toISOString().split('T')[0];
    const futureDateStr = futureDate.toISOString().split('T')[0];
    
    return tasks.filter(t => 
        t.dueDate && 
        t.dueDate >= todayStr && 
        t.dueDate <= futureDateStr && 
        t.status !== 'done'
    );
}
