// Gerenciamento de manutenção
let maintenanceData = [];
let executionHistory = [];
let unsubscribe = null;
let unsubscribeHistory = null;

const initialMaintenanceData = [
    {item: "🔒 Câmeras / Cerca elétrica (gravação e funcionamento)", freq: "Diário", prio: "Alta", status: "Pendente", resp: "", data: "", lastExecution: "", nextExecution: "", obs: ""},
    {item: "🛗 Elevadores (revisar relatórios da empresa responsável)", freq: "Mensal", prio: "Alta", status: "Pendente", resp: "", data: "", lastExecution: "", nextExecution: "", obs: ""},
    {item: "🧯 Extintores e hidrantes (pressão, lacres, acessibilidade)", freq: "Semanal", prio: "Alta", status: "Pendente", resp: "", data: "", lastExecution: "", nextExecution: "", obs: ""},
    {item: "🧯 Extintores e hidrantes (revisar validade e recarga)", freq: "Mensal", prio: "Alta", status: "Pendente", resp: "", data: "", lastExecution: "", nextExecution: "", obs: ""},
    {item: "⚙️ Gerador (checagem técnica, troca de óleo, bateria)", freq: "Mensal", prio: "Alta", status: "Pendente", resp: "", data: "", lastExecution: "", nextExecution: "", obs: ""},
    {item: "⚙️ Gerador (testar funcionamento e nível de combustível)", freq: "Semanal", prio: "Alta", status: "Pendente", resp: "", data: "", lastExecution: "", nextExecution: "", obs: ""},
    {item: "🧹 Limpeza dos ambientes (halls, elevadores, escadas, portarias)", freq: "Diário", prio: "Alta", status: "Pendente", resp: "", data: "", lastExecution: "", nextExecution: "", obs: ""},
    {item: "⚡ Parte elétrica geral (quadros, disjuntores, sensores, refletores)", freq: "Mensal", prio: "Alta", status: "Pendente", resp: "", data: "", lastExecution: "", nextExecution: "", obs: ""},
    {item: "🚪 Portões entrada/saída (funcionamento, sensores)", freq: "Diário", prio: "Alta", status: "Pendente", resp: "", data: "", lastExecution: "", nextExecution: "", obs: ""},
    {item: "💧 Reservatórios de água (limpeza e inspeção elétrica completa)", freq: "Mensal", prio: "Alta", status: "Pendente", resp: "", data: "", lastExecution: "", nextExecution: "", obs: ""},
    {item: "💧 Reservatórios de água (nível, ruídos, painel elétrico)", freq: "Semanal", prio: "Alta", status: "Pendente", resp: "", data: "", lastExecution: "", nextExecution: "", obs: ""},
    {item: "🧊 Ar-condicionados (verificar filtros dos equipamentos coletivos)", freq: "Semanal", prio: "Média", status: "Pendente", resp: "", data: "", lastExecution: "", nextExecution: "", obs: ""},
    {item: "🌿 Jardinagem (manutenção geral, podas grandes, substituições)", freq: "Mensal", prio: "Média", status: "Pendente", resp: "", data: "", lastExecution: "", nextExecution: "", obs: ""},
    {item: "🌿 Jardinagem (poda leve, irrigação, reposição de plantas)", freq: "Semanal", prio: "Média", status: "Pendente", resp: "", data: "", lastExecution: "", nextExecution: "", obs: ""},
    {item: "🌿 Jardinagem leve (varrer folhas, irrigação básica)", freq: "Diário", prio: "Média", status: "Pendente", resp: "", data: "", lastExecution: "", nextExecution: "", obs: ""},
    {item: "🗑️ Lixeiras e coleta seletiva (troca de sacos, limpeza)", freq: "Diário", prio: "Média", status: "Pendente", resp: "", data: "", lastExecution: "", nextExecution: "", obs: ""},
    {item: "🏊 Piscina (manutenção completa: filtros, bombas, cloração)", freq: "Mensal", prio: "Média", status: "Pendente", resp: "", data: "", lastExecution: "", nextExecution: "", obs: ""},
    {item: "🍖 Área das churrasqueiras (limpeza, mesas, banheiros)", freq: "Semanal", prio: "Normal", status: "Pendente", resp: "", data: "", lastExecution: "", nextExecution: "", obs: ""},
    {item: "🍖 Área das churrasqueiras (pintura, reparos, limpeza profunda)", freq: "Mensal", prio: "Normal", status: "Pendente", resp: "", data: "", lastExecution: "", nextExecution: "", obs: ""},
    {item: "🧸 Espaço Kids (brinquedos, piso, paredes, banheiros)", freq: "Semanal", prio: "Normal", status: "Pendente", resp: "", data: "", lastExecution: "", nextExecution: "", obs: ""},
    {item: "🧸 Espaço Kids (revisão estrutural, pintura, segurança)", freq: "Mensal", prio: "Normal", status: "Pendente", resp: "", data: "", lastExecution: "", nextExecution: "", obs: ""},
    {item: "🎉 Salão de festas (limpeza e inspeção pós-uso)", freq: "Semanal", prio: "Normal", status: "Pendente", resp: "", data: "", lastExecution: "", nextExecution: "", obs: ""},
    {item: "🎉 Salão de festas (revisão de móveis, iluminação, estrutura)", freq: "Mensal", prio: "Normal", status: "Pendente", resp: "", data: "", lastExecution: "", nextExecution: "", obs: ""},
    {item: "🕹️ Salão de jogos (manutenção de equipamentos e pintura)", freq: "Mensal", prio: "Normal", status: "Pendente", resp: "", data: "", lastExecution: "", nextExecution: "", obs: ""},
    {item: "🕹️ Salão de jogos (mesas, iluminação, limpeza)", freq: "Semanal", prio: "Normal", status: "Pendente", resp: "", data: "", lastExecution: "", nextExecution: "", obs: ""},
    {item: "🚸 Comunicação visual (faixas pedestres, marcação vagas, números)", freq: "Mensal", prio: "Baixa", status: "Pendente", resp: "", data: "", lastExecution: "", nextExecution: "", obs: ""},
    {item: "🚸 Comunicação visual interna (placas, sinalizações)", freq: "Semanal", prio: "Baixa", status: "Pendente", resp: "", data: "", lastExecution: "", nextExecution: "", obs: ""},
    {item: "🧾 Condomínio em geral (acompanhar laudo do engenheiro)", freq: "Mensal", prio: "Baixa", status: "Pendente", resp: "", data: "", lastExecution: "", nextExecution: "", obs: ""},
    {item: "🏢 Torres B, C e D (levantar pendências por andar)", freq: "Mensal", prio: "Baixa", status: "Pendente", resp: "", data: "", lastExecution: "", nextExecution: "", obs: ""},
    {item: "📟 Leitura do Gás", freq: "Mensal", prio: "Alta", status: "Pendente", resp: "", data: "", lastExecution: "", nextExecution: "", obs: ""},
    {item: "💧 Leitura da Água", freq: "Mensal", prio: "Alta", status: "Pendente", resp: "", data: "", lastExecution: "", nextExecution: "", obs: ""},
    {item: "💡 Iluminação dos Ambientes e Área Externa", freq: "Mensal", prio: "Média", status: "Pendente", resp: "", data: "", lastExecution: "", nextExecution: "", obs: ""}
];


