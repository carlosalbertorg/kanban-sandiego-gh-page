// Gráfico de Gantt
function initializeGantt() {
    setupGanttDateRange();
    updateGanttChart();
}

function setupGanttDateRange() {
    const startDateInput = document.getElementById('ganttStartDate');
    const endDateInput = document.getElementById('ganttEndDate');
    
    if (startDateInput && endDateInput) {
        const today = new Date();
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastDay = new Date(today.getFullYear(), today.getMonth() + 3, 0);
        
        startDateInput.value = firstDay.toISOString().split('T')[0];
        endDateInput.value = lastDay.toISOString().split('T')[0];
    }
}

function updateGanttChart() {
    const ganttChart = document.getElementById('ganttChart');
    if (!ganttChart) return;
    
    const startDate = new Date(document.getElementById('ganttStartDate')?.value || new Date());
    const endDate = new Date(document.getElementById('ganttEndDate')?.value || new Date());
    const projectFilter = document.getElementById('ganttProjectFilter')?.value;
    
    let filteredTasks = [...tasks];
    
    if (projectFilter) {
        filteredTasks = filteredTasks.filter(task => task.projectId === projectFilter);
    }
    
    // Filtrar tarefas que têm datas definidas
    filteredTasks = filteredTasks.filter(task => task.startDate && task.dueDate);
    
    ganttChart.innerHTML = '';
    
    if (filteredTasks.length === 0) {
        ganttChart.innerHTML = '<div style="padding: 40px; text-align: center; color: #666;">Nenhuma tarefa com datas definidas encontrada</div>';
        return;
    }
    
    // Criar cabeçalho
    const header = createGanttHeader(startDate, endDate);
    ganttChart.appendChild(header);
    
    // Criar linhas para cada tarefa
    filteredTasks.forEach(task => {
        const row = createGanttRow(task, startDate, endDate);
        ganttChart.appendChild(row);
    });
}

function createGanttHeader(startDate, endDate) {
    const header = document.createElement('div');
    header.className = 'gantt-header';
    
    const tasksHeader = document.createElement('div');
    tasksHeader.className = 'gantt-tasks-header';
    tasksHeader.textContent = 'Tarefas';
    
    const timelineHeader = document.createElement('div');
    timelineHeader.className = 'gantt-timeline-header';
    
    // Criar marcadores de tempo
    const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    const weekCount = Math.ceil(totalDays / 7);
    
    for (let i = 0; i < weekCount; i++) {
        const weekStart = new Date(startDate.getTime() + (i * 7 * 24 * 60 * 60 * 1000));
        const weekDiv = document.createElement('div');
        weekDiv.textContent = formatDate(weekStart.toISOString().split('T')[0]);
        weekDiv.style.flex = '1';
        weekDiv.style.textAlign = 'center';
        weekDiv.style.fontSize = '12px';
        timelineHeader.appendChild(weekDiv);
    }
    
    header.appendChild(tasksHeader);
    header.appendChild(timelineHeader);
    
    return header;
}

function createGanttRow(task, chartStartDate, chartEndDate) {
    const row = document.createElement('div');
    row.className = 'gantt-row';
    
    const taskName = document.createElement('div');
    taskName.className = 'gantt-task-name';
    
    const project = getProjectById(task.projectId);
    taskName.innerHTML = `
        <strong>${task.title}</strong>
        <br><small>${project ? project.name : 'Sem projeto'}</small>
        <br><small>${task.assignee}</small>
    `;
    
    const timeline = document.createElement('div');
    timeline.className = 'gantt-timeline';
    
    // Calcular posição e largura da barra
    const taskStart = new Date(task.startDate);
    const taskEnd = new Date(task.dueDate);
    const chartDuration = chartEndDate - chartStartDate;
    const taskDuration = taskEnd - taskStart;
    
    const startOffset = Math.max(0, (taskStart - chartStartDate) / chartDuration);
    const width = Math.min(1 - startOffset, taskDuration / chartDuration);
    
    if (width > 0) {
        const bar = document.createElement('div');
        bar.className = 'gantt-bar';
        bar.style.left = (startOffset * 100) + '%';
        bar.style.width = (width * 100) + '%';
        
        // Cor baseada no status
        const statusColors = {
            'todo': '#6c757d',
            'in-progress': '#007bff',
            'review': '#ffc107',
            'done': '#28a745'
        };
        bar.style.backgroundColor = statusColors[task.status] || '#6c757d';
        
        bar.textContent = `${task.progress}%`;
        bar.title = `${task.title} (${formatDate(task.startDate)} - ${formatDate(task.dueDate)})`;
        
        timeline.appendChild(bar);
    }
    
    row.appendChild(taskName);
    row.appendChild(timeline);
    
    return row;
}

function exportGanttChart() {
    // Implementar exportação do gráfico de Gantt
    alert('Funcionalidade de exportação será implementada em breve!');
}