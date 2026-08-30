/* Horaires Rémi 45 — lignes 20A et 20B
 *
 * Sources de données (aucune clé d'API) :
 *   - data/horaires.json  : arrêts, départs et calendriers, extraits du GTFS ouvert
 *                           par build-horaires.py (le GTFS lui-même n'a pas d'en-tête
 *                           CORS, un navigateur ne peut donc pas le lire directement)
 *   - data.centrevaldeloire.fr : libellés et couleurs officiels des lignes
 *   - data.education.gouv.fr   : calendrier scolaire de la zone Orléans-Tours
 */

const CONFIG = {
  horaires: 'data/horaires.json',
  lignes: 'https://data.centrevaldeloire.fr/api/explore/v2.1/catalog/datasets/jvmalin_lignes/records'
        + '?limit=10&where=' + encodeURIComponent('route_short_name in ("20A","20B")'),
  vacances: 'https://data.education.gouv.fr/api/explore/v2.1/catalog/datasets/fr-en-calendrier-scolaire/records',
  arretParDefaut: 'Neuville-aux-Bois'
};

let REF = null;            // contenu de horaires.json
let currentArretId = null;
let map = null;
let userMarker = null;

/* ------------------------------------------------------------------ dates */

// "20260907" — format des calendriers GTFS
function ymd(d) {
  return String(d.getFullYear())
       + String(d.getMonth() + 1).padStart(2, '0')
       + String(d.getDate()).padStart(2, '0');
}

function hhmm(d) {
  return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
}

/* Un service GTFS circule-t-il à cette date ?
 * calendar_dates.txt prime sur calendar.txt : une exception ajoute (add) ou
 * retire (rem) une date, indépendamment du motif hebdomadaire. */
function serviceActif(serviceId, jour, jourSemaine) {
  const s = REF.services[serviceId];
  if (!s) return false;
  if (s.rem.includes(jour)) return false;
  if (s.add.includes(jour)) return true;
  if (jour < s.d1 || jour > s.d2) return false;
  // s.j est ordonné lundi→dimanche, getDay() renvoie 0 pour dimanche
  return s.j[(jourSemaine + 6) % 7] === '1';
}

/* Départs réellement assurés à cet arrêt ce jour-là, triés et dédoublonnés.
 * Un même départ peut être déclaré sous plusieurs service_id (périodes qui se
 * recouvrent) : on ne le compte qu'une fois. */
function departsDuJour(arret, date) {
  const jour = ymd(date), dow = date.getDay();
  const vus = new Set();
  return arret.departs
    .filter(d => serviceActif(d.s, jour, dow))
    .filter(d => {
      const cle = d.h + d.l + d.dest;
      if (vus.has(cle)) return false;
      vus.add(cle);
      return true;
    })
    .sort((a, b) => a.h.localeCompare(b.h));
}

/* ----------------------------------------------------------------- rendus */

function nomArret(a) {
  return a.commune ? `${a.commune.toUpperCase()} — ${a.nom}` : a.nom;
}

function badge(ligne) {
  const couleur = (REF.lignes[ligne] && REF.lignes[ligne].couleur) || '#3182ce';
  return `<span class="badge" style="background:${couleur}">${ligne}</span>`;
}

function renderTabs() {
  const tabs = document.getElementById('tabs');
  if (!tabs) return;
  tabs.innerHTML = REF.arrets.map(a =>
    `<button class="tab-btn ${a.id === currentArretId ? 'active' : ''}" data-arret="${a.id}">`
    + `${nomArret(a)}</button>`
  ).join('');
}

function selectArret(arretId) {
  currentArretId = arretId;
  renderTabs();
  filterHoraires();
}

function filterHoraires() {
  const conteneur = document.getElementById('table-container');
  if (!REF) return;
  const arret = REF.arrets.find(a => a.id === currentArretId);
  if (!arret) return;

  const recherche = (document.getElementById('search-destination').value || '').toLowerCase().trim();
  const departs = departsDuJour(arret, new Date())
    .filter(d => d.dest.toLowerCase().includes(recherche));

  if (departs.length === 0) {
    conteneur.innerHTML = '<div class="no-result">Aucun départ aujourd\'hui depuis cet arrêt'
      + (recherche ? ' vers cette destination.' : '.') + '</div>';
    return;
  }

  conteneur.innerHTML = `
    <table>
      <thead>
        <tr><th>Départ</th><th>Arrivée</th><th>Ligne</th><th>Destination</th></tr>
      </thead>
      <tbody>
        ${departs.map(d => `
          <tr>
            <td><b>${d.h}</b></td>
            <td>${d.arr}</td>
            <td>${badge(d.l)}</td>
            <td>${d.dest}</td>
          </tr>`).join('')}
      </tbody>
    </table>`;
}

/* --------------------------------------------------------------- carte GPS */

function initCarte() {
  const el = document.getElementById('map');
  if (!el || typeof L === 'undefined') return;
  map = L.map('map').setView([48.0, 2.0], 10);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
  }).addTo(map);
  REF.arrets.forEach(a => {
    L.marker([a.lat, a.lng]).addTo(map).bindPopup(`<b>${nomArret(a)}</b>`);
  });
}

function calcDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2
          + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function findNextBus(userLat, userLng) {
  const resultat = document.getElementById('bus-result');
  const now = new Date();

  if (!REF || !REF.arrets || REF.arrets.length === 0) return;

  let arretProche = REF.arrets[0];
  let distMin = Infinity;
  REF.arrets.forEach(a => {
    const d = calcDistance(userLat, userLng, a.lat, a.lng);
    if (d < distMin) { distMin = d; arretProche = a; }
  });

  const maintenant = hhmm(now);
  const prochain = departsDuJour(arretProche, now).find(d => d.h >= maintenant);

  if (prochain) {
    resultat.innerHTML = `Prochain départ ${badge(prochain.l)} de `
      + `<b>${nomArret(arretProche)}</b> à <b>${prochain.h}</b>, `
      + `arrivée à <b>${prochain.dest}</b> à <b>${prochain.arr}</b>.`
      + `<br><small>Arrêt à ${distMin.toFixed(1)} km de vous.</small>`;
  } else {
    resultat.innerHTML = `Plus aucun départ aujourd'hui depuis <b>${nomArret(arretProche)}</b>.`;
  }

  selectArret(arretProche.id);
}

/* ------------------------------------------------------- bandeau vacances */

/* Purement informatif : la circulation réelle vient des calendriers GTFS,
 * qui distinguent déjà période scolaire, mercredi, samedi et vacances. */
async function afficherPeriode() {
  const box = document.getElementById('status-box');
  const jour = new Date().toISOString().split('T')[0];
  const url = CONFIG.vacances + '?limit=1&where='
    + encodeURIComponent(`location="Orléans-Tours" and start_date<="${jour}" and end_date>="${jour}"`);
  try {
    const res = await fetch(url);
    const data = await res.json();
    const enVacances = data.total_count > 0;
    box.className = enVacances ? 'vacances' : 'scolaire';
    box.innerText = enVacances
      ? '🏖️ Vacances scolaires — offre réduite'
      : '🏫 Période scolaire';
  } catch (e) {
    box.className = 'scolaire';
    box.innerText = 'Calendrier scolaire indisponible';
  }
}

/* Complète le JSON avec les libellés et couleurs à jour du référentiel régional.
 * Échec sans conséquence : les valeurs figées dans horaires.json prennent le relais. */
async function rafraichirLignes() {
  try {
    const res = await fetch(CONFIG.lignes);
    const data = await res.json();
    data.results.forEach(r => {
      REF.lignes[r.route_short_name] = {
        route_id: r.route_id,
        nom: r.route_long_name,
        couleur: '#' + (r.route_color || '3182ce').replace('#', '')
      };
    });
  } catch (e) {
    /* on garde ce qui est dans horaires.json */
  }
}

/* --------------------------------------------------------------- démarrage */

function brancherEvenements() {
  document.getElementById('tabs').addEventListener('click', e => {
    const btn = e.target.closest('[data-arret]');
    if (btn) selectArret(btn.dataset.arret);
  });
  document.getElementById('search-destination')
    .addEventListener('input', filterHoraires);
}

async function init() {
  if (new URLSearchParams(window.location.search).get('mode') === 'widget') {
    document.body.classList.add('widget-mode');
  }

  const resultat = document.getElementById('bus-result');

  try {
    const res = await fetch(CONFIG.horaires, { cache: 'no-cache' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    REF = await res.json();
  } catch (e) {
    const box = document.getElementById('status-box');
    box.className = 'error';
    box.innerText = 'Horaires indisponibles';
    resultat.innerHTML = `Impossible de charger <code>${CONFIG.horaires}</code> (${e.message}). `
      + 'Relancez <code>build-horaires.py</code> puis publiez le fichier généré.';
    return;
  }

  await rafraichirLignes();

  const defaut = REF.arrets.find(a => a.commune === CONFIG.arretParDefaut) || REF.arrets[0];
  if (defaut) {
    currentArretId = defaut.id;
  }

  brancherEvenements();
  initCarte();
  if (defaut) {
    selectArret(defaut.id);
  }
  afficherPeriode();

  if (defaut) {
    const prochain = departsDuJour(defaut, new Date()).find(d => d.h >= hhmm(new Date()));
    resultat.innerHTML = prochain
      ? `Prochain départ ${badge(prochain.l)} de <b>${nomArret(defaut)}</b> à <b>${prochain.h}</b>.`
        + '<br><small>Activez la géolocalisation pour l\'arrêt le plus proche.</small>'
      : 'Recherche de l\'arrêt le plus proche…';
  }

  if ('geolocation' in navigator) {
    navigator.geolocation.watchPosition(
      pos => {
        const la = pos.coords.latitude, lo = pos.coords.longitude;
        if (map) {
          if (userMarker) userMarker.setLatLng([la, lo]);
          else userMarker = L.circleMarker([la, lo], { color: 'red', radius: 8 })
                             .addTo(map).bindPopup('Vous êtes ici');
          map.setView([la, lo], 12);
        }
        findNextBus(la, lo);
      },
      () => {
        resultat.innerHTML += '<br><small>Géolocalisation refusée : arrêt par défaut affiché.</small>';
      },
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
    );

    setInterval(() => {
      navigator.geolocation.getCurrentPosition(p =>
        findNextBus(p.coords.latitude, p.coords.longitude));
    }, 60000);
  }
}

init();