async function initializeFirebaseData() {
    try {
        const snapshot = await db.collection('maintenance').get();
        if (snapshot.empty) {
            console.log('Inicializando dados no Firebase...');
            for (const item of initialMaintenanceData) {
                await db.collection('maintenance').add({
                    ...item,
                    order: initialMaintenanceData.indexOf(item),
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    createdBy: currentUser.email
                });
            }
            console.log('Dados iniciais adicionados ao Firebase');
        }
    } catch (error) {
        console.error('Erro ao inicializar dados:', error);
    }
}

function listenToChanges() {
    unsubscribe = db.collection('maintenance').orderBy('order', 'asc').onSnapshot((snapshot) => {
        maintenanceData = [];
        snapshot.forEach((doc) => {
            maintenanceData.push({ id: doc.id, ...doc.data() });
        });
        renderTable();
        updateConnectionStatus(true);
        updateHistoryItemFilter();
    }, (error) => {
        console.error('Erro ao escutar mudanças:', error);
        updateConnectionStatus(false);
    });
}

function listenToExecutionHistory() {
    unsubscribeHistory = db.collection('executions').onSnapshot((snapshot) => {
        executionHistory = [];
        snapshot.forEach((doc) => {
            executionHistory.push({ id: doc.id, ...doc.data() });
        });
        updateStats();
    }, (error) => {
        console.error('Erro ao escutar histórico:', error);
    });
}

