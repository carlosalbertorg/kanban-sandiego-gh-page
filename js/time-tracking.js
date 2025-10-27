// Controle de Tempo
let timeEntries = [];
let activeTimer = null;
let timerInterval = null;

function initializeTimeTracking() {
    loadTimeEntries();
    renderTimeEntries();
    updateTimeStats();
    populateTimeTaskSelect();
    
    // Configurar data padrão
    const today = new Date().toISOString().split('T')[0];
    const timeFilterDate = document.getElementById('timeFilterDate');
    if (timeFilterDate) {
        timeFilterDate.value = today;
    }
}

function loadTimeEntries() {
    const savedEntries = localStorage.getItem('timeEntries');
    if (savedEntries) {
        timeEntries = JSON.parse(savedEntries);
    } else {
        // Dados de exemplo
        timeEntries = [
            {
                id: 'time-1',
                taskId: 'task-1',
                date: '2024-01-20',
                hours: 4,
                description: 'Desenvolvimento dos wireframes principais',
                createdAt: new Date().toISOString()
            },
            {
                id: 'time-2',
                taskId: 'task-2',
                date: '2024-01-21',
                hours: 6,
                description: 'Implementação do layout responsivo',
                createdAt: new Date().toISOString()
            }
        ];
        saveTimeEntries();
    }
}

function saveTimeEntries() {
    localStorage.setItem('timeEntries', JSON.stringify(timeEntries));
    updateTimeStats();
}

function renderTimeEntries() {
    const entriesList = document.getElementById('timeEntriesList');
    if (!entriesList) return;
    
    entriesList.innerHTML = '';
    
    const filteredEntries = getFilteredTimeEntries();
    
    if (filteredEntries.length === 0) {
        entriesList.innerHTML = '<div style="padding: 20px; text-align: center; color: #666;">Nenhum registro de tempo encontrado</div>';
        return;
    }
    
    filteredEntries.forEach(entry => {
        const task = getTaskById(entry.taskId);
        const project = task ? getProjectById(task.projectId) : null;
        
        const entryDiv = document.createElement('div');
        entryDiv.className = 'time-entry';
        entryDiv.innerHTML = `
            <div class="time-entry-info">
                <div class="time-entry-task">${task ? task.title : 'Tarefa não encontrada'}</div>
                <div class="time-entry-description">${entry.description}</div>
                <small>${project ? project.name : 'Sem projeto'} • ${formatDate(entry.date)}</small>
            </div>
            <div class="time-entry-meta">
                <div class="time-entry-hours">${entry.hours}h</div>
                <button class="btn btn-sm btn-danger" onclick="deleteTimeEntry('${entry.id}')">🗑️</button>
            </div>
        `;
        entriesList.appendChild(entryDiv);
    });
}

function getFilteredTimeEntries() {
    let filtered = [...timeEntries];
    
    const dateFilter = document.getElementById('timeFilterDate')?.value;
    const projectFilter = document.getElementById('timeFilterProject')?.value;
    
    if (dateFilter) {
        filtered = filtered.filter(entry => entry.date === dateFilter);
    }
    
    if (projectFilter) {
        filtered = filtered.filter(entry => {
            const task = getTaskById(entry.taskId);
            return task && task.projectId === projectFilter;
        });
    }
    
    return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
}

function filterTimeEntries() {
    renderTimeEntries();
}

function updateTimeStats() {
    const today = new Date().toISOString().split('T')[0];
    const thisWeekStart = getWeekStart(new Date()).toISOString().split('T')[0];
    const thisWeekEnd = getWeekEnd(new Date()).toISOString().split('T')[0];
    
    // Estatísticas de hoje
    const todayEntries = timeEntries.filter(entry => entry.date === today);
    const todayTotal = todayEntries.reduce((sum, entry) => sum + entry.hours, 0);
    const todayTasks = new Set(todayEntries.map(entry => entry.taskId)).size;
    
    // Estatísticas da semana
    const weekEntries = timeEntries.filter(entry => 
        entry.date >= thisWeekStart && entry.date <= thisWeekEnd
    );
    const weekTotal = weekEntries.reduce((sum, entry) => sum + entry.hours, 0);
    const weekAverage = weekTotal / 7;
    
    // Atualizar elementos
    const todayTotalEl = document.getElementById('todayTotal');
    const todayTasksEl = document.getElementById('todayTasks');
    const weekTotalEl = document.getElementById('weekTotal');
    const weekAverageEl = document.getElementById('weekAverage');
    
    if (todayTotalEl) todayTotalEl.textContent = formatHours(todayTotal);
    if (todayTasksEl) todayTasksEl.textContent = todayTasks;
    if (weekTotalEl) weekTotalEl.textContent = formatHours(weekTotal);
    if (weekAverageEl) weekAverageEl.textContent = formatHours(weekAverage);
}

