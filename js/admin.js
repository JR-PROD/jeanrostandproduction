console.log("🔥 admin.js chargé");

// ===============================
// IMPORTS FIREBASE
// ===============================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import {
    getFirestore,
    collection,
    getDocs,
    query,
    orderBy,
    updateDoc,
    doc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import {
    getAuth,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";


// ===============================
// EMAILJS
// ===============================

emailjs.init("fpQprPz2S7tsn9BLW");

async function envoyerEmailA(email, nom, message) {

    try {

        const response = await emailjs.send(
            "service_8if2e2f",
            "template_xtv7izk",
            {
                to_email: email,
                name: nom,
                message: message
            }
        );

        console.log("✅ Email envoyé :", response);

    } catch (error) {

        console.error("❌ Erreur EmailJS :", error);

    }

}

async function envoyerEmailR(email, nom, message) {

    try {

        const response = await emailjs.send(
            "service_8if2e2f",
            "template_krp6zce",
            {
                to_email: email,
                name: nom,
                message: message
            }
        );

        console.log("✅ Email envoyé :", response);

    } catch (error) {

        console.error("❌ Erreur EmailJS :", error);

    }

}


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
// INIT FIREBASE
// ===============================

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

console.log("🔥 Firebase admin OK");


// ===============================
// VARIABLES
// ===============================

const liste = document.getElementById("liste");
let dataGlobal = [];


// ===============================
// SECURITE ADMIN
// ===============================

onAuthStateChanged(auth, (user) => {

    if (!user) {
        window.location.href = "login.html";
    } else {
        load();
    }

});


// ===============================
// LOGOUT
// ===============================

document.getElementById("logoutBtn").addEventListener("click", async () => {

    await signOut(auth);
    window.location.href = "login.html";

});


// ===============================
// CHARGEMENT FIRESTORE
// ===============================

async function load() {

    console.log("📥 Load adhésions...");

    const snapshot = await getDocs(
    query(collection(db, "adhesions"), orderBy("date", "desc"))
);

    dataGlobal = [];

    snapshot.forEach(docSnap => {

    dataGlobal.push({
        id: docSnap.id,
        ...docSnap.data()
    });

});

// Trier du plus récent au plus ancien
dataGlobal.sort((a, b) => {
    return b.date.seconds - a.date.seconds;
});

    render(dataGlobal);
    updateStats();
}


// ===============================
// RENDER
// ===============================

function render(data) {

    liste.innerHTML = "";

    if (data.length === 0) {
        liste.innerHTML = "<p>Aucune adhésion.</p>";
        return;
    }

    data.forEach(membre => {

        const div = document.createElement("div");

        div.className = "row";

            div.innerHTML = `
                <div>
                    <strong>${membre.nom}</strong><br>
                    ${membre.option}<br>
                    ${membre.email}<br>
                    ${membre.adhesion}<br>
                    <b>${membre.statut}</b>
                </div>

                <div>
                    <button class="ok">✔</button>
                    <button class="no">✖</button>
                </div>
            `;

        div.querySelector(".ok").addEventListener("click", () => {
            console.log("✔ Bouton Accepter cliqué");
            setStatus(membre.id, "accepte");
        });

        div.querySelector(".no").addEventListener("click", () => {
            setStatus(membre.id, "refuse");
        });

        liste.appendChild(div);

    });
}


// ===============================
// UPDATE STATUS + EMAIL
// ===============================

async function setStatus(id, status) {

    const user = dataGlobal.find(u => u.id === id);

    await updateDoc(doc(db, "adhesions", id), {
        statut: status
    });

    if (status === "accepte") {
        await envoyerEmailA(user.email, user.nom, "Votre adhésion a été ACCEPTÉE ");
    }

    if (status === "refuse") {
        await envoyerEmailR(user.email, user.nom, "Votre adhésion a été REFUSÉE.");
    }

    load();
}


// ===============================
// STATS
// ===============================

function updateStats() {

    document.getElementById("total").textContent = dataGlobal.length;

    document.getElementById("attente").textContent =
        dataGlobal.filter(u => u.statut === "en_attente").length;

    document.getElementById("acceptes").textContent =
        dataGlobal.filter(u => u.statut === "accepte").length;
}
window.filter = function(type) {

    console.log("🔎 Filtre sélectionné :", type);

    let filteredData = [];

    if (type === "all") {
        filteredData = dataGlobal;
    } 
    else {
        filteredData = dataGlobal.filter(membre => {
            return membre.statut === type;
        });
    }

    render(filteredData);

    console.log("📊 Résultat filtre :", filteredData.length);
};