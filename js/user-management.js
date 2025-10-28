// Gerenciamento de usuários
var users = window.users ?? [];
var unsubscribeUsers = window.unsubscribeUsers ?? null;

function openUserManagement() {
    if (!checkPermission('canManageUsers')) {
        alert('Apenas administradores podem gerenciar usuários');
        return;
    }
    listenToUsers(); // garante atualização em tempo real
    loadUserManagement();
    document.getElementById('userManagementModal').style.display = 'flex';
}

function closeUserManagementModal() {
    document.getElementById('userManagementModal').style.display = 'none';
}

function openAddUserModal() {
    document.getElementById('addUserModalTitle').textContent = 'Adicionar Usuário';
    document.getElementById('editUserId').value = '';
    document.getElementById('addUserForm').reset();
    document.getElementById('passwordField').style.display = 'block';
    document.getElementById('addUserEmail').readOnly = false;
    document.getElementById('addUserModal').style.display = 'flex';
}

function closeAddUserModal() {
    document.getElementById('addUserModal').style.display = 'none';
}

function editUser(userEmail) {
    const user = users.find(u => u.email === userEmail);
    if (!user) return;
    
    document.getElementById('addUserModalTitle').textContent = 'Editar Usuário';
    document.getElementById('editUserId').value = user.email;
    document.getElementById('addUserEmail').value = user.email;
    document.getElementById('addUserName').value = user.name || '';
    document.getElementById('addUserRole').value = user.role;
    document.getElementById('passwordField').style.display = 'none';
    document.getElementById('addUserEmail').readOnly = true;
    document.getElementById('addUserModal').style.display = 'flex';
}

async function saveUser(event) {
    event.preventDefault();

    const userEmail = document.getElementById('addUserEmail').value.trim();
    const userName = document.getElementById('addUserName').value.trim();
    const userRole = document.getElementById('addUserRole').value;
    const userPassword = document.getElementById('addUserPassword').value;
    const editUserId = document.getElementById('editUserId').value;

    const authService = window.auth;
    const dbService = window.db;

    if (!dbService) {
        alert('Banco de dados não inicializado.');
        return;
    }

    try {
        if (!validateEmail(userEmail)) {
            alert('Email inválido');
            return;
        }

        if (editUserId) {
            await dbService.collection('users').doc(editUserId).update({
                name: userName,
                role: userRole
            });
        } else {
            if (!authService) {
                alert('Serviço de autenticação não inicializado.');
                return;
            }
            const userCredential = await authService.createUserWithEmailAndPassword(userEmail, userPassword);
            await dbService.collection('users').doc(userEmail).set({
                email: userEmail,
                name: userName,
                role: userRole,
                isActive: true,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                createdBy: currentUser?.email || 'system'
            });
        }

        closeAddUserModal();
        await loadUserManagement();
        window.users = users;
    } catch (error) {
        let message = 'Erro ao salvar usuário.';
        alert(message + '\n' + (error?.message || ''));
    }
}

function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

async function toggleUserStatus(userEmail, currentStatus) {
    if (userEmail === currentUser.email) {
        alert('Você não pode desativar sua própria conta');
        return;
    }

    const dbService = window.db;
    if (!dbService) {
        alert('Banco de dados não inicializado.');
        return;
    }

    if (confirm(`Tem certeza que deseja ${currentStatus ? 'desativar' : 'ativar'} este usuário?`)) {
        try {
            await dbService.collection('users').doc(userEmail).update({
                isActive: !currentStatus,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedBy: currentUser.email
            });
            alert(`✅ Usuário ${currentStatus ? 'desativado' : 'ativado'} com sucesso!`);
        } catch (error) {
            alert('Erro ao alterar status do usuário: ' + error.message);
        }
    }
}

async function loadUserManagement() {
    const dbService = window.db;
    if (!dbService) {
        console.warn('Banco de dados não inicializado. Abrindo lista vazia.');
        users = [];
        displayUserManagement();
        return;
    }
    try {
        const snapshot = await dbService.collection('users').get();
        users = [];
        snapshot.forEach(doc => {
            users.push({ id: doc.id, ...doc.data() });
        });
        displayUserManagement();
    } catch (error) {
        console.error('Erro ao carregar usuários:', error);
    }
}

function displayUserManagement() {
    const tbody = document.getElementById('userManagementTable');
    tbody.innerHTML = '';
    
    users.forEach(user => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${user.email}</td>
            <td>${user.name || '-'}</td>
            <td>
                <select onchange="updateUserRole('${user.email}', this.value)" 
                        ${user.email === currentUser.email ? 'disabled' : ''}>
                    <option value="user" ${user.role === 'user' ? 'selected' : ''}>Usuário</option>
                    <option value="supervisor" ${user.role === 'supervisor' ? 'selected' : ''}>Supervisor</option>
                    <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Administrador</option>
                </select>
            </td>
            <td>
                <span class="prioridade ${user.isActive ? 'baixa' : 'alta'}">
                    ${user.isActive ? 'Ativo' : 'Inativo'}
                </span>
            </td>
            <td>${user.createdAt ? user.createdAt.toDate().toLocaleDateString('pt-BR') : '-'}</td>
            <td class="action-buttons">
                <button class="btn" onclick="editUser('${user.email}')">✏️</button>
                <button class="btn btn-danger" onclick="toggleUserStatus('${user.email}', ${user.isActive})"
                        ${user.email === currentUser.email ? 'disabled' : ''}>
                    ${user.isActive ? 'Desativar' : 'Ativar'}
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

async function updateUserRole(userEmail, newRole) {
    if (userEmail === currentUser.email) {
        alert('Você não pode alterar sua própria função');
        return;
    }

    const dbService = window.db;
    if (!dbService) {
        alert('Banco de dados não inicializado.');
        return;
    }

    try {
        await dbService.collection('users').doc(userEmail).update({
            role: newRole,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedBy: currentUser.email
        });
    } catch (error) {
        alert('Erro ao atualizar função: ' + error.message);
    }
}

function listenToUsers() {
    const dbService = window.db;
    if (!dbService) return;

    unsubscribeUsers = dbService.collection('users').onSnapshot(async (snapshot) => {
        users = [];
        snapshot.forEach(doc => users.push(doc.data()));
        window.users = users;
        displayUserManagement();
    });
    window.unsubscribeUsers = unsubscribeUsers;
}
