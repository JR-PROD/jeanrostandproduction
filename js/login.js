import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import {
    getAuth,
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// ===============================
// CONFIG FIREBASE
// ===============================

const firebaseConfig = {
    apiKey: "AIzaSyApwn4g4RTimhEKl_P4B48XzxL26zWITZw",
    authDomain: "jr-prod-1b650.firebaseapp.com",
    projectId: "jr-prod-1b650",
    storageBucket: "jr-prod-1b650.firebasestorage.app",
    messagingSenderId: "150688042339",
    appId: "1:150688042339:web:6891cfabfe20136b8b5756"
};

// ===============================
// INITIALISATION
// ===============================

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

console.log("✅ Firebase Auth initialisé");

// ===============================
// ÉLÉMENTS HTML
// ===============================

const btn = document.getElementById("loginBtn");
const error = document.getElementById("error");

// ===============================
// CONNEXION
// ===============================

btn.addEventListener("click", async () => {

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    error.textContent = "";

    try {

        const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

        console.log("Connexion réussie :", userCredential.user.email);

        window.location.href = "admin.html";

    } catch (e) {

        console.error(e);

        // Affiche le vrai code d'erreur Firebase
        error.textContent = e.code;

    }

});