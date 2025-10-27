// Gerenciamento de Projetos
let projects = [];

function initializeProjects() {
    loadProjects();
    renderProjects();
    populateProjectSelects();
}

function loadProjects() {
    // Carregar projetos do localStorage ou Firebase
    const savedProjects = localStorage.getItem('projects');
    if (savedProjects) {
        projects = JSON.parse(savedProjects);
    } else {
        // Dados de exemplo
        projects = [
            {
                id: 'proj-1',
                name: 'Website Redesign',
                description: 'Redesign completo do website corporativo',
                startDate: '2024-01-15',
                endDate: '2024-03-15',
                manager: 'admin@example.com',
                priority: 'alta',
                status: 'ativo',
                team: ['admin@example.com', 'user@example.com'],
                progress: 65,
                createdAt: new Date().toISOString()
            },
            {
                id: 'proj-2',
                name: 'Sistema de CRM',
                description: 'Desenvolvimento de sistema de gestão de clientes',
                startDate: '2024-02-01',
                endDate: '2024-05-01',
                manager: 'admin@example.com',
                priority: 'critica',
                status: 'ativo',
                team: ['admin@example.com'],
                progress: 30,
                createdAt: new Date().toISOString()
            }
        ];
        saveProjects();
    }
}

function saveProjects() {
    localStorage.setItem('projects', JSON.stringify(projects));
}

function renderProjects() {
    const projectsGrid = document.getElementById('projectsGrid');
    if (!projectsGrid) return;

    projectsGrid.innerHTML = '';

    projects.forEach(project => {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card';
        projectCard.innerHTML = `
            <div class="project-header">
                <h3 class="project-title">${project.name}</h3>
                <span class="project-priority priority-${project.priority}">${project.priority}</span>
            </div>
            <p class="project-description">${project.description}</p>
            <div class="project-progress">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${project.progress}%"></div>
                </div>
                <small>${project.progress}% concluído</small>
            </div>
            <div class="project-meta">
                <span>📅 ${formatDate(project.startDate)} - ${formatDate(project.endDate)}</span>
                <span>👤 ${project.manager}</span>
            </div>
            <div class="project-actions">
                <button class="btn btn-sm btn-primary" onclick="editProject('${project.id}')">✏️ Editar</button>
                <button class="btn btn-sm btn-success" onclick="viewProjectTasks('${project.id}')">📋 Tarefas</button>
                <button class="btn btn-sm btn-danger" onclick="deleteProject('${project.id}')">🗑️ Excluir</button>
            </div>
        `;
        projectsGrid.appendChild(projectCard);
    });
}

function openProjectModal(projectId = null) {
    const modal = document.getElementById('projectModal');
    const form = document.getElementById('projectForm');
    const title = document.getElementById('projectModalTitle');
    
    if (projectId) {
        const project = projects.find(p => p.id === projectId);
        if (project) {
            title.textContent = 'Editar Projeto';
            document.getElementById('projectId').value = project.id;
            document.getElementById('projectName').value = project.name;
            document.getElementById('projectDescription').value = project.description;
            document.getElementById('projectStartDate').value = project.startDate;
            document.getElementById('projectEndDate').value = project.endDate;
            document.getElementById('projectManager').value = project.manager;
            document.getElementById('projectPriority').value = project.priority;
        }
    } else {
        title.textContent = 'Novo Projeto';
        form.reset();
        document.getElementById('projectId').value = '';
    }
    
    populateUserSelects();
    modal.style.display = 'block';
}

function closeProjectModal() {
    document.getElementById('projectModal').style.display = 'none';
}

function saveProject(event) {
    event.preventDefault();
    
    const projectId = document.getElementById('projectId').value;
    const projectData = {
        name: document.getElementById('projectName').value,
        description: document.getElementById('projectDescription').value,
        startDate: document.getElementById('projectStartDate').value,
        endDate: document.getElementById('projectEndDate').value,
        manager: document.getElementById('projectManager').value,
        priority: document.getElementById('projectPriority').value,
        team: Array.from(document.getElementById('projectTeam').selectedOptions).map(option => option.value),
        status: 'ativo',
        progress: 0
    };
    
    if (projectId) {
        // Editar projeto existente
        const projectIndex = projects.findIndex(p => p.id === projectId);
        if (projectIndex !== -1) {
            projects[projectIndex] = { ...projects[projectIndex], ...projectData };
        }
    } else {
        // Criar novo projeto
        const newProject = {
            id: 'proj-' + Date.now(),
            ...projectData,
            createdAt: new Date().toISOString()
        };
        projects.push(newProject);
    }
    
    saveProjects();
    renderProjects();
    populateProjectSelects();
    closeProjectModal();
    
    // Atualizar dashboard
    if (typeof updateDashboard === 'function') {
        updateDashboard();
    }
}

function editProject(projectId) {
    openProjectModal(projectId);
}

function deleteProject(projectId) {
    if (confirm('Tem certeza que deseja excluir este projeto?')) {
        projects = projects.filter(p => p.id !== projectId);
        saveProjects();
        renderProjects();
        populateProjectSelects();
        
        // Atualizar dashboard
        if (typeof updateDashboard === 'function') {
            updateDashboard();
        }
    }
}

function viewProjectTasks(projectId) {
    // Mudar para a aba de tarefas e filtrar pelo projeto
    switchTab('tarefas');
    const filterProject = document.getElementById('filterProject');
    if (filterProject) {
        filterProject.value = projectId;
        filterTasks();
    }
}

function populateProjectSelects() {
    const selects = ['filterProject', 'taskProject', 'kanbanProjectFilter', 'ganttProjectFilter', 'timeFilterProject'];
    
    selects.forEach(selectId => {
        const select = document.getElementById(selectId);
        if (select) {
            const currentValue = select.value;
            select.innerHTML = '<option value="">Todos os Projetos</option>';
            
            projects.forEach(project => {
                const option = document.createElement('option');
                option.value = project.id;
                option.textContent = project.name;
                select.appendChild(option);
            });
            
            select.value = currentValue;
        }
    });
}

function populateUserSelects() {
    // Esta função será implementada quando o sistema de usuários estiver disponível
    const managerSelect = document.getElementById('projectManager');
    const teamSelect = document.getElementById('projectTeam');
    
    if (managerSelect) {
        managerSelect.innerHTML = '<option value="">Selecione um gerente</option>';
        managerSelect.innerHTML += '<option value="admin@example.com">Admin</option>';
        managerSelect.innerHTML += '<option value="user@example.com">Usuário</option>';
    }
    
    if (teamSelect) {
        teamSelect.innerHTML = '';
        teamSelect.innerHTML += '<option value="admin@example.com">Admin</option>';
        teamSelect.innerHTML += '<option value="user@example.com">Usuário</option>';
    }
}

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
}

function getProjectById(projectId) {
    return projects.find(p => p.id === projectId);
}

function updateProjectProgress(projectId) {
    const project = getProjectById(projectId);
    if (!project) return;
    
    // Calcular progresso baseado nas tarefas
    if (typeof tasks !== 'undefined') {
        const projectTasks = tasks.filter(t => t.projectId === projectId);
        if (projectTasks.length > 0) {
            const completedTasks = projectTasks.filter(t => t.status === 'done').length;
            project.progress = Math.round((completedTasks / projectTasks.length) * 100);
            saveProjects();
            renderProjects();
        }
    }
}