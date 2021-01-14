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

//Arrow function
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

// getCountryDetails('India');
// getCountryDetails('USA');
// getCountryDetails('Canada');

getCountryDetails2('India');
// getCountryDetails2('USA');
// getCountryDetails2('Canada');
