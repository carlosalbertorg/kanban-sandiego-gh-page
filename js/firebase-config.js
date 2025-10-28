// Configuração do Firebase
window.firebaseConfig = window.firebaseConfig || {
    apiKey: "AIzaSyAuJqGE81FedUn6-LCHHFCTzQV2nELPiIU",
    authDomain: "kanban-sandiego.firebaseapp.com",
    projectId: "kanban-sandiego",
    storageBucket: "kanban-sandiego.firebasestorage.app",
    messagingSenderId: "820768506933",
    appId: "1:820768506933:web:4c09eceeb48e0b920add7c"
};

// Inicialização do Firebase
let app, db, auth;

try {
    // Inicializa apenas uma vez
    if (!window.app) {
        if (!firebase.apps.length) {
            window.app = firebase.initializeApp(window.firebaseConfig);
        } else {
            window.app = firebase.app();
        }
        console.log('Firebase inicializado com sucesso!');
    } else {
        console.log('Firebase já inicializado.');
    }

    // Garante serviços globais
    window.db = firebase.firestore();
    window.auth = firebase.auth();
} catch (error) {
    console.error('Erro ao inicializar Firebase:', error);
}