function startTaskTimer(taskId) {
    if (activeTimer) {
        stopTimer();
    }
    
    const task = getTaskById(taskId);
    if (!task) return;
    
    activeTimer = {
        taskId: taskId,
        startTime: new Date(),
        elapsedSeconds: 0
    };
    
    const activeTimerDiv = document.getElementById('activeTimer');
    const currentTaskSpan = document.getElementById('currentTask');
    const timerDisplay = document.getElementById('timerDisplay');
    
    if (activeTimerDiv) activeTimerDiv.style.display = 'flex';
    if (currentTaskSpan) currentTaskSpan.textContent = task.title;
    
    timerInterval = setInterval(() => {
        activeTimer.elapsedSeconds++;
        if (timerDisplay) {
            timerDisplay.textContent = formatSeconds(activeTimer.elapsedSeconds);
        }
    }, 1000);
}

function stopTimer() {
    if (!activeTimer || !timerInterval) return;
    
    clearInterval(timerInterval);
    
    const hours = activeTimer.elapsedSeconds / 3600;
    if (hours >= 0.1) { // Só salvar se trabalhou pelo menos 6 minutos
        const entry = {
            id: 'time-' + Date.now(),
            taskId: activeTimer.taskId,
            date: new Date().toISOString().split('T')[0],
            hours: Math.round(hours * 4) / 4, // Arredondar para 15 minutos
            description: 'Tempo registrado automaticamente',
            createdAt: new Date().toISOString()
        };
        
        timeEntries.push(entry);
        saveTimeEntries();
        renderTimeEntries();
    }
    
    activeTimer = null;
    timerInterval = null;
    
    const activeTimerDiv = document.getElementById('activeTimer');
    if (activeTimerDiv) activeTimerDiv.style.display = 'none';
}

function openTimeModal() {
    const modal = document.getElementById('timeModal');
    const form = document.getElementById('timeForm');
    
    form.reset();
    document.getElementById('timeDate').value = new Date().toISOString().split('T')[0];
    populateTimeTaskSelect();
    
    modal.style.display = 'block';
}

function closeTimeModal() {
    document.getElementById('timeModal').style.display = 'none';
}

function saveTimeEntry(event) {
    event.preventDefault();
    
    const entry = {
        id: 'time-' + Date.now(),
        taskId: document.getElementById('timeTask').value,
        date: document.getElementById('timeDate').value,
        hours: parseFloat(document.getElementById('timeHours').value),
        description: document.getElementById('timeDescription').value,
        createdAt: new Date().toISOString()
    };
    
    timeEntries.push(entry);
    saveTimeEntries();
    renderTimeEntries();
    closeTimeModal();
}

function deleteTimeEntry(entryId) {
    if (confirm('Tem certeza que deseja excluir este registro?')) {
        timeEntries = timeEntries.filter(entry => entry.id !== entryId);
        saveTimeEntries();
        renderTimeEntries();
    }
}

function populateTimeTaskSelect() {
    const select = document.getElementById('timeTask');
    if (!select) return;
    
    select.innerHTML = '<option value="">Selecione uma tarefa</option>';
    
    tasks.forEach(task => {
        const project = getProjectById(task.projectId);
        const option = document.createElement('option');
        option.value = task.id;
        option.textContent = `${task.title} (${project ? project.name : 'Sem projeto'})`;
        select.appendChild(option);
    });
}

// Funções utilitárias
function formatHours(hours) {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}h ${m}m`;
}

function formatSeconds(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function getWeekStart(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    return new Date(d.setDate(diff));
}

function getWeekEnd(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + 6;
    return new Date(d.setDate(diff));
}

// Parar timer quando a página for fechada
window.addEventListener('beforeunload', function() {
    if (activeTimer) {
        stopTimer();
    }
});