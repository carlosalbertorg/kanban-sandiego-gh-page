// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAPf7bQrWbO5g_YjU_rQbD4CZVI9VGrRAg", //não tem problema ser pública pois está restrita as configurações de domínio permitidos 
    authDomain: "sandiego-cronograma.firebaseapp.com",
    projectId: "sandiego-cronograma",
    storageBucket: "sandiego-cronograma.firebasestorage.app",
    messagingSenderId: "197734627891",
    appId: "1:197734627891:web:1fb88bb71715b3d60b0146",
    measurementId: "G-EWBB74TS37"
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
