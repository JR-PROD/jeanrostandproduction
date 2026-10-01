console.log("🔥 app.js chargé");

// ===== IMPORT FIREBASE =====
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
    getFirestore, 
    collection, 
    addDoc 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// ===== CONFIG FIREBASE =====
const firebaseConfig = {
  apiKey: "AIzaSyApwn4g4RTimhEKl_P4B48XzxL26zWITZw",
  authDomain: "jr-prod-1b650.firebaseapp.com",
  projectId: "jr-prod-1b650",
  storageBucket: "jr-prod-1b650.appspot.com",
  messagingSenderId: "150688042339",
  appId: "1:150688042339:web:6891cfabfe20136b8b5756"
};

// ===== INITIALISATION =====
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ===== FORMULAIRE =====
window.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("formInscription");

    if (!form) {
        console.error("❌ Formulaire introuvable !");
        return;
    }

    console.log("✅ Formulaire détecté");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const choix = document.getElementById("typeAdhesion").value;
    const nom = document.getElementById("nom").value;
    const email = document.getElementById("email").value;
    const option = document.getElementById("option").value;

    console.log("Type de membre :", choix);
    console.log("📨 Envoi :", nom, email);

    if (!nom || !email || !choix || !option) {
        alert("Champs incomplets !");
        return;
    }

    try {
        const docRef = await addDoc(collection(db, "adhesions"), {
    nom: nom,
    email: email,
    adhesion: choix,
    option: option,
    statut: "en_attente",
    date: new Date()
});

        console.log("✅ Document créé :", docRef.id);

        alert("Demande envoyée! Dès validation du bureau, vous recevrez un Email pour finaliser votre adhésion.");
        form.reset();

    } catch (error) {
        console.error("❌ Erreur Firestore :", error);
        alert("Erreur lors de l'envoi");
    }
});

});





// ===== OPTIONS DE FORMULAIRE =====
const selectAdhesion = document.getElementById("typeAdhesion");
const descriptionAdhesion = document.getElementById("descriptionAdhesion");

selectAdhesion.addEventListener("change", function() {

    switch (this.value) {

        case "Membre Louer":
            descriptionAdhesion.innerHTML =
            "Cette adhésion vous permet d'accéder à la location de matériel audiovisuel à un prix avantageux chez Pictanovo. <br> Réservé aux étudiants du BTS Jean Rostand <br> PRIX D'ADHÉSION : à partir de 25€";
            break;

        case "Membre Actif":
            descriptionAdhesion.innerHTML =
            "Le membre actif peut participer aux projets et aux tournages. Il s'engage à être présent aux assemblées générales. <br> Nombre de membres actifs limité <br> Réservé aux étudiants du BTS Jean Rostand <br> PRIX D'ADHÉSION : 5€";
            break;

        case "Membre Adhérent":
            descriptionAdhesion.innerHTML =
            "Cette adhésion permet de soutenir et de participer au déroulement des événements de l'association Jean Rostand Production. Elle n'ouvre pas droit à la participation aux assemblées générales, ni l’accès au matériel de location. <br> PRIX D'ADHÉSION : libre";
            break;

        default:
            descriptionAdhesion.innerHTML ="";
    }

});