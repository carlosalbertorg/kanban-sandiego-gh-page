// Aplicação principal - inicialização e funções gerais
function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    document.getElementById(tabName + 'Tab').classList.add('active');
    document.querySelector(`.tab[onclick="switchTab('${tabName}')"]`).classList.add('active');
    
    // Initialize specific modules when their tabs are activated
    if (tabName === 'dashboard') {
        initializeDashboard();
    } else if (tabName === 'projetos') {
        initializeProjects();
    } else if (tabName === 'tarefas') {
        initializeTasks();
    } else if (tabName === 'kanban') {
        initializeKanban();
    } else if (tabName === 'gantt') {
        initializeGantt();
    } else if (tabName === 'tempo') {
        initializeTimeTracking();
    }
}

async function initializeApp() {
    try {
        // Initialize project management data
        initializeProjects();
        initializeTasks();
        initializeDashboard();
        
        console.log('Sistema de Gerenciamento de Projetos - Inicializado');
    } catch (error) {
        console.error('Erro ao inicializar aplicação:', error);
    }
}

// Fechar modais ao clicar fora
window.onclick = function(event) {
    const modals = ['projectModal', 'taskModal', 'timeModal', 'userManagementModal', 'addUserModal'];
    modals.forEach(modalId => {
        const modal = document.getElementById(modalId);
        if (event.target === modal) {
            if (modalId === 'projectModal') closeProjectModal();
            if (modalId === 'taskModal') closeTaskModal();
            if (modalId === 'timeModal') closeTimeModal();
            if (modalId === 'userManagementModal') closeUserManagementModal();
            if (modalId === 'addUserModal') closeAddUserModal();
        }
    });
};

// Inicializar a aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    console.log('Sistema de Gerenciamento de Projetos - Carregado');
    initializeApp();
});