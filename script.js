//0 = Dimanche, 1 = Lundi, 2 = Mardi, 3 = Mercredi, 4 = Jeudi, 5 = Vendredi, 6 = Samedi
function renderTabs() {
  const tabsContainer = document.getElementById('tabs');
  if (!tabsContainer) return;
  
  let html = '';
  DATA.arrets.forEach(arret => {
    const activeClass = arret.id === currentArretId ? 'active' : '';
    html += `<button class="tab-btn ${activeClass}" onclick="selectArret('${arret.id}')">${arret.nom}</button>`;
  });
  tabsContainer.innerHTML = html;
}

// 0. Détection du Mode Widget dans l'URL (?mode=widget)
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('mode') === 'widget') {
document.body.classList.add('widget-mode');
}

let currentArretId = "orleans_gare";
let userMarker = null;

// 1. Données complètes
const DATA = {
arrets: [
    {
    id: "orleans_gare",
    nom: "ORLÉANS - Gare Routière",
    lat: 47.90875838982201, lng: 1.9076689955929347,
    horaires: [
        {depart: "06:25", arrivee: "06:57", ligne: "20a", car: "Car 2", dest: "NEUVILLE (Stade)", jours: [1, 2, 3, 4, 5]},
        {depart: "11:08", arrivee: "11:38", ligne: "20a", car: "Car 10", dest: "NEUVILLE (Stade)", jours: [1, 2, 3, 4, 5]},
        {depart: "11:40", arrivee: "12:11", ligne: "20a", car: "Car 14", dest: "NEUVILLE (Stade)", jours: [3]},
        {depart: "12:28", arrivee: "13:02", ligne: "20a", car: "Car 16", dest: "NEUVILLE (Stade)", jours: [1, 2, 3, 4, 5]},
        {depart: "12:28", arrivee: "13:02", ligne: "20a", car: "Car 216", dest: "NEUVILLE (Stade)", jours: [3]},
        {depart: "13:10", arrivee: "13:42", ligne: "20a", car: "Car 18", dest: "NEUVILLE (Stade)", jours: [3]},
        {depart: "15:00", arrivee: "15:31", ligne: "20a", car: "Car 20", dest: "NEUVILLE (Stade)", jours: [1, 2, 3, 4, 5]},
        {depart: "16:05", arrivee: "16:36", ligne: "20a", car: "Car 22", dest: "NEUVILLE (Stade)", jours: [1, 2, 3, 4, 5]},
        {depart: "16:05", arrivee: "16:36", ligne: "20a", car: "Car 222", dest: "NEUVILLE (Stade)", jours: [1, 2, 3, 4, 5]},
        {depart: "17:20", arrivee: "17:58", ligne: "20a", car: "Car 26", dest: "NEUVILLE (Stade)", jours: [1, 2, 3, 4, 5]},
        {depart: "17:20", arrivee: "17:58", ligne: "20a", car: "Car 226", dest: "NEUVILLE (Stade)", jours: [1, 2, 3, 4, 5]},
        {depart: "18:05", arrivee: "18:40", ligne: "20a", car: "Car 32", dest: "NEUVILLE (Stade)", jours: [1, 2, 3, 4, 5]},
        {depart: "18:35", arrivee: "19:07", ligne: "20a", car: "Car 38", dest: "NEUVILLE (Stade)", jours: [1, 2, 3, 4, 5]},
        {depart: "19:25", arrivee: "19:55", ligne: "20a", car: "Car 40", dest: "NEUVILLE (Stade)", jours: [1, 2, 3, 4, 5]},
        {depart: "08:00", arrivee: "08:45", ligne: "20b", car: "Car 2", dest: "NEUVILLE (Stade)", jours: [1, 2, 3, 4, 5]},
        {depart: "12:25", arrivee: "13:13", ligne: "20b", car: "Car 4", dest: "NEUVILLE (Stade)", jours: [1, 2, 3, 4, 5]},
        {depart: "13:10", arrivee: "14:04", ligne: "20b", car: "Car 8", dest: "NEUVILLE (Stade)", jours: [3]},
        {depart: "16:20", arrivee: "17:07", ligne: "20b", car: "Car 12", dest: "NEUVILLE (Stade)", jours: [1, 2, 4, 5]},
        {depart: "18:05", arrivee: "19:02", ligne: "20b", car: "Car 20", dest: "NEUVILLE (Stade)", jours: [1, 2, 4, 5]},
        {depart: "18:35", arrivee: "19:24", ligne: "20b", car: "Car 22", dest: "NEUVILLE (Stade)", jours: [1, 2, 3, 4, 5]},
        {depart: "07:20", arrivee: "07:55", ligne: "20a", car: "Car 4", dest: "NEUVILLE (Rive du Bois)", jours: [1, 2, 3, 4, 5]},
        {depart: "08:00", arrivee: "08:42", ligne: "20b", car: "Car 2", dest: "NEUVILLE (Rive du Bois)", jours: [1, 2, 3, 4, 5]},
        {depart: "12:25", arrivee: "13:10", ligne: "20b", car: "Car 4", dest: "NEUVILLE (Rive du Bois)", jours: [1, 2, 3, 4, 5]},
        {depart: "13:10", arrivee: "14:02", ligne: "20b", car: "Car 8", dest: "NEUVILLE (Rive du Bois)", jours: [3]},
        {depart: "16:20", arrivee: "17:04", ligne: "20b", car: "Car 12", dest: "NEUVILLE (Rive du Bois)", jours: [1, 2, 4, 5]},
        {depart: "18:05", arrivee: "18:59", ligne: "20b", car: "Car 20", dest: "NEUVILLE (Rive du Bois)", jours: [1, 2, 4, 5]},
        {depart: "18:35", arrivee: "19:19", ligne: "20b", car: "Car 22", dest: "NEUVILLE (Rive du Bois)", jours: [1, 2, 3, 4, 5]},
        {depart: "08:00", arrivee: "08:36", ligne: "20b", car: "Car 2", dest: "LOURY (Place)", jours: [1, 2, 3, 4, 5]},
        {depart: "12:25", arrivee: "13:04", ligne: "20b", car: "Car 4", dest: "LOURY (Place)", jours: [1, 2, 3, 4, 5]},
        {depart: "13:10", arrivee: "13:55", ligne: "20b", car: "Car 8", dest: "LOURY (Place)", jours: [3]},
        {depart: "16:20", arrivee: "16:58", ligne: "20b", car: "Car 12", dest: "LOURY (Place)", jours: [1, 2, 4, 5]},
        {depart: "17:15", arrivee: "17:56", ligne: "20b", car: "Car 14", dest: "LOURY (Place)", jours: [1, 2, 3, 4, 5]},
        {depart: "18:05", arrivee: "18:51", ligne: "20b", car: "Car 20", dest: "LOURY (Place)", jours: [1, 2, 4, 5]},
        {depart: "18:35", arrivee: "19:14", ligne: "20b", car: "Car 22", dest: "LOURY (Place)", jours: [1, 2, 3, 4, 5]},
    ]
    },
    {
    id: "loury_eglise",
    nom: "LOURY - Place de l'Église",
    lat: 48.001396798227134, lng: 2.085724363211092,
    horaires: [
        {depart: "06:37", arrivee: "07:15", ligne: "20b", car: "Car 1", dest: "ORLÉANS Gare Routière", jours: [1, 2, 3, 4, 5]},
        {depart: "06:37", arrivee: "07:15", ligne: "20b", car: "Car 3", dest: "ORLÉANS Gare Routière", jours: [1, 2, 3, 4, 5]},
        {depart: "07:15", arrivee: "08:05", ligne: "20b", car: "Car 7", dest: "ORLÉANS Gare Routière", jours: [1, 2, 3, 4, 5]},
        {depart: "08:10", arrivee: "08:52", ligne: "20b", car: "Car 9", dest: "ORLÉANS Gare Routière", jours: [1, 2, 3, 4, 5]},
        {depart: "09:15", arrivee: "09:55", ligne: "20b", car: "Car 11", dest: "ORLÉANS Gare Routière", jours: [1, 2, 3, 4, 5]},
        {depart: "13:35", arrivee: "14:13", ligne: "20b", car: "Car 15", dest: "ORLÉANS Gare Routière", jours: [1, 2, 3, 4, 5]},
        {depart: "17:35", arrivee: "18:15", ligne: "20b", car: "Car 17", dest: "ORLÉANS Gare Routière", jours: [1, 2, 4, 5]},
    ]
    },
    {
    id: "neuville_stade",
    nom: "NEUVILLE - Stade",
    lat: 48.06788554307025, lng: 2.0480983930336536,
    horaires: [
        {depart: "06:25", arrivee: "07:15", ligne: "20b", car: "Car 1", dest: "ORLÉANS Gare Routière", jours: [1, 2, 3, 4, 5]},
        {depart: "06:25", arrivee: "07:15", ligne: "20b", car: "Car 3", dest: "ORLÉANS Gare Routière", jours: [1, 2, 3, 4, 5]},
        {depart: "07:05", arrivee: "08:05", ligne: "20b", car: "Car 7", dest: "ORLÉANS Gare Routière", jours: [1, 2, 3, 4, 5]},
        {depart: "09:05", arrivee: "09:55", ligne: "20b", car: "Car 11", dest: "ORLÉANS Gare Routière", jours: [1, 2, 3, 4, 5]},
        {depart: "13:23", arrivee: "14:13", ligne: "20b", car: "Car 15", dest: "ORLÉANS Gare Routière", jours: [1, 2, 3, 4, 5]},
        {depart: "17:25", arrivee: "18:15", ligne: "20b", car: "Car 17", dest: "ORLÉANS Gare Routière", jours: [1, 2, 4, 5]},
        {depart: "06:48", arrivee: "07:25", ligne: "20a", car: "Car 5", dest: "ORLÉANS Gare Routière", jours: [1, 2, 3, 4, 5]},
        {depart: "07:35", arrivee: "08:12", ligne: "20a", car: "Car 11", dest: "ORLÉANS Gare Routière", jours: [1, 2, 3, 4, 5]},
        {depart: "08:05", arrivee: "08:45", ligne: "20a", car: "Car ", dest: "ORLÉANS Gare Routière", jours: [1, 2, 3, 4, 5]},

        {depart: "06:25", arrivee: "07:12", ligne: "20b", car: "Car 5", dest: "ORLÉANS Gare Routière"},
        {depart: "06:25", arrivee: "07:15", ligne: "20b", car: "Car 7", dest: "ORLÉANS Gare Routière"},
        {depart: "06:48", arrivee: "07:22", ligne: "20a", car: "Car 1", dest: "ORLÉANS Gare Routière"},
        {depart: "07:00", arrivee: "07:35", ligne: "20a", car: "Car 3", dest: "ORLÉANS Gare Routière"},
        {depart: "07:05", arrivee: "07:55", ligne: "20b", car: "Car 9", dest: "ORLÉANS Gare Routière"},
        {depart: "07:35", arrivee: "08:15", ligne: "20a", car: "Car 5", dest: "ORLÉANS Gare Routière"},
        {depart: "10:45", arrivee: "11:32", ligne: "20b", car: "Car 15", dest: "ORLÉANS Gare Routière"},
        {depart: "12:57", arrivee: "13:30", ligne: "20a", car: "Car 7", dest: "ORLÉANS Gare Routière"},
        {depart: "13:57", arrivee: "14:30", ligne: "20a", car: "Car 11", dest: "ORLÉANS Gare Routière"},
        {depart: "14:07", arrivee: "14:40", ligne: "20a", car: "Car 13", dest: "ORLÉANS Gare Routière"},
        {depart: "16:51", arrivee: "17:25", ligne: "20a", car: "Car 17", dest: "ORLÉANS Gare Routière"},
        {depart: "17:18", arrivee: "18:12", ligne: "20b", car: "Car 17", dest: "ORLÉANS Gare Routière"},
        {depart: "18:15", arrivee: "18:50", ligne: "20a", car: "Car 19", dest: "ORLÉANS Gare Routière"}
    ]
    },
    {
    id: "neuville_rive",
    nom: "NEUVILLE - Rive du Bois",
    lat: 48.05272814506002, lng: 2.0557968977569936,
    horaires: [
        {depart: "06:29", arrivee: "07:12", ligne: "20b", car: "Car 5", dest: "ORLÉANS Gare Routière"},
        {depart: "06:29", arrivee: "07:15", ligne: "20b", car: "Car 7", dest: "ORLÉANS Gare Routière"},
        {depart: "07:08", arrivee: "07:55", ligne: "20b", car: "Car 9", dest: "ORLÉANS Gare Routière"},
        {depart: "07:55", arrivee: "08:30", ligne: "20a", car: "Car 3", dest: "ORLÉANS Gare Routière"},
        {depart: "10:48", arrivee: "11:32", ligne: "20b", car: "Car 15", dest: "ORLÉANS Gare Routière"},
        {depart: "17:29", arrivee: "18:12", ligne: "20b", car: "Car 17", dest: "ORLÉANS Gare Routière"}
    ]
    }
]
};

