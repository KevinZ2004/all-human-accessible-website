// 1. DATA: pas hier de locaties en planten aan
//    lat/lng = positie van het stipje op de kaart
//
//    Wil je de posities aanpassen? Open de pagina met ?plaatsen achter de URL,
//    sleep de stipjes en kopieer de coördinaten uit het witte vak hierheen.

const locaties = [
    {
        id: 'bij-de-kas',
        naam: 'Bij De Kas',
        intro: 'Een warme, beschutte plek met kruiden en snijbloemen.',
        lat: 52.35206,
        lng: 4.93111,
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
        lat: 52.35184,
        lng: 4.93101,
        planten: [
            { naam: 'Gele lis', latijn: 'Iris pseudacorus', info: 'Bloeit mei – juni, geel', foto: '' },
            { naam: 'Moerasspirea', latijn: 'Filipendula ulmaria', info: 'Bloeit juni – augustus, crèmewit', foto: '' }
        ]
    },
    {
        id: 'bij-de-heuvel',
        naam: 'Bij de heuvel',
        intro: 'Wilde bloemen en bijenplanten in het open grasland.',
        lat: 52.35174,
        lng: 4.93065,
        planten: [
            { naam: 'Klaproos', latijn: 'Papaver rhoeas', info: 'Bloeit mei – juli, rood', foto: '' },
            { naam: 'Korenbloem', latijn: 'Centaurea cyanus', info: 'Bloeit juni – september, blauw', foto: '' },
            { naam: 'Margriet', latijn: 'Leucanthemum vulgare', info: 'Bloeit mei – september, wit', foto: '' },
            { naam: 'Wilde cichorei', latijn: 'Cichorium intybus', info: 'Bloeit juli – oktober, lichtblauw', foto: '' }
        ]
    }
];


// 2. KAART

const kaart = L.map('kaart', { scrollWheelZoom: true }).setView([52.35193, 4.93121], 19);

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

    if (locatie.planten.length === 0) {
        const leeg = document.createElement('li');
        leeg.textContent = 'Voor deze plek is nog geen collectie toegevoegd.';
        lijst.appendChild(leeg);
    }

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

// Schuif de kaart zo dat het stipje niet achter het paneel verdwijnt:
// op mobiel (paneel onderaan) komt het stipje bovenin,
// op desktop (paneel rechts, 380px breed) in het midden van de vrije ruimte.
function centreerOp(locatie) {
    const mobiel = window.matchMedia('(max-width: 700px)').matches;
    const grootte = kaart.getSize();
    const doel = mobiel
        ? L.point(grootte.x / 2, grootte.y * 0.3)
        : L.point((grootte.x - 380) / 2, grootte.y / 2);
    const nu = kaart.latLngToContainerPoint([locatie.lat, locatie.lng]);
    kaart.panBy(nu.subtract(doel), { animate: true });
}


// 4. MARKERS

const markers = [];

locaties.forEach(locatie => {
    const marker = L.marker([locatie.lat, locatie.lng], {
        icon: stipIcoon,
        title: `${locatie.naam}: bekijk de collectie`,
        alt: `${locatie.naam}: bekijk de collectie`,
        keyboard: true
    }).addTo(kaart);

    marker.on('click', () => {
        toonCollectie(locatie, marker.getElement());
        centreerOp(locatie);
    });

    markers.push({ marker, locatie });
});

// Klik op de lege kaart sluit het paneel
kaart.on('click', () => { if (!paneel.hidden) sluitCollectie(); });


// 5. PLAATSMODUS: open de pagina met ?plaatsen achter de URL
//    Sleep de stipjes naar de juiste plek; de coördinaten staan in het witte vak.

if (new URLSearchParams(location.search).has('plaatsen')) {
    const uitvoer = document.createElement('pre');
    uitvoer.style.cssText = 'position:fixed;left:8px;right:8px;bottom:100px;z-index:10000;' +
        'max-height:30vh;overflow:auto;margin:0;padding:10px;background:#fff;color:#243b2a;' +
        'border:2px solid #243b2a;border-radius:8px;font-size:12px;line-height:1.5;';
    document.body.appendChild(uitvoer);

    const toonPosities = () => {
        uitvoer.textContent = 'Sleep de stipjes. Kopieer de waarden naar veldverkenner.js:\n\n' +
            locaties.map(l => `${l.naam}\n  lat: ${l.lat.toFixed(5)},\n  lng: ${l.lng.toFixed(5)},`).join('\n\n');
    };

    markers.forEach(({ marker, locatie }) => {
        marker.dragging.enable();
        marker.on('dragend', () => {
            const punt = marker.getLatLng();
            locatie.lat = punt.lat;
            locatie.lng = punt.lng;
            toonPosities();
        });
    });

    toonPosities();
}