async function addItem(item) {
    if (!checkPermission('canAdd')) {
        alert('Você não tem permissão para adicionar itens');
        return;
    }
    try {
        const docRef = await db.collection('maintenance').add({
            ...item,
            order: maintenanceData.length,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            createdBy: currentUser.email
        });
        return docRef.id;
    } catch (error) {
        console.error('Erro ao adicionar item:', error);
        throw error;
    }
}

async function updateItem(id, updates) {
    if (!checkPermission('canEdit')) {
        alert('Você não tem permissão para editar itens');
        return;
    }
    try {
        await db.collection('maintenance').doc(id).update({
            ...updates,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedBy: currentUser.email
        });
    } catch (error) {
        console.error('Erro ao atualizar item:', error);
        throw error;
    }
}

async function deleteItem(id) {
    if (!checkPermission('canDelete')) {
        alert('Você não tem permissão para excluir itens');
        return;
    }
    try {
        await db.collection('maintenance').doc(id).delete();
    } catch (error) {
        console.error('Erro ao excluir item:', error);
        throw error;
    }
}

async function addExecution(execution) {
    try {
        const docRef = await db.collection('executions').add({
            ...execution,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            createdBy: currentUser.email
        });
        await db.collection('maintenance').doc(execution.itemId).update({
            lastExecution: execution.executionDate,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        return docRef.id;
    } catch (error) {
        console.error('Erro ao registrar execução:', error);
        throw error;
    }
}

function updateConnectionStatus(connected) {
    const statusElement = document.getElementById('connectionStatus');
    const loadingElement = document.getElementById('loadingIndicator');
    if (connected) {
        statusElement.textContent = '✅ Conectado ao banco de dados';
        statusElement.className = 'status-indicator status-online';
        if (loadingElement) loadingElement.style.display = 'none';
    } else {
        statusElement.innerHTML = '<span class="loading"></span> Tentando reconectar...';
        statusElement.className = 'status-indicator status-offline';
        if (loadingElement) loadingElement.style.display = 'inline-block';
    }
}

function renderTable() {
    const tbody = document.getElementById('tableBody');
    if (!tbody) return;
    tbody.innerHTML = '';
    
    maintenanceData.forEach((row, index) => {
        const itemExecutions = executionHistory.filter(exec => exec.itemId === row.id);
        const historyLastExecution = itemExecutions.length > 0 
            ? itemExecutions.reduce((latest, exec) => exec.executionDate > latest ? exec.executionDate : latest, '')
            : '';
        const historyNextExecution = calculateNextExecution(row.freq, historyLastExecution);
        
        // Usar dados manuais se disponíveis, senão usar dados do histórico
        const displayLastExecution = row.lastExecution || historyLastExecution;
        const displayNextExecution = row.nextExecution || historyNextExecution;
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td><strong>${row.item}</strong></td>
            <td><span class="frequencia ${row.freq.toLowerCase()}">${row.freq}</span></td>
            <td><span class="prioridade ${row.prio.toLowerCase()}">${row.prio}</span></td>
            <td>
                <select class="status ${row.status.toLowerCase().replace(' ', '-')}" onchange="updateStatus('${row.id}', this.value)" ${!checkPermission('canEdit') ? 'disabled' : ''}>
                    <option value="Pendente" ${row.status === 'Pendente' ? 'selected' : ''}>Pendente</option>
                    <option value="Em andamento" ${row.status === 'Em andamento' ? 'selected' : ''}>Em andamento</option>
                    <option value="Concluído" ${row.status === 'Concluído' ? 'selected' : ''}>Concluído</option>
                </select>
            </td>
            <td><input type="text" value="${row.resp || ''}" onchange="updateField('${row.id}', 'resp', this.value)" placeholder="Nome" ${!checkPermission('canEdit') ? 'readonly' : ''}></td>
            <td><input type="date" value="${row.data || ''}" onchange="updateField('${row.id}', 'data', this.value)" ${!checkPermission('canEdit') ? 'readonly' : ''}></td>
            <td>
                <input type="date" value="${row.lastExecution || ''}" onchange="updateField('${row.id}', 'lastExecution', this.value)" ${!checkPermission('canEdit') ? 'readonly' : ''}>
                ${isToday(displayLastExecution) ? '<span class="today-badge">HOJE</span>' : ''}
                ${isRecent(displayLastExecution) ? '<span class="recent-badge">RECENTE</span>' : ''}
            </td>
            <td><input type="date" value="${row.nextExecution || ''}" onchange="updateField('${row.id}', 'nextExecution', this.value)" ${!checkPermission('canEdit') ? 'readonly' : ''}></td>
            <td><input type="text" value="${row.obs || ''}" onchange="updateField('${row.id}', 'obs', this.value)" placeholder="Observações" ${!checkPermission('canEdit') ? 'readonly' : ''}></td>
            <td class="action-buttons" style="${!checkPermission('canEdit') && !checkPermission('canDelete') ? 'display:none' : ''}">
                <button class="btn btn-history" onclick="openExecutionModal('${row.id}', '${row.item.replace(/'/g, "\\'")}')" title="Registrar Execução">📅</button>
                ${checkPermission('canEdit') ? `<button class="btn" onclick="editItem('${row.id}')">✏️</button>` : ''}
                ${checkPermission('canDelete') ? `<button class="btn btn-danger" onclick="deleteItemFromUI('${row.id}')">🗑️</button>` : ''}
            </td>
        `;
        tbody.appendChild(tr);
    });
    updateStats();
}

function calculateNextExecution(frequency, lastExecution) {
    if (!lastExecution) return '';
    const lastDate = new Date(lastExecution);
    const nextDate = new Date(lastDate);
    switch (frequency) {
        case 'Diário': nextDate.setDate(nextDate.getDate() + 1); break;
        case 'Semanal': nextDate.setDate(nextDate.getDate() + 7); break;
        case 'Mensal': nextDate.setMonth(nextDate.getMonth() + 1); break;
        default: return '';
    }
    return nextDate.toISOString().split('T')[0];
}

function isToday(dateString) {
    if (!dateString) return false;
    return dateString === new Date().toISOString().split('T')[0];
}

function isRecent(dateString) {
    if (!dateString) return false;
    const date = new Date(dateString);
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    return date > threeDaysAgo;
}

function formatDate(dateString) {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('pt-BR');
}

async function updateStatus(id, value) {
    try {
        await updateItem(id, { status: value });
    } catch (error) {
        alert('Erro ao atualizar status: ' + error.message);
    }
}

async function updateField(id, field, value) {
    try {
        await updateItem(id, { [field]: value });
    } catch (error) {
        alert('Erro ao atualizar campo: ' + error.message);
    }
}

function updateStats() {
    const totalItems = document.getElementById('totalItems');
    const totalPendentes = document.getElementById('totalPendentes');
    const totalAndamento = document.getElementById('totalAndamento');
    const totalConcluidos = document.getElementById('totalConcluidos');
    const totalHoje = document.getElementById('totalHoje');
    
    if (totalItems) totalItems.textContent = maintenanceData.length;
    if (totalPendentes) totalPendentes.textContent = maintenanceData.filter(r => r.status === 'Pendente').length;
    if (totalAndamento) totalAndamento.textContent = maintenanceData.filter(r => r.status === 'Em andamento').length;
    if (totalConcluidos) totalConcluidos.textContent = maintenanceData.filter(r => r.status === 'Concluído').length;
    
    const today = new Date().toISOString().split('T')[0];
    const todayExecutions = executionHistory.filter(exec => exec.executionDate === today).length;
    if (totalHoje) totalHoje.textContent = todayExecutions;
}

function applyFilters() {
    const freqFilter = document.getElementById('filterFreq')?.value || '';
    const prioFilter = document.getElementById('filterPrio')?.value || '';
    const statusFilter = document.getElementById('filterStatus')?.value || '';
    
    const rows = document.querySelectorAll('#tableBody tr');
    rows.forEach((row, index) => {
        const data = maintenanceData[index];
        if (!data) return;
        const matchFreq = !freqFilter || data.freq === freqFilter;
        const matchPrio = !prioFilter || data.prio === prioFilter;
        const matchStatus = !statusFilter || data.status === statusFilter;
        row.style.display = (matchFreq && matchPrio && matchStatus) ? '' : 'none';
    });
}

async function loadDailyHistory() {
    const dateFilter = document.getElementById('filterDate')?.value;
    const itemFilter = document.getElementById('filterHistoryItem')?.value;
    const today = dateFilter || new Date().toISOString().split('T')[0];
    
    try {
        const snapshot = await db.collection('executions').where('executionDate', '==', today).get();
        const executions = [];
        snapshot.forEach(doc => {
            executions.push({ id: doc.id, ...doc.data() });
        });
        executions.sort((a, b) => {
            const dateA = a.createdAt?.toDate?.() || new Date(0);
            const dateB = b.createdAt?.toDate?.() || new Date(0);
            return dateB - dateA;
        });
        const filteredExecutions = itemFilter ? executions.filter(exec => exec.itemId === itemFilter) : executions;
        displayDailyHistory(filteredExecutions, today);
    } catch (error) {
        console.error('Erro ao carregar histórico:', error);
        document.getElementById('dailyHistory').innerHTML = `
            <div style="text-align: center; padding: 40px; color: #dc3545;">
                <p>Erro ao carregar histórico: ${error.message}</p>
            </div>
        `;
    }
}

function displayDailyHistory(executions, date) {
    const container = document.getElementById('dailyHistory');
    if (executions.length === 0) {
        container.innerHTML = `<div style="text-align: center; padding: 40px; color: #6c757d;"><p>Nenhuma execução registrada para ${formatDate(date)}</p></div>`;
        return;
    }
    let html = `<h3 style="margin-bottom: 20px;">Execuções do dia ${formatDate(date)}</h3><div style="display: grid; gap: 15px;">`;
    executions.forEach(exec => {
        const item = maintenanceData.find(m => m.id === exec.itemId);
        const itemName = item ? item.item : 'Item não encontrado';
        html += `
            <div class="history-item">
                <div class="history-header">
                    <div><strong class="history-date">${itemName}</strong><span class="today-badge">${formatDate(exec.executionDate)}</span></div>
                    <span class="history-user">por ${exec.responsavel}</span>
                </div>
                <div><p><strong>Observações:</strong> ${exec.observacoes || 'Sem observações'}</p></div>
                <div class="history-actions"><small>Registrado em: ${exec.createdAt?.toDate ? new Date(exec.createdAt.toDate()).toLocaleString('pt-BR') : 'Data não disponível'}</small></div>
            </div>
        `;
    });
    html += `</div>`;
    container.innerHTML = html;
}

function updateHistoryItemFilter() {
    const select = document.getElementById('filterHistoryItem');
    if (!select) return;
    const firstOption = select.options[0];
    select.innerHTML = '';
    select.appendChild(firstOption);
    maintenanceData.forEach(item => {
        const option = document.createElement('option');
        option.value = item.id;
        option.textContent = item.item;
        select.appendChild(option);
    });
}

async function generateReport() {
    const startDate = document.getElementById('reportStartDate').value;
    const endDate = document.getElementById('reportEndDate').value;
    const reportType = document.getElementById('reportType').value;
    if (!startDate || !endDate) {
        alert('Selecione o período do relatório');
        return;
    }
    try {
        let results;
        switch (reportType) {
            case 'execucoes': results = await generateExecutionsReport(startDate, endDate); break;
            case 'pendentes': results = generatePendingReport(); break;
            case 'frequencia': results = generateFrequencyReport(); break;
        }
        displayReportResults(results, reportType, startDate, endDate);
    } catch (error) {
        console.error('Erro ao gerar relatório:', error);
        alert('Erro ao gerar relatório: ' + error.message);
    }
}

async function generateExecutionsReport(startDate, endDate) {
    const snapshot = await db.collection('executions').where('executionDate', '>=', startDate).where('executionDate', '<=', endDate).get();
    const executions = [];
    snapshot.forEach(doc => executions.push({ id: doc.id, ...doc.data() }));
    executions.sort((a, b) => a.executionDate > b.executionDate ? -1 : 1);
    const grouped = {};
    executions.forEach(exec => {
        if (!grouped[exec.itemId]) grouped[exec.itemId] = [];
        grouped[exec.itemId].push(exec);
    });
    return { executions, grouped };
}

function generatePendingReport() {
    const pendingItems = maintenanceData.filter(item => item.status === 'Pendente' || item.status === 'Em andamento');
    return { pendingItems };
}

function generateFrequencyReport() {
    const byFrequency = {
        'Diário': maintenanceData.filter(item => item.freq === 'Diário'),
        'Semanal': maintenanceData.filter(item => item.freq === 'Semanal'),
        'Mensal': maintenanceData.filter(item => item.freq === 'Mensal')
    };
    return { byFrequency };
}

function displayReportResults(results, reportType, startDate, endDate) {
    const container = document.getElementById('reportResults');
    let html = `<h3>Relatório: ${getReportTypeName(reportType)}</h3><p>Período: ${formatDate(startDate)} à ${formatDate(endDate)}</p><br>`;
    switch (reportType) {
        case 'execucoes': html += displayExecutionsReport(results); break;
        case 'pendentes': html += displayPendingReport(results); break;
        case 'frequencia': html += displayFrequencyReport(results); break;
    }
    container.innerHTML = html;
}

function displayExecutionsReport(results) {
    let html = `<div class="stats" style="grid-template-columns: repeat(3, 1fr); margin-bottom: 20px;">
        <div class="stat-card"><h3>${results.executions.length}</h3><p>Total de Execuções</p></div>
        <div class="stat-card"><h3>${Object.keys(results.grouped).length}</h3><p>Itens Executados</p></div>
        <div class="stat-card"><h3>${new Set(results.executions.map(e => e.executionDate)).size}</h3><p>Dias com Execução</p></div>
    </div><h4>Detalhes por Item:</h4><div style="display: grid; gap: 15px; margin-top: 20px;">`;
    Object.keys(results.grouped).forEach(itemId => {
        const item = maintenanceData.find(m => m.id === itemId);
        const itemName = item ? item.item : 'Item não encontrado';
        const executions = results.grouped[itemId];
        html += `
            <div class="history-item">
                <div class="history-header"><strong>${itemName}</strong><span>${executions.length} execuções</span></div>
                <div>
                    <p><strong>Última execução:</strong> ${formatDate(executions[0].executionDate)}</p>
                    <p><strong>Responsável:</strong> ${executions[0].responsavel}</p>
                </div>
            </div>
        `;
    });
    html += `</div>`;
    return html;
}

function displayPendingReport(results) {
    let html = `<div class="stats" style="grid-template-columns: repeat(3, 1fr); margin-bottom: 20px;">
        <div class="stat-card"><h3>${results.pendingItems.length}</h3><p>Itens Pendentes</p></div>
        <div class="stat-card"><h3>${results.pendingItems.filter(i => i.prio === 'Alta').length}</h3><p>Prioridade Alta</p></div>
        <div class="stat-card"><h3>${results.pendingItems.filter(i => i.status === 'Em andamento').length}</h3><p>Em Andamento</p></div>
    </div><h4>Lista de Itens Pendentes:</h4><div style="display: grid; gap: 15px; margin-top: 20px;">`;
    results.pendingItems.forEach(item => {
        html += `
            <div class="history-item">
                <div class="history-header"><strong>${item.item}</strong><span class="prioridade ${item.prio.toLowerCase()}">${item.prio}</span></div>
                <div>
                    <p><strong>Status:</strong> ${item.status}</p>
                    <p><strong>Frequência:</strong> ${item.freq}</p>
                    <p><strong>Responsável:</strong> ${item.resp || 'Não atribuído'}</p>
                </div>
            </div>
        `;
    });
    html += `</div>`;
    return html;
}

function displayFrequencyReport(results) {
    let html = `<div class="stats" style="grid-template-columns: repeat(3, 1fr); margin-bottom: 20px;">
        <div class="stat-card"><h3>${results.byFrequency['Diário'].length}</h3><p>Tarefas Diárias</p></div>
        <div class="stat-card"><h3>${results.byFrequency['Semanal'].length}</h3><p>Tarefas Semanais</p></div>
        <div class="stat-card"><h3>${results.byFrequency['Mensal'].length}</h3><p>Tarefas Mensais</p></div>
    </div>`;
    Object.keys(results.byFrequency).forEach(freq => {
        html += `<h4>Tarefas ${freq}:</h4><div style="display: grid; gap: 15px; margin-top: 20px; margin-bottom: 30px;">`;
        results.byFrequency[freq].forEach(item => {
            html += `
                <div class="history-item">
                    <div class="history-header"><strong>${item.item}</strong><span class="prioridade ${item.prio.toLowerCase()}">${item.prio}</span></div>
                    <div>
                        <p><strong>Status:</strong> ${item.status}</p>
                        <p><strong>Responsável:</strong> ${item.resp || 'Não atribuído'}</p>
                    </div>
                </div>
            `;
        });
        html += `</div>`;
    });
    return html;
}

function getReportTypeName(type) {
    const names = {
        'execucoes': 'Execuções por Período',
        'pendentes': 'Itens Pendentes',
        'frequencia': 'Por Frequência'
    };
    return names[type] || type;
}

function openAddModal() {
    if (!checkPermission('canAdd')) {
        alert('Você não tem permissão para adicionar itens');
        return;
    }
    document.getElementById('modalTitle').textContent = 'Adicionar Item';
    document.getElementById('editIndex').value = '';
    document.getElementById('itemForm').reset();
    document.getElementById('itemModal').style.display = 'flex';
}

function editItem(id) {
    const item = maintenanceData.find(item => item.id === id);
    if (!item) return;
    
    document.getElementById('editIndex').value = id;
    document.getElementById('itemName').value = item.item;
    document.getElementById('itemFreq').value = item.freq;
    document.getElementById('itemPrio').value = item.prio;
    document.getElementById('itemStatus').value = item.status;
    document.getElementById('itemResp').value = item.resp || '';
    document.getElementById('itemData').value = item.data || '';
    document.getElementById('itemLastExecution').value = item.lastExecution || '';
    document.getElementById('itemNextExecution').value = item.nextExecution || '';
    document.getElementById('itemObs').value = item.obs || '';
    
    document.getElementById('modalTitle').textContent = 'Editar Item';
    document.getElementById('itemModal').style.display = 'block';
}

function openExecutionModal(itemId, itemName) {
    document.getElementById('executionItemId').value = itemId;
    document.getElementById('executionItemName').value = itemName;
    document.getElementById('displayItemName').value = itemName;
    document.getElementById('executionDate').value = new Date().toISOString().split('T')[0];
    document.getElementById('executionResponsavel').value = currentUser.email;
    document.getElementById('executionObservacoes').value = '';
    document.getElementById('executionModal').style.display = 'flex';
}

function closeExecutionModal() {
    document.getElementById('executionModal').style.display = 'none';
}

async function saveExecution(event) {
    event.preventDefault();
    const executionData = {
        itemId: document.getElementById('executionItemId').value,
        itemName: document.getElementById('executionItemName').value,
        executionDate: document.getElementById('executionDate').value,
        responsavel: document.getElementById('executionResponsavel').value,
        observacoes: document.getElementById('executionObservacoes').value
    };
    try {
        await addExecution(executionData);
        closeExecutionModal();
        alert('✅ Execução registrada com sucesso!');
    } catch (error) {
        alert('Erro ao registrar execução: ' + error.message);
    }
}

async function deleteItemFromUI(id) {
    if (!checkPermission('canDelete')) {
        alert('Você não tem permissão para excluir itens');
        return;
    }
    if (confirm('Tem certeza que deseja excluir este item?')) {
        try {
            await deleteItem(id);
        } catch (error) {
            alert('Erro ao excluir item: ' + error.message);
        }
    }
}

async function saveItem(event) {
    event.preventDefault();
    const id = document.getElementById('editIndex').value;
    const itemData = {
        item: document.getElementById('itemName').value,
        freq: document.getElementById('itemFreq').value,
        prio: document.getElementById('itemPrio').value,
        status: document.getElementById('itemStatus').value,
        resp: document.getElementById('itemResp').value,
        data: document.getElementById('itemData').value,
        lastExecution: document.getElementById('itemLastExecution').value,
        nextExecution: document.getElementById('itemNextExecution').value,
        obs: document.getElementById('itemObs').value
    };
    try {
        if (id) {
            await updateItem(id, itemData);
        } else {
            await addItem(itemData);
        }
        closeModal();
    } catch (error) {
        alert('Erro ao salvar item: ' + error.message);
    }
}

function closeModal() {
    document.getElementById('itemModal').style.display = 'none';
}

function saveData() {
    if (!checkPermission('canExport')) {
        alert('Você não tem permissão para exportar dados');
        return;
    }
    const dataStr = JSON.stringify(maintenanceData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `manutencao_condominio_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    alert('✅ Backup salvo com sucesso!');
}

function exportToCSV() {
    if (!checkPermission('canExport')) {
        alert('Você não tem permissão para exportar dados');
        return;
    }
    let csv = 'Nº,Item/Área,Frequência,Prioridade,Status,Responsável,Última Revisão,Última Execução,Próxima Prevista,Observações\n';
    maintenanceData.forEach((row, index) => {
        const itemExecutions = executionHistory.filter(exec => exec.itemId === row.id);
        const historyLastExecution = itemExecutions.length > 0 
            ? itemExecutions.reduce((latest, exec) => exec.executionDate > latest ? exec.executionDate : latest, '')
            : '';
        const historyNextExecution = calculateNextExecution(row.freq, historyLastExecution);
        
        // Usar dados manuais se disponíveis, senão usar dados do histórico
        const displayLastExecution = row.lastExecution || historyLastExecution || 'Nunca';
        const displayNextExecution = row.nextExecution || historyNextExecution || '-';
        
        csv += `${index + 1},"${row.item}",${row.freq},${row.prio},${row.status},"${row.resp || ''}",${row.data || ''},${displayLastExecution},${displayNextExecution},"${row.obs || ''}"\n`;
    });
    const blob = new Blob([csv], {type: 'text/csv;charset=utf-8;'});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `manutencao_condominio_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    alert('✅ Planilha exportada com sucesso!');
}

async function exportHistoryToCSV() {
    if (!checkPermission('canExport')) {
        alert('Você não tem permissão para exportar dados');
        return;
    }
    const dateFilter = document.getElementById('filterDate')?.value;
    const today = dateFilter || new Date().toISOString().split('T')[0];
    try {
        const snapshot = await db.collection('executions').where('executionDate', '==', today).get();
        const executions = [];
        snapshot.forEach(doc => executions.push({ id: doc.id, ...doc.data() }));
        executions.sort((a, b) => {
            const dateA = a.createdAt?.toDate?.() || new Date(0);
            const dateB = b.createdAt?.toDate?.() || new Date(0);
            return dateB - dateA;
        });
        let csv = 'Data,Item,Responsável,Observações,Data do Registro\n';
        executions.forEach(exec => {
            const item = maintenanceData.find(m => m.id === exec.itemId);
            const itemName = item ? item.item : 'Item não encontrado';
            csv += `"${formatDate(exec.executionDate)}","${itemName}","${exec.responsavel}","${exec.observacoes || ''}","${exec.createdAt?.toDate ? new Date(exec.createdAt.toDate()).toLocaleString('pt-BR') : 'Data não disponível'}"\n`;
        });
        const blob = new Blob([csv], {type: 'text/csv;charset=utf-8;'});
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `historico_execucoes_${today}.csv`;
        link.click();
        alert('✅ Histórico exportado com sucesso!');
    } catch (error) {
        alert('Erro ao exportar histórico: ' + error.message);
    }
}

function exportReport() {
    if (!checkPermission('canExport')) {
        alert('Você não tem permissão para exportar dados');
        return;
    }
    alert('📊 Funcionalidade de exportação PDF em desenvolvimento!');
}
