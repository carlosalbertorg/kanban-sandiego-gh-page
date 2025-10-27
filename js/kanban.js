// Quadro Kanban
function initializeKanban() {
    renderKanban();
    setupKanbanDragAndDrop();
}

function renderKanban() {
    const columns = ['todo', 'in-progress', 'review', 'done'];
    
    columns.forEach(status => {
        const column = document.getElementById(status + 'Column');
        const countElement = document.getElementById(status + 'Count');
        
        if (!column) return;
        
        column.innerHTML = '';
        
        let filteredTasks = tasks.filter(task => task.status === status);
        
        // Aplicar filtro de projeto se selecionado
        const projectFilter = document.getElementById('kanbanProjectFilter')?.value;
        if (projectFilter) {
            filteredTasks = filteredTasks.filter(task => task.projectId === projectFilter);
        }
        
        // Atualizar contador
        if (countElement) {
            countElement.textContent = filteredTasks.length;
        }
        
        filteredTasks.forEach(task => {
            const taskCard = createKanbanTaskCard(task);
            column.appendChild(taskCard);
        });
    });
}

function createKanbanTaskCard(task) {
    const project = getProjectById(task.projectId);
    const card = document.createElement('div');
    card.className = 'kanban-task';
    card.draggable = true;
    card.dataset.taskId = task.id;
    
    const dueDate = task.dueDate ? new Date(task.dueDate) : null;
    const today = new Date();
    let dueDateClass = '';
    let dueDateText = '';
    
    if (dueDate) {
        const diffTime = dueDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays < 0) {
            dueDateClass = 'overdue';
            dueDateText = `Atrasado ${Math.abs(diffDays)} dias`;
        } else if (diffDays <= 3) {
            dueDateClass = 'due-soon';
            dueDateText = diffDays === 0 ? 'Vence hoje' : `${diffDays} dias`;
        } else {
            dueDateText = formatDate(task.dueDate);
        }
    }
    
    card.innerHTML = `
        <div class="task-title">${task.title}</div>
        <div class="task-description">${task.description}</div>
        <div class="task-project">${project ? project.name : 'Sem projeto'}</div>
        <div class="task-meta">
            <span class="task-assignee">${task.assignee}</span>
            <span class="task-due-date ${dueDateClass}">${dueDateText}</span>
        </div>
        <div class="task-priority priority-${task.priority}">${task.priority}</div>
        <div class="task-actions">
            <button class="btn btn-sm btn-primary" onclick="editTask('${task.id}')">✏️</button>
            <button class="btn btn-sm btn-success" onclick="startTimer('${task.id}')">⏱️</button>
        </div>
    `;
    
    return card;
}

function setupKanbanDragAndDrop() {
    const columns = document.querySelectorAll('.column-content');
    const tasks = document.querySelectorAll('.kanban-task');
    
    // Configurar drag para as tarefas
    tasks.forEach(task => {
        task.addEventListener('dragstart', handleDragStart);
        task.addEventListener('dragend', handleDragEnd);
    });
    
    // Configurar drop para as colunas
    columns.forEach(column => {
        column.addEventListener('dragover', handleDragOver);
        column.addEventListener('drop', handleDrop);
        column.addEventListener('dragenter', handleDragEnter);
        column.addEventListener('dragleave', handleDragLeave);
    });
}

function handleDragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.dataset.taskId);
    e.target.classList.add('dragging');
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');
}

function handleDragOver(e) {
    e.preventDefault();
}

function handleDragEnter(e) {
    e.preventDefault();
    e.target.classList.add('drag-over');
}

function handleDragLeave(e) {
    e.target.classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    e.target.classList.remove('drag-over');
    
    const taskId = e.dataTransfer.getData('text/plain');
    const column = e.target.closest('.kanban-column');
    const newStatus = column.dataset.status;
    
    updateTaskStatus(taskId, newStatus);
    renderKanban();
    
    // Re-configurar drag and drop após re-render
    setTimeout(setupKanbanDragAndDrop, 100);
}

function filterKanban() {
    renderKanban();
}

// Adicionar event listeners quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    // Re-configurar drag and drop quando necessário
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList' && mutation.target.classList.contains('column-content')) {
                setupKanbanDragAndDrop();
            }
        });
    });
    
    const kanbanBoard = document.getElementById('kanbanBoard');
    if (kanbanBoard) {
        observer.observe(kanbanBoard, { childList: true, subtree: true });
    }
});