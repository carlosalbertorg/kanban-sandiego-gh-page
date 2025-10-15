// Configuração do Firebase
const firebaseConfig = {
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
    if (!firebase.apps.length) {
        app = firebase.initializeApp(firebaseConfig);
    } else {
        app = firebase.app();
    }
    db = firebase.firestore();
    auth = firebase.auth();
    console.log('Firebase inicializado com sucesso!');
} catch (error) {
    console.error('Erro ao inicializar Firebase:', error);
}
