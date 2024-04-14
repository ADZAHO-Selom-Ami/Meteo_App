const cityModel = require('../models/cityModel');
const sitename = 'Météo App / https://github.com/ADZAHO-Selom-Ami/Meteo_App';



exports.addCity = async (req, res) => {
    const { cityName, lon, lat } = req.body;
    try {
        if (typeof cityName !== 'string') {
            throw new Error('Le nom de la ville doit être une chaîne de caractères.');
        }
        if (isNaN(lon) || isNaN(lat)) {
            throw new Error('Les coordonnées doivent être des nombres.');
        }
        if (lon < -180 || lon > 180 || lat < -90 || lat > 90) {
            throw new Error('Les coordonnées doivent être valides.');
        }
        await cityModel.addCity(cityName, lon, lat);
        console.log('Ville ajoutée avec succès !');
        res.redirect('/');
    } catch (error) {
        console.error('Erreur lors de l\'ajout de la ville :', error);
        res.status(500).send('Une erreur est survenue lors de l\'ajout de la ville.');
    }
};

exports.showCityList = async (req, res) => {
    try {
        const cities = await cityModel.getAllCities();
        res.render('index', { cities });
    } catch (error) {
        console.error('Erreur lors de la récupération de la liste des villes :', error);
        res.status(500).send('Une erreur est survenue lors de la récupération de la liste des villes.');
    }
};

exports.searchCity = async (req, res) => {
    const { search } = req.query;
    try {
        const city = await cityModel.searchCity(search);
        if (!city) {
            res.render('searchCity', { message: 'Aucune ville trouvée.' });
        }
        res.render('searchCity', { city });
    } catch (error) {
        console.error('Erreur lors de la recherche de la ville :', error);
        res.status(500).send('Une erreur est survenue lors de la recherche de la ville.');
    }
};


exports.showWeatherPage = async (req, res) => {
    const cityId = req.params.cityId;

    const city = await cityModel.getCityById(cityId);

    const url = `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${city.lat}&lon=${city.lon}`;

    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': sitename
            }
        });

        if (!response.ok) {
            throw new Error('Request failed with status: ' + response.status);
        }

        const data = await response.json();

        const timeseries = data.properties.timeseries;

        const weatherData = [];

        timeseries.forEach(entry => {
            const time = entry.time;
            const instantData = entry.data.instant.details;

            const next12HoursSummary = entry.data.next_12_hours ? entry.data.next_12_hours.summary : null;
            const next12HoursDetails = entry.data.next_12_hours ? entry.data.next_12_hours.details : null;

            const next1HoursSummary = entry.data.next_1_hours ? entry.data.next_1_hours.summary : null;
            const next1HoursDetails = entry.data.next_1_hours ? entry.data.next_1_hours.details : null;

            const next6HoursSummary = entry.data.next_6_hours ? entry.data.next_6_hours.summary : null;
            const next6HoursDetails = entry.data.next_6_hours ? entry.data.next_6_hours.details : null;


            const data = {
                time: time,
                airPressureAtSeaLevel: instantData.air_pressure_at_sea_level,
                airTemperature: instantData.air_temperature,
                cloudCover: instantData.cloud_area_fraction,
                humidity: instantData.relative_humidity,
                windDirection: instantData.wind_from_direction,
                windSpeed: instantData.wind_speed,
                next12HoursSummary: next12HoursSummary,
                next12HoursDetails: next12HoursDetails,
                next1HoursSummary: next1HoursSummary,
                next1HoursDetails: next1HoursDetails,
                next6HoursSummary: next6HoursSummary,
                next6HoursDetails: next6HoursDetails
            };

            weatherData.push(data);
        });

        res.render('meteo', { city, weatherData });


    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }

};


