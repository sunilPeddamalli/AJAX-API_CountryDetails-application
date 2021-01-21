'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

///////////////////////////////////////

const renderCountry = function (data, className) {
    const html = `
    <article class="country ${className}">
        <img class="country__img" src="${data.flag}" />
        <div class="country__data">
            <h3 class="country__name">${data.name}</h3>
            <h4 class="country__region">${data.region}</h4>
            <p class="country__row"><span>👫</span>${(data.population / 1000000).toFixed(1)} million people</p>
            <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
            <p class="country__row"><span>💰</span>${data.currencies[0].name}</p>
        </div>
    </article>
    `;
    countriesContainer.insertAdjacentHTML('beforeend', html);
    countriesContainer.style.opacity = 1;
}

//AJAX API using XMLHttpRequest and based on RestCountries API
const getCountryDetails = function (country) {
    const request = new XMLHttpRequest();
    request.open('GET', `https://restcountries.eu/rest/v2/name/${country}?fullText=true`);

    request.send();

    request.addEventListener('load', function () {
        const [data] = JSON.parse(this.responseText);
        console.log(data);

        renderCountry(data);

        const [neighbour] = data.borders;
        console.log(neighbour);

        const getNeighbourCountry = function () {
            const request2 = new XMLHttpRequest();
            request2.open('GET', `https://restcountries.eu/rest/v2/alpha/${neighbour}`);

            request2.send();

            request2.addEventListener('load', function () {
                const data = JSON.parse(this.responseText);
                console.log(data);

                renderCountry(data, 'neighbour');
            });
        };
        getNeighbourCountry();
    });
};
// getCountryDetails('India');
// getCountryDetails('USA');
// getCountryDetails('Canada');

/*
const getCountryDetails2 = function (country) {
    console.log(fetch(`https://restcountries.eu/rest/v2/name/${country}?fullText=true`));

    fetch(`https://restcountries.eu/rest/v2/name/${country}?fullText=true`).then(function (response) {
        console.log(response);
        return response.json();
    }).then(function (data) {
        console.log(data[0]);
        renderCountry(data[0]);
    })
};
*/

//AJAX API using fetch and Arrow function based on RestCountries API
const getCountryDetails2 = function (country) {
    console.log(fetch(`https://restcountries.eu/rest/v2/name/${country}?fullText=true`));

    fetch(`https://restcountries.eu/rest/v2/name/${country}?fullText=true`)
        .then(response => {
            if (!response.ok) throw new Error(`Country not found`)
            return response.json();
        })
        .then(data => {
            console.log(data)
            const [data1] = data;
            renderCountry(data1);
            const neighbour = data1.borders[5];
            if (!neighbour) throw new Error(`Requested Neighbour Country not found`);
            console.log(neighbour);
            return fetch(`https://restcountries.eu/rest/v2/alpha/${neighbour}`)
        })
        .then(response => {
            return response.json()
        })
        .then(data => {
            console.log(data);
            renderCountry(data, 'neighbour');
        })
        .catch(err => alert(err))
};
// getCountryDetails2('India');
// getCountryDetails2('USA');
// getCountryDetails2('Canada');

//AJAX API using fetch and Arrow function based on geocode API
const whereAmI = function (lat, lng) {
    fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`)
        .then(response => {
            if (!response.ok) throw new Error(`only 3 request allowed in one secound`);
            return response.json();
        })
        .then(data => {
            console.log(data);
            console.log(`You are in ${data.city},${data.country}`)
            const country = data.country;
            return fetch(`https://restcountries.eu/rest/v2/name/${country}?fullText=true`)
        })
        .then(response => {
            return response.json();
        })
        .then(data => {
            console.log(data)
            const [country] = data
            console.log(country)
            renderCountry(country)
            const [neighbour] = country.borders;
            if (!neighbour) throw new Error('Neightbour Country not found')
            return fetch(`https://restcountries.eu/rest/v2/alpha/${neighbour}`)
        })
        .then(response => {
            return response.json()
        })
        .then(data => {
            console.log(data);
            renderCountry(data, 'neighbour');
        })
        .catch(err => {
            console.error(`Something went wrong. Error message - ${err.message}`);
        })
};
// whereAmI(19.037, 72.873)
// whereAmI(52.508, 13.381)
// whereAmI(-33.933, 18.474)

//Promisefying by loading multiple Images every two secounds.

const wait = function (sec) {
    return new Promise(function (resolve) {
        setTimeout(resolve, sec * 1000);
    });
};

const imgContainer = document.querySelector('.images');

const createImage = function (imgPath) {
    return new Promise(function (resolve, reject) {
        const img = document.createElement('img');
        img.src = imgPath;

        img.addEventListener('load', function () {
            imgContainer.append('img');
            resolve(img);
        });

        img.addEventListener('error', function () {
            reject(new Error('Image not found'))
        });
    });
};
/*
let createImg;
createImage('img/img-1.jpg')
    .then(img => {
        createImg = img;
        console.log('Image 1');
        return wait(2)
    })
    .then(() => {
        createImg.style.display = 'none';
        return createImage('img/img-2.jpg')
    })
    .then(img => {
        createImg = img;
        console.log('Image 2');
        return wait(2)
    })
    .then(() => {
        createImg.style.display = 'none';
        return createImage('img/img-3.jpg')
    })
    .then(img => {
        createImg = img;
        console.log('Image 3');
        return wait(2)
    })
    .catch(err => console.error(err.message));
*/

//Consuming Promise with Asyn/Await and try/catch

const geoLocation = function () {
    return new Promise(function (response, reject) {
        navigator.geolocation.getCurrentPosition(response, reject);
    });
};

const hereAmI = async function () {
    try {
        const currlocation = await geoLocation();
        console.log(currlocation);
        const { latitude: lat, longitude: lng } = currlocation.coords;
        const currPositon = await fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`);
        const dataGeo = await currPositon.json()
        console.log(dataGeo);

        const res = await fetch(`https://restcountries.eu/rest/v2/name/${dataGeo.country}?fullText=true`);
        const [data] = await res.json()
        renderCountry(data);

        const [neighbour] = data.borders
        console.log(neighbour)

        const neigRes = await fetch(`https://restcountries.eu/rest/v2/alpha/${neighbour}`);
        const data2 = await neigRes.json();
        console.log(data2)
        renderCountry(data2, 'neighbour');
    } catch (err) {
        console.error(err.message);
    }

};

hereAmI()