// 1bis. Tri des horaires par heure de départ.
// findNextBus() et filterHoraires() parcourent le tableau dans l'ordre :
// sans ce tri, le "prochain bus" renvoyé est le premier de la liste, pas le plus proche.
DATA.arrets.forEach(a => a.horaires.sort((x, y) => x.depart.localeCompare(y.depart)));


// 2. Initialisation Carte
const map = L.map('map').setView([48.0000, 2.0000], 10);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
attribution: '© OpenStreetMap'
}).addTo(map);

DATA.arrets.forEach(a => {
L.marker([a.lat, a.lng]).addTo(map).bindPopup(`<b>${a.nom}</b>`);
});

// 3. Distance GPS
function calcDistance(lat1, lon1, lat2, lon2) {
const R = 6371;
const dLat = (lat2 - lat1) * Math.PI / 180;
const dLon = (lon2 - lon1) * Math.PI / 180;
const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)));
}

// 4. API Vacances
async function checkVacances() {
const today = new Date().toISOString().split('T')[0];
const statusBox = document.getElementById('status-box');

try {
    const url = `https://data.education.gouv.fr/api/explore/v2.1/catalog/datasets/fr-en-calendrier-scolaire/records?where=location%3D%22Orl%C3%A9ans-Tours%22%20AND%20start_date%20%3C%3D%20%22${today}%22%20AND%20end_date%20%3E%3D%20%22${today}%22&limit=1`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.total_count > 0) {
    statusBox.className = "vacances";
    statusBox.innerText = "🏖️ Période de Vacances Scolaires";
    document.getElementById('bus-result').innerHTML = "<b>Profite de tes vacances !</b> Il n'y a pas de bus en circulation durant cette période.";
    return true;
    } else {
    statusBox.className = "scolaire";
    statusBox.innerText = "🏫 Période Scolaire";
    return false;
    }
} catch (e) {
    statusBox.className = "scolaire";
    statusBox.innerText = "🏫 Période Scolaire";
    return false;
}
}

