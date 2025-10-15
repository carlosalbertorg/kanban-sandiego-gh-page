// Sistema de autenticação e permissões
let currentUser = null;
let userRole = 'user';

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

// Observador de estado de autenticação
auth.onAuthStateChanged(async (user) => {
    if (user) {
        currentUser = user;
        await loadUserRole();
        showMainApp();
        initializeApp();
    } else {
        showLoginScreen();
    }
});

async function loadUserRole() {
    try {
        const userDoc = await db.collection('users').doc(currentUser.email).get();
        if (userDoc.exists) {
            const userData = userDoc.data();
            userRole = userData.role;
            if (!userData.isActive) {
                alert('Sua conta está desativada. Entre em contato com o administrador.');
                await logout();
                return;
            }
        } else {
            // Se não existe, criar como usuário comum
            userRole = 'user';
            await db.collection('users').doc(currentUser.email).set({
                email: currentUser.email,
                name: currentUser.email.split('@')[0],
                role: 'user',
                isActive: true,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                createdBy: 'system'
            });
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
    
    try {
        errorElement.style.display = 'none';
        await auth.signInWithEmailAndPassword(email, password);
    } catch (error) {
        errorElement.textContent = getAuthErrorMessage(error);
        errorElement.style.display = 'block';
    }
}

async function logout() {
    try {
        await auth.signOut();
    } catch (error) {
        console.error('Erro ao fazer logout:', error);
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
    maintenanceData = [];
    executionHistory = [];
    users = [];
    if (unsubscribe) unsubscribe();
    if (unsubscribeHistory) unsubscribeHistory();
    if (unsubscribeUsers) unsubscribeUsers();
}

function updatePermissions() {
    const addButton = document.getElementById('addButton');
    const actionButtons = document.querySelectorAll('.action-buttons');
    
    if (checkPermission('canAdd')) {
        addButton.style.display = 'block';
    } else {
        addButton.style.display = 'none';
    }
    
    // Mostrar/ocultar botões de ação baseado nas permissões
    actionButtons.forEach(buttonGroup => {
        if (!checkPermission('canEdit') && !checkPermission('canDelete')) {
            buttonGroup.style.display = 'none';
        }
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