// Aplicação principal - inicialização e funções gerais
function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    document.getElementById(tabName + 'Tab').classList.add('active');
    document.querySelector(`.tab[onclick="switchTab('${tabName}')"]`).classList.add('active');
    
    if (tabName === 'historico') {
        loadDailyHistory();
    } else if (tabName === 'relatorios') {
        const today = new Date().toISOString().split('T')[0];
        const firstDay = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
        document.getElementById('reportStartDate').value = firstDay;
        document.getElementById('reportEndDate').value = today;
    }
}

async function initializeApp() {
    try {
        await initializeFirebaseData();
        listenToChanges();
        listenToExecutionHistory();
        listenToUsers();
        document.getElementById('filterDate').value = new Date().toISOString().split('T')[0];
    } catch (error) {
        console.error('Erro ao inicializar aplicação:', error);
        updateConnectionStatus(false);
        maintenanceData = initialMaintenanceData.map((item, index) => ({
            id: 'local-' + index,
            ...item
        }));
        renderTable();
    }
}

// Fechar modais ao clicar fora
window.onclick = function(event) {
    const modals = ['itemModal', 'executionModal', 'userManagementModal', 'addUserModal'];
    modals.forEach(modalId => {
        const modal = document.getElementById(modalId);
        if (event.target === modal) {
            if (modalId === 'itemModal') closeModal();
            if (modalId === 'executionModal') closeExecutionModal();
            if (modalId === 'userManagementModal') closeUserManagementModal();
            if (modalId === 'addUserModal') closeAddUserModal();
        }
    });
};

// Inicializar a aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    console.log('Sistema de Manutenção - Carregado');
});