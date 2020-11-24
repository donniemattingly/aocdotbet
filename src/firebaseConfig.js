import firebase from "firebase";

const firebaseConfig = {
    apiKey: "AIzaSyAZ5A2WQtiDD0Me4MWLGcFlCa1CxUydJyQ",
    authDomain: "aocdotbet.firebaseapp.com",
    databaseURL: "https://aocdotbet.firebaseio.com",
    projectId: "aocdotbet",
    storageBucket: "aocdotbet.appspot.com",
    messagingSenderId: "169770916880",
    appId: "1:169770916880:web:d27b1c365cc8d31ed83e95"
};

firebase.initializeApp(firebaseConfig);

if (window.location.hostname === 'localhost') {
    console.log("testing locally -- hitting local functions and firestore emulators");
    firebase.functions().useEmulator('localhost', 5001);
    firebase.firestore().settings({
        host: 'localhost:8080',
        ssl: false
    });
}