// 5. Calcul du prochain bus
function findNextBus(userLat, userLng) {
const now = new Date();
const dayOfWeek = now.getDay(); // 0 = Dimanche, 6 = Samedi
const resultContainer = document.getElementById('bus-result');

// 1. Vérification du Week-end (Samedi = 6, Dimanche = 0)
if (dayOfWeek === 0 || dayOfWeek === 6) {
    resultContainer.innerHTML = "<b>C'est le week-end !</b> Les bus Rémi de cette ligne ne circulent pas aujourd'hui.";
    return;
}

let arretProche = DATA.arrets[0];
let distMin = calcDistance(userLat, userLng, DATA.arrets[0].lat, DATA.arrets[0].lng);

for (let i = 1; i < DATA.arrets.length; i++) {
    let d = calcDistance(userLat, userLng, DATA.arrets[i].lat, DATA.arrets[i].lng);
    if (d < distMin) {
    distMin = d;
    arretProche = DATA.arrets[i];
    }
}

const currentHM = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

// 2. Filtre : Heure supérieure À MAINTENANT + Le jour actuel doit être dans le tableau "jours"
const prochain = arretProche.horaires.find(h => {
    const rouleAujourdhui = !h.jours || h.jours.includes(dayOfWeek);
    return h.depart >= currentHM && rouleAujourdhui;
});

if (prochain) {
    const badgeClass = prochain.ligne === "20a" ? "badge-20a" : "badge-20b";
    resultContainer.innerHTML = `
    Le prochain bus <span class="${badgeClass}">Ligne ${prochain.ligne}</span> (${prochain.car}) 
    part de <b>"${arretProche.nom}"</b> à <b>${prochain.depart}</b> et arrive à <b>"${prochain.dest}"</b> à <b>${prochain.arrivee}</b>.
    `;
} else {
    resultContainer.innerHTML = `Plus aucun bus ne passe aujourd'hui à l'arrêt <b>"${arretProche.nom}"</b>.`;
}

selectArret(arretProche.id);
}
function selectArret(arretId) {
currentArretId = arretId;
renderTabs();
filterHoraires();
}

