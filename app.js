
const keyword = document.querySelector('#keyword');
const villes  = document.querySelector('#villes');

var mymap  = L.map('mapid').setView([51.505, -0.09], 13);
var marker = L.marker([51.5, -0.09]).addTo(mymap);

//console.log(villes);



/* AUTOCOMPLETION */
keyword.addEventListener('keyup', (event) => {
    //console.log(event.currentTarget.value);
    villes.innerHTML='';
    const url = 'https://places-dsn.algolia.net/1/places/query';

    fetch(url, {
        method: 'POST',
        body: JSON.stringify({query: event.currentTarget.value })
    })
    .then(response => response.json())
    .then((data) => {
        //console.log(data.hits);
        const cityList = data.hits;
        const displayedCity = [];
        var displedName = "";

        cityList.forEach(ville => {
            // console.log(ville._geoloc.lat);
            // console.log(ville._geoloc.lng);
            const cityName = ville.locale_names.default[0];

            const splittedName = cityName.split(" ", 2);
            const firstWord = splittedName[0];
            //console.log(firstWord);

            displedName = firstWord + " (" + ville.country_code + ")";
            
            if (!(displayedCity.includes(displedName))) {
                displayedCity.push(displedName);
                villes.insertAdjacentHTML('beforeend', `<option value="${displedName}">`);
            }

            //villes.insertAdjacentHTML('beforeend', `<option value="${displedName}">`);
            
        });

        const options = document.querySelectorAll('#villes option');
        //console.log(options);
        options.forEach(option => {
            //console.log(option);

            keyword.addEventListener('change', (event) => {
                //console.log('click');
                //console.log(keyword.value);

                cityList.forEach(city => {
                    //console.log(city);
                    //console.log(keyword.value);

                    var res = keyword.value.split(" ",2);
                    const firstWord = res[0];
                    // console.log(firstWord);
                    // console.log(countryCode);

                    if (city.locale_names.default[0] === firstWord) {
                        //console.log(city.locale_names.default[0]);
                        const latitude = city._geoloc.lat;
                        const longitude = city._geoloc.lng;

                        mymap.remove();
                        mymap  = L.map('mapid').setView([latitude, longitude], 13);
                        marker = L.marker([latitude, longitude]).addTo(mymap);

                        L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
                            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                            maxZoom: 18,
                            id: 'mapbox/streets-v11',
                            tileSize: 512,
                            zoomOffset: -1,
                            accessToken: 'pk.eyJ1IjoibWFyaWViYSIsImEiOiJja2tuc2RvMmgzNThtMnBxdXg0dWtlNXZmIn0.03wMZswCenHt5EeuNoCpRQ'
                        }).addTo(mymap); 

                    }
                    
                });

            })

})     
        
    })
    .catch((e) => {
        console.log(e);
    })
});


/* MAP */

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoibWFyaWViYSIsImEiOiJja2tuc2RvMmgzNThtMnBxdXg0dWtlNXZmIn0.03wMZswCenHt5EeuNoCpRQ'
}).addTo(mymap); 













// Si on veut appeler une fonction dans un addEventListener avec des paramètres à lui passer il faut mettre 'click', (event), parametre => {}