// Aplicação principal - inicialização e funções gerais
function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab').forEach(tab => {
        const isActive = tab.textContent.includes(tabName === 'manutencao' ? 'Manutenção' : tabName === 'historico' ? 'Histórico' : 'Relatórios');
        tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
    
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

// Detecção de dispositivo e navegação por teclado nos tabs + alto contraste
document.addEventListener('DOMContentLoaded', () => {
    const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
    const isSmallScreen = window.matchMedia('(max-width: 768px)').matches;
    document.body.classList.toggle('is-mobile', isCoarsePointer || isSmallScreen);
    document.body.classList.toggle('is-desktop', !isCoarsePointer && !isSmallScreen);

    const tabs = Array.from(document.querySelectorAll('.tab'));
    tabs.forEach(tab => {
        tab.addEventListener('keydown', (e) => {
            const idx = tabs.indexOf(tab);
            if (e.key === 'ArrowRight') {
                e.preventDefault();
                tabs[Math.min(idx + 1, tabs.length - 1)].focus();
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                tabs[Math.max(idx - 1, 0)].focus();
            } else if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                tab.click();
            }
        });
    });
});

// Alternar modo de alto contraste (acessibilidade)
function toggleHighContrast() {
    const current = document.body.getAttribute('data-theme');
    const next = current === 'high-contrast' ? null : 'high-contrast';
    if (next) {
        document.body.setAttribute('data-theme', next);
    } else {
        document.body.removeAttribute('data-theme');
    }
    const btn = document.querySelector('button[onclick="toggleHighContrast()"]');
    if (btn) btn.setAttribute('aria-pressed', next ? 'true' : 'false');
}