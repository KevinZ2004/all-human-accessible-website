// 1. DATA: pas hier de locaties en planten aan
//    lat/lng = positie van het stipje op de kaart

const locaties = [
    {
        id: 'bij-de-kas',
        naam: 'Bij De Kas',
        intro: 'Een warme, beschutte plek met kruiden en snijbloemen.',
        lat: 52.3519,
        lng: 4.9319,
        planten: [
            { naam: 'Lavendel', latijn: 'Lavandula angustifolia', info: 'Bloeit juni – augustus, paars', foto: 'images/lavendel.jpg' },
            { naam: 'Zonnehoed', latijn: 'Echinacea purpurea', info: 'Bloeit juli – oktober, roze', foto: 'images/zonnehoed.jpg' },
            { naam: 'Rozemarijn', latijn: 'Salvia rosmarinus', info: 'Bloeit maart – mei, lichtblauw', foto: '' }
        ]
    },
    {
        id: 'bij-de-brug',
        naam: 'Bij de brug',
        intro: 'Vochtminnende planten langs het water.',
        lat: 52.3515,
        lng: 4.9315,
        planten: [
            { naam: 'Gele lis', latijn: 'Iris pseudacorus', info: 'Bloeit mei – juni, geel', foto: '' },
            { naam: 'Moerasspirea', latijn: 'Filipendula ulmaria', info: 'Bloeit juni – augustus, crèmewit', foto: '' }
        ]
    },
    {
        id: 'bij-de-heuvel',
        naam: 'Bij de heuvel',
        intro: 'Wilde bloemen en bijenplanten in het open grasland.',
        lat: 52.3512,
        lng: 4.9311,
        planten: [
            { naam: 'Klaproos', latijn: 'Papaver rhoeas', info: 'Bloeit mei – juli, rood', foto: '' },
            { naam: 'Korenbloem', latijn: 'Centaurea cyanus', info: 'Bloeit juni – september, blauw', foto: '' },
            { naam: 'Margriet', latijn: 'Leucanthemum vulgare', info: 'Bloeit mei – september, wit', foto: '' },
            { naam: 'Wilde cichorei', latijn: 'Cichorium intybus', info: 'Bloeit juli – oktober, lichtblauw', foto: '' }
        ]
    }
];


// 2. KAART

const kaart = L.map('kaart', { scrollWheelZoom: true }).setView([52.3516, 4.9314], 18);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(kaart);

// Stipje met bloemicoon 
const stipIcoon = L.divIcon({
    className: 'stip-wrapper',
    html: '<span class="stip"><img src="images/Collectie.svg" alt=""></span>',
    iconSize: [40, 48],
    iconAnchor: [20, 48]
});


// 3. PANEEL

const paneel = document.getElementById('collectie-paneel');
const titel = document.getElementById('paneel-titel');
const intro = document.getElementById('paneel-intro');
const lijst = document.getElementById('paneel-lijst');
const sluitKnop = paneel.querySelector('.paneel-sluit');
let laatsteStip = null;

function toonCollectie(locatie, stipElement) {
    laatsteStip = stipElement;
    titel.textContent = locatie.naam;
    intro.textContent = locatie.intro;
    lijst.replaceChildren();

    locatie.planten.forEach(plant => {
        const li = document.createElement('li');
        li.className = 'plant-kaart';

        if (plant.foto) {
            const img = document.createElement('img');
            img.src = plant.foto;
            img.alt = plant.naam;
            img.loading = 'lazy';
            li.appendChild(img);
        }

        const tekst = document.createElement('div');
        const h3 = document.createElement('h3');
        h3.textContent = plant.naam;
        const latijn = document.createElement('em');
        latijn.textContent = plant.latijn;
        const info = document.createElement('p');
        info.textContent = plant.info;
        tekst.append(h3, latijn, info);

        li.appendChild(tekst);
        lijst.appendChild(li);
    });

    paneel.hidden = false;
    paneel.scrollTop = 0;
    titel.focus();
}

function sluitCollectie() {
    paneel.hidden = true;
    if (laatsteStip) laatsteStip.focus();
}

sluitKnop.addEventListener('click', sluitCollectie);
document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !paneel.hidden) sluitCollectie();
});

// 4. MARKERS

locaties.forEach(locatie => {
    const marker = L.marker([locatie.lat, locatie.lng], {
        icon: stipIcoon,
        title: `${locatie.naam}: bekijk de collectie`,
        alt: `${locatie.naam}: bekijk de collectie`,
        keyboard: true
    }).addTo(kaart);

    marker.on('click', () => {
        toonCollectie(locatie, marker.getElement());
        kaart.panTo([locatie.lat, locatie.lng], { animate: true });
    });
});

kaart.on('click', () => { if (!paneel.hidden) sluitCollectie(); });