function filterHoraires() {
const arret = DATA.arrets.find(a => a.id === currentArretId);
const query = document.getElementById('search-destination').value.toLowerCase().trim();
const tableContainer = document.getElementById('table-container');
const dayOfWeek = new Date().getDay();

const horairesFiltres = arret.horaires.filter(h => {
    const matchDest = h.dest.toLowerCase().includes(query);
    const rouleAujourdhui = !h.jours || h.jours.includes(dayOfWeek);
    return matchDest && rouleAujourdhui;
});

if (horairesFiltres.length === 0 || dayOfWeek === 0 || dayOfWeek === 6) {
    tableContainer.innerHTML = `<div class="no-result">Aucun bus ne circule aujourd'hui pour cet arrêt/destination.</div>`;
    return;
}

let html = `
    <table>
    <thead>
        <tr>
        <th>Départ</th>
        <th>Arrivée</th>
        <th>Ligne</th>
        <th>Car</th>
        <th>Destination</th>
        </tr>
    </thead>
    <tbody>
`;

horairesFiltres.forEach(h => {
    const badgeClass = h.ligne === "20a" ? "badge-20a" : "badge-20b";
    html += `
    <tr>
        <td><b>${h.depart}</b></td>
        <td><b>${h.arrivee}</b></td>
        <td><span class="${badgeClass}">${h.ligne}</span></td>
        <td>${h.car}</td>
        <td>${h.dest}</td>
    </tr>
    `;
});

html += `</tbody></table>`;
tableContainer.innerHTML = html;
}

// 7. Initialisation & Suivi GPS Continu
async function init() {
selectArret(DATA.arrets[0].id);
const enVacances = await checkVacances();

if (!enVacances && "geolocation" in navigator) {
    // Suivi GPS dynamique en direct
    navigator.geolocation.watchPosition(
    (pos) => {
        const uLat = pos.coords.latitude;
        const uLng = pos.coords.longitude;
        
        if (userMarker) {
        userMarker.setLatLng([uLat, uLng]);
        } else {
        userMarker = L.circleMarker([uLat, uLng], {color: 'red', radius: 8}).addTo(map).bindPopup("Vous êtes ici");
        }
        
        map.setView([uLat, uLng], 12);
        findNextBus(uLat, uLng);
    },
    (err) => {
        document.getElementById('bus-result').innerText = "Activez la géolocalisation pour calculer l'arrêt le plus proche.";
    },
    { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
    );

    // Actualisation du calcul toutes les minutes
    setInterval(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
        findNextBus(pos.coords.latitude, pos.coords.longitude);
    });
    }, 60000);
}
}

init();