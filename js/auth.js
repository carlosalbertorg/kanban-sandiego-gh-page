// Sistema de autenticação e permissões
var currentUser = window.currentUser ?? null;
var userRole = window.userRole ?? 'user';

// Sistema de permissões
const permissions = {
    user: {
        canView: true,
        canEdit: false,
        canAdd: false,
        canDelete: false,
        canManageUsers: false,
        canExport: true
    },
    supervisor: {
        canView: true,
        canEdit: true,
        canAdd: true,
        canDelete: false,
        canManageUsers: false,
        canExport: true
    },
    admin: {
        canView: true,
        canEdit: true,
        canAdd: true,
        canDelete: true,
        canManageUsers: true,
        canExport: true
    }
};

function checkPermission(action) {
    return permissions[userRole] && permissions[userRole][action];
}

// Observador de estado de autenticação (com guard e retry)
function attachAuthListener() {
    const authService = window.auth;
    if (!authService) {
        console.warn('Firebase Auth não inicializado. Aguardando...');
        return false;
    }
    authService.onAuthStateChanged(async (user) => {
        if (user) {
            currentUser = user;
            window.currentUser = currentUser;

            await loadUserRole();
            window.userRole = userRole;

            showMainApp();
            initializeApp();
        } else {
            currentUser = null;
            window.currentUser = null;
            showLoginScreen();
        }
    });
    return true;
}
if (!attachAuthListener()) {
    const retry = setInterval(() => {
        if (attachAuthListener()) clearInterval(retry);
    }, 200);
}

async function loadUserRole() {
    try {
        const dbService = window.db;
        if (!dbService || !currentUser?.email) return;

        const userDoc = await dbService.collection('users').doc(currentUser.email).get();
        const userData = userDoc.data();

        if (userData?.role) {
            userRole = userData.role;
        } else {
            userRole = 'user';
            await dbService.collection('users').doc(currentUser.email).set({
                email: currentUser.email,
                name: currentUser.displayName || currentUser.email.split('@')[0],
                role: 'user',
                isActive: true,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                createdBy: 'system'
            }, { merge: true });
        }
    } catch (error) {
        console.error('Erro ao carregar role do usuário:', error);
        userRole = 'user';
    }
}

async function login(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const errorElement = document.getElementById('loginError');

    const authService = window.auth;
    if (!authService) {
        errorElement.textContent = 'Serviço de autenticação não inicializado. Aguarde alguns segundos e tente novamente.';
        errorElement.style.display = 'block';
        return;
    }

    try {
        errorElement.style.display = 'none';
        await authService.signInWithEmailAndPassword(email, password);
    } catch (error) {
        errorElement.textContent = getAuthErrorMessage(error);
        errorElement.style.display = 'block';
    }
}

async function logout() {
    try {
        const authService = window.auth;
        if (!authService) {
            alert('Serviço de autenticação não inicializado.');
            return;
        }
        await authService.signOut();
        currentUser = null;
        window.currentUser = null;
        console.log('Logout realizado com sucesso');
        showLoginScreen();
    } catch (error) {
        alert('Erro ao sair: ' + getAuthErrorMessage(error));
    }
}

function showMainApp() {
    document.getElementById('loginContainer').style.display = 'none';
    document.getElementById('mainContainer').style.display = 'block';
    document.getElementById('userEmail').textContent = currentUser.email;
    document.getElementById('userRole').textContent = getRoleDisplayName(userRole);
    
    // Mostrar botão de gerenciamento de usuários apenas para admins
    if (checkPermission('canManageUsers')) {
        document.getElementById('userManagementBtn').style.display = 'block';
    }
    
    updatePermissions();
}

function showLoginScreen() {
    document.getElementById('loginContainer').style.display = 'flex';
    document.getElementById('mainContainer').style.display = 'none';

    // Limpa dados locais
    maintenanceData = [];
    executionHistory = [];
    users = [];

    // Blindagem: desinscrever listeners se existirem
    try {
        const unsub = window.unsubscribe;
        const unsubHistory = window.unsubscribeHistory;
        const unsubUsers = window.unsubscribeUsers;

        if (typeof unsub === 'function') unsub();
        if (typeof unsubHistory === 'function') unsubHistory();
        if (typeof unsubUsers === 'function') unsubUsers();
    } catch (e) {
        console.warn('Falha ao limpar subscriptions:', e);
    }
}

function updatePermissions() {
    const addButton = document.getElementById('addButton');
    const actionButtons = document.querySelectorAll('.action-buttons');

    // Só altera se o elemento existir
    if (addButton) {
        addButton.style.display = checkPermission('canAdd') ? 'block' : 'none';
    }

    // Mostra/oculta grupos de ação conforme permissões
    actionButtons.forEach(group => {
        const canShow = checkPermission('canEdit') || checkPermission('canDelete');
        group.style.display = canShow ? 'flex' : 'none';
    });
}

function getRoleDisplayName(role) {
    const names = {
        'user': 'Usuário',
        'supervisor': 'Supervisor',
        'admin': 'Administrador'
    };
    return names[role] || role;
}

function getAuthErrorMessage(error) {
    switch (error.code) {
        case 'auth/invalid-email': return 'Email inválido';
        case 'auth/user-disabled': return 'Esta conta foi desativada';
        case 'auth/user-not-found': return 'Usuário não encontrado';
        case 'auth/wrong-password': return 'Senha incorreta';
        case 'auth/network-request-failed': return 'Erro de conexão. Verifique sua internet';
        default: return 'Erro: ' + error.message;
    }
}
