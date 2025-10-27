// Dashboard - Funcionalidades do painel principal
let dashboardData = {
    projects: [],
    tasks: [],
    timeEntries: []
};

// Dashboard
function initializeDashboard() {
    updateDashboard();
}

function updateDashboard() {
    updateProjectStats();
    updateTaskStats();
    renderUpcomingDeadlines();
    renderTeamStatus();
    renderProjectProgress();
}

function updateProjectStats() {
    const totalProjetos = document.getElementById('totalProjetos');
    if (totalProjetos && typeof projects !== 'undefined') {
        const activeProjects = projects.filter(p => p.status === 'ativo').length;
        totalProjetos.textContent = activeProjects;
    }
}

function updateTaskStats() {
    if (typeof tasks === 'undefined') return;
    
    const totalTarefas = document.getElementById('totalTarefas');
    const tarefasPendentes = document.getElementById('tarefasPendentes');
    const tarefasConcluidas = document.getElementById('tarefasConcluidas');
    
    if (totalTarefas) totalTarefas.textContent = tasks.length;
    if (tarefasPendentes) {
        const pendentes = tasks.filter(t => t.status !== 'done').length;
        tarefasPendentes.textContent = pendentes;
    }
    if (tarefasConcluidas) {
        const concluidas = tasks.filter(t => t.status === 'done').length;
        tarefasConcluidas.textContent = concluidas;
    }
}

function renderUpcomingDeadlines() {
    const container = document.getElementById('proximosPrazos');
    if (!container || typeof tasks === 'undefined') return;
    
    const upcomingTasks = getTasksDueSoon(7);
    const overdueTasks = getOverdueTasks();
    
    container.innerHTML = '';
    
    if (overdueTasks.length === 0 && upcomingTasks.length === 0) {
        container.innerHTML = '<div style="padding: 20px; text-align: center; color: #666;">Nenhum prazo próximo</div>';
        return;
    }
    
    // Tarefas atrasadas
    overdueTasks.forEach(task => {
        const project = getProjectById(task.projectId);
        const item = document.createElement('div');
        item.className = 'prazo-item';
        item.innerHTML = `
            <div>
                <strong style="color: #dc3545;">${task.title}</strong>
                <br><small>${project ? project.name : 'Sem projeto'}</small>
            </div>
            <div style="text-align: right; color: #dc3545;">
                <strong>Atrasado</strong>
                <br><small>${formatDate(task.dueDate)}</small>
            </div>
        `;
        container.appendChild(item);
    });
    
    // Tarefas com prazo próximo
    upcomingTasks.forEach(task => {
        const project = getProjectById(task.projectId);
        const dueDate = new Date(task.dueDate);
        const today = new Date();
        const diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
        
        const item = document.createElement('div');
        item.className = 'prazo-item';
        item.innerHTML = `
            <div>
                <strong>${task.title}</strong>
                <br><small>${project ? project.name : 'Sem projeto'}</small>
            </div>
            <div style="text-align: right; color: ${diffDays <= 1 ? '#ffc107' : '#666'};">
                <strong>${diffDays === 0 ? 'Hoje' : `${diffDays} dias`}</strong>
                <br><small>${formatDate(task.dueDate)}</small>
            </div>
        `;
        container.appendChild(item);
    });
}

function renderTeamStatus() {
    const container = document.getElementById('equipeStatus');
    if (!container || typeof tasks === 'undefined') return;
    
    // Agrupar tarefas por responsável
    const tasksByAssignee = {};
    tasks.forEach(task => {
        if (!tasksByAssignee[task.assignee]) {
            tasksByAssignee[task.assignee] = {
                total: 0,
                inProgress: 0,
                completed: 0
            };
        }
        tasksByAssignee[task.assignee].total++;
        if (task.status === 'in-progress') tasksByAssignee[task.assignee].inProgress++;
        if (task.status === 'done') tasksByAssignee[task.assignee].completed++;
    });
    
    container.innerHTML = '';
    
    Object.entries(tasksByAssignee).forEach(([assignee, stats]) => {
        const item = document.createElement('div');
        item.className = 'equipe-item';
        item.innerHTML = `
            <div>
                <strong>${assignee}</strong>
                <br><small>${stats.total} tarefas</small>
            </div>
            <div style="text-align: right;">
                <div style="color: #007bff;">${stats.inProgress} em progresso</div>
                <div style="color: #28a745;">${stats.completed} concluídas</div>
            </div>
        `;
        container.appendChild(item);
    });
}

function renderProjectProgress() {
    const container = document.getElementById('progressoProjetos');
    if (!container || typeof projects === 'undefined') return;
    
    container.innerHTML = '';
    
    const activeProjects = projects.filter(p => p.status === 'ativo');
    
    if (activeProjects.length === 0) {
        container.innerHTML = '<div style="padding: 20px; text-align: center; color: #666;">Nenhum projeto ativo</div>';
        return;
    }
    
    activeProjects.forEach(project => {
        const item = document.createElement('div');
        item.className = 'progresso-item';
        item.innerHTML = `
            <div>
                <strong>${project.name}</strong>
                <div style="width: 150px; height: 6px; background: #e9ecef; border-radius: 3px; margin-top: 5px;">
                    <div style="width: ${project.progress}%; height: 100%; background: #667eea; border-radius: 3px;"></div>
                </div>
            </div>
            <div style="text-align: right;">
                <strong>${project.progress}%</strong>
                <br><small>${project.priority}</small>
            </div>
        `;
        container.appendChild(item);
    });
}

// Atualizar dashboard periodicamente
setInterval(() => {
    if (document.querySelector('.tab-content.active')?.id === 'dashboardTab') {
        updateDashboard();
    }
}, 30000); // Atualizar a cada 30 segundos