// 1. DATA: pas hier de locaties en planten aan
//    lat/lng = positie van het stipje op de kaart
//
//    Wil je de posities aanpassen? Open de pagina met ?plaatsen achter de URL,
//    sleep de stipjes en kopieer de coördinaten uit het witte vak hierheen.

const locaties = [
    {
        id: 'Voedseleiland 1',
        naam: 'Voedseleiland 1',
        lat: 52.35206,
        lng: 4.93111,
        planten: [
            { naam: 'Lavendel', latijn: 'Lavandula angustifolia', info: 'Bloeit juni – augustus, paars' },
            { naam: 'Zonnehoed', latijn: 'Echinacea purpurea', info: 'Bloeit juli – oktober, roze' },
            { naam: 'Rozemarijn', latijn: 'Salvia rosmarinus', info: 'Bloeit maart – mei, lichtblauw' }
        ]
    },
    {
        id: 'Sierlint 1',
        naam: 'Sierlint 1',
        lat: 52.35216,
        lng: 4.93140,
        planten: [
            { naam: 'Lavendel', latijn: 'Lavandula angustifolia', info: 'Bloeit juni – augustus, paars' },
            { naam: 'Zonnehoed', latijn: 'Echinacea purpurea', info: 'Bloeit juli – oktober, roze' },
            { naam: 'Rozemarijn', latijn: 'Salvia rosmarinus', info: 'Bloeit maart – mei, lichtblauw' }
        ]
    },
    {
        id: 'Sierlint 2',
        naam: 'Sierlint 2',
        lat: 52.35216,
        lng: 4.93134,
        planten: [
            { naam: 'Lavendel', latijn: 'Lavandula angustifolia', info: 'Bloeit juni – augustus, paars' },
            { naam: 'Zonnehoed', latijn: 'Echinacea purpurea', info: 'Bloeit juli – oktober, roze' },
            { naam: 'Rozemarijn', latijn: 'Salvia rosmarinus', info: 'Bloeit maart – mei, lichtblauw' }
        ]
    },
    {
        id: 'Sierlint 3',
        naam: 'Sierlint 3',
        lat: 52.35189,
        lng: 4.93085,
        planten: [
            { naam: 'Gele lis', latijn: 'Iris pseudacorus', info: 'Bloeit mei – juni, geel' },
            { naam: 'Moerasspirea', latijn: 'Filipendula ulmaria', info: 'Bloeit juni – augustus, crèmewit' }
        ]
    },
    {
        id: 'Heuvel 1',
        naam: 'Heuvel 1',
        lat: 52.35184,
        lng: 4.93101,
        planten: [
            { naam: 'Gele lis', latijn: 'Iris pseudacorus', info: 'Bloeit mei – juni, geel' },
            { naam: 'Moerasspirea', latijn: 'Filipendula ulmaria', info: 'Bloeit juni – augustus, crèmewit' }
        ]
    },
    {
        id: 'Heuvel 2',
        naam: 'Heuvel 2',
        lat: 52.35169,
        lng: 4.93078,
        planten: [
            { naam: 'Klaproos', latijn: 'Papaver rhoeas', info: 'Bloeit mei – juli, rood' },
        ]
    },
    {
        id: 'Heuvel 3',
        naam: 'Heuvel 3',
        lat: 52.35167,
        lng: 4.93063,
        planten: [
            { naam: 'Klaproos', latijn: 'Papaver rhoeas', info: 'Bloeit mei – juli, rood' },
        ]
    },
    {
        id: 'Waterplantgebied',
        naam: 'Waterplantgebied',
        lat: 52.35162,
        lng: 4.93055,
        planten: [
            { naam: 'Klaproos', latijn: 'Papaver rhoeas', info: 'Bloeit mei – juli, rood' },
        ]
    },
    {
        id: 'Voedseleiland 2',
        naam: 'Voedseleiland 2',
        lat: 52.35174,
        lng: 4.93065,
        planten: [
            { naam: 'Klaproos', latijn: 'Papaver rhoeas', info: 'Bloeit mei – juli, rood' },
        ]
    },
    {
        id: 'Voedseleiland 3',
        naam: 'Voedseleiland 3',
        lat: 52.35172,
        lng: 4.93073,
        planten: [
            { naam: 'Klaproos', latijn: 'Papaver rhoeas', info: 'Bloeit mei – juli, rood' },
        ]
    },
    {
        id: 'Voedseleiland 4',
        naam: 'Voedseleiland 4',
        lat: 52.35162,
        lng: 4.93042,
        planten: [
            { naam: 'Klaproos', latijn: 'Papaver rhoeas', info: 'Bloeit mei – juli, rood' },
        ]
    },
    {
        id: 'Voedseleiland 5',
        naam: 'Voedseleiland 5',
        kleur: '#e63946',
        lat: 52.35155,
        lng: 4.93045,
        planten: [
            { naam: 'Klaproos', latijn: 'Papaver rhoeas', info: 'Bloeit mei – juli, rood' },
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
const lijst = document.getElementById('paneel-lijst');
const sluitKnop = paneel.querySelector('.paneel-sluit');
let laatsteStip = null;

function toonCollectie(locatie, stipElement) {
    laatsteStip = stipElement;
    titel.textContent = locatie.naam;
    lijst.replaceChildren();

    if (locatie.planten.length === 0) {
        const leeg = document.createElement('li');
        leeg.textContent = 'Voor deze plek is nog geen collectie toegevoegd.';
        lijst.appendChild(leeg);
    }

    locatie.planten.forEach(plant => {
        const li = document.createElement('li');
        li.className = 'plant-kaart';

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