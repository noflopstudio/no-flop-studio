/* ==========================================
   CONFIGURATION & YELOX CORE FIXÉ
========================================== */

const API_URL = "https://yelox-core-backend.onrender.com";

/* ==========================================
   AUTHENTIFICATION
========================================== */

function seConnecter() {
    const email = document.getElementById('loginEmail');
    const pass = document.getElementById('loginPassword');

    if (!email || !pass) return;

    if (email.value && pass.value) {

        document.getElementById('login-section')?.classList.add('hidden');
        document.getElementById('noAuthMessage')?.classList.add('hidden');
        document.getElementById('protectedContent')?.classList.remove('hidden');

        const authText = document.getElementById('authButtonText');
        if (authText) authText.innerText = "Session Active";

        console.log("YELOX CORE déverrouillé.");
    } else {
        alert("Veuillez remplir tous les champs.");
    }
}

/* ==========================================
   MODE YELOX
========================================== */

function setMode(mode) {
    window.currentMode = mode;

    const rapide = document.getElementById("modeRapide");
    const detaille = document.getElementById("modeDetaille");

    if (mode === "rapide") {
        rapide?.classList.add("border-pink-500", "text-pink-400");
        detaille?.classList.remove("border-pink-500", "text-pink-400");
    } else {
        detaille?.classList.add("border-pink-500", "text-pink-400");
        rapide?.classList.remove("border-pink-500", "text-pink-400");
    }
}

/* ==========================================
   HISTORIQUE YELOX
========================================== */

function ajouterHistorique(user, ia) {
    const container = document.getElementById("historiqueContainer");
    if (!container) return;

    const item = document.createElement("div");
    item.className = "p-3 bg-black border border-gray-800 rounded-xl text-xs text-gray-400";

    item.innerHTML = `
        <p><strong>Vous :</strong> ${user}</p>
        <p class="text-pink-400"><strong>YELOX :</strong> ${ia}</p>
    `;

    container.prepend(item);
}

/* ==========================================
   API CHAT YELOX
========================================== */
async function envoyerRequeteComplete() {

    const input = document.getElementById('userInput');
    const output = document.getElementById('testOutput');
    const loader = document.getElementById('yeloxLoader');
    const resultContainer = document.getElementById('resultContainer');

    if (!input || !output || !loader) return;

    const message = input.value;

    if (!message.trim()) return;

    resultContainer?.classList.remove('hidden');
    loader.classList.remove('hidden');

    try {

        const res = await fetch(`${API_URL}/api/chat`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message,
                mode: window.currentMode || "rapide"
            })
        });

        const data = await res.json();

        output.innerText = data.reply;

        // 🔊 son YELOX
        jouerSonYelox();

        // 🎙️ lecture automatique
        lireReponseAuto(data.reply);

        // 💾 historique
        ajouterHistorique(message, data.reply);

    } catch (err) {

        console.error(err);

        output.innerText = "Erreur YELOX CORE";

    } finally {

        loader.classList.add('hidden');

    }
}

/* ==========================================
   VOIX IA YELOX CORE (FR + EN + 5 VOIX)
========================================== */

let voixActuelle = "auto";

/* ==========================================
   CHARGEMENT VOIX SAFE (MOBILE + PC)
========================================== */

function chargerVoix() {
    return new Promise(resolve => {

        let voices = window.speechSynthesis.getVoices();

        if (voices.length > 0) {
            resolve(voices);
            return;
        }

        const interval = setInterval(() => {
            voices = window.speechSynthesis.getVoices();

            if (voices.length > 0) {
                clearInterval(interval);
                resolve(voices);
            }
        }, 100);
    });
}

/* ==========================================
   ORGANISATION VOIX
========================================== */

async function obtenirVoix() {
    const voices = await chargerVoix();

    return {
        fr: voices.filter(v => v.lang && v.lang.includes("fr")),
        en: voices.filter(v => v.lang && v.lang.includes("en"))
    };
}

/* ==========================================
   LECTURE AUTO YELOX
========================================== */

async function lireReponseAuto(texte) {

    if (!texte) return;

    window.speechSynthesis.cancel();

    const voices = await obtenirVoix();

    const utterance = new SpeechSynthesisUtterance(texte);

    const mapVoix = {
        auto: voices.fr?.[0] || voices.en?.[0],

        fr1: voices.fr?.[0],
        fr2: voices.fr?.[1],
        fr3: voices.fr?.[2],
        fr4: voices.fr?.[3],
        fr5: voices.fr?.[4],

        en1: voices.en?.[0],
        en2: voices.en?.[1],
        en3: voices.en?.[2],
        en4: voices.en?.[3],
        en5: voices.en?.[4]
    };

    const voix = mapVoix[voixActuelle] || mapVoix.auto;

    if (voix) {
        utterance.voice = voix;
        utterance.lang = voix.lang || "fr-FR";
    } else {
        utterance.lang = "fr-FR";
    }

    utterance.rate = 1;
    utterance.pitch = 1;

    utterance.onstart = () => {
        console.log("🎙️ YELOX lecture start");
    };

    utterance.onend = () => {
        console.log("✅ YELOX lecture end");
    };

    window.speechSynthesis.speak(utterance);
}


/* ==========================================
   LECTURE MANUELLE
========================================== */

function lireReponse(type = "auto") {

    voixActuelle = type;

    const texte = document.getElementById("testOutput");

    if (!texte || !texte.innerText.trim()) return;

    lireReponseAuto(texte.innerText);
}

/* ==========================================
   SON YELOX
========================================== */

function jouerSonYelox() {

    const audio = new Audio("https://www.myinstants.com/media/sounds/success.mp3");

    audio.volume = 0.3;

    audio.play();
}