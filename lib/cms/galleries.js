/**
 * Registro gallery gestibili dal CMS (solo aggiunta foto).
 * pad: cifre con zero a sinistra nel nome file (street=3 → 001.webp).
 */
const GALLERIES = [
    {
        id: 'portraits',
        label: 'Portraits',
        htmlFile: 'portraits.html',
        folder: 'photo-portraits',
        altPrefix: 'Ritratto',
        pad: 2
    },
    {
        id: 'street',
        label: 'Street',
        htmlFile: 'street.html',
        folder: 'photo-street',
        altPrefix: 'Street',
        pad: 3
    },
    {
        id: 'jazz',
        label: 'Jazz',
        htmlFile: 'jazz.html',
        folder: 'photo-jazz',
        altPrefix: 'Jazz',
        pad: 2
    },
    {
        id: 'arti-mestieri',
        label: 'Arti e mestieri',
        htmlFile: 'arti-mestieri.html',
        folder: 'photo-arti-mestieri',
        altPrefix: 'Arti e mestieri',
        pad: 2
    },
    {
        id: 'country-market',
        label: 'Country market',
        htmlFile: 'country-market.html',
        folder: 'photo-country-market',
        altPrefix: 'Country market',
        pad: 2
    },
    {
        id: 'giochi-di-paese',
        label: 'Giochi di paese',
        htmlFile: 'giochi-di-paese.html',
        folder: 'photo-giochi-di-paese',
        altPrefix: 'Giochi di paese',
        pad: 2
    },
    {
        id: 'windows',
        label: 'Windows',
        htmlFile: 'windows.html',
        folder: 'photo-windows',
        altPrefix: 'Windows',
        pad: 2
    },
    {
        id: 'urban',
        label: 'Urban',
        htmlFile: 'urban.html',
        folder: 'photo-urban',
        altPrefix: 'Urban',
        pad: 2
    },
    {
        id: 'train',
        label: 'Train',
        htmlFile: 'train.html',
        folder: 'photo-train',
        altPrefix: 'Train',
        pad: 2
    },
    {
        id: 'auschwitz',
        label: 'Auschwitz',
        htmlFile: 'auschwitz.html',
        folder: 'photo-auschwitz',
        altPrefix: 'Auschwitz',
        pad: 2
    },
    {
        id: 'colours',
        label: 'Colours',
        htmlFile: 'colours.html',
        folder: 'photo-colours',
        altPrefix: 'Colours',
        pad: 2
    },
    {
        id: 'landscapes',
        label: 'Landscapes',
        htmlFile: 'landscapes.html',
        folder: 'photo-landscapes',
        altPrefix: 'Landscapes',
        pad: 2
    }
];

function getGallery(id) {
    return GALLERIES.find(function (g) {
        return g.id === id;
    }) || null;
}

function formatPhotoName(num, pad) {
    return String(num).padStart(pad, '0');
}

module.exports = {
    GALLERIES: GALLERIES,
    getGallery: getGallery,
    formatPhotoName: formatPhotoName
};
