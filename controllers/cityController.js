const cityModel = require('../models/cityModel');
var request = require('request');
const sitename = 'Météo App';



exports.addCity = async (req, res) => {
    const { cityName, lon, lat } = req.body;
    try {
        await cityModel.addCity(cityName, lon, lat);
        console.log('Ville ajoutée avec succès !');
        res.redirect('cityList');
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
        res.render('searchCity', { city });
    } catch (error) {
        console.error('Erreur lors de la recherche de la ville :', error);
        res.status(500).send('Une erreur est survenue lors de la recherche de la ville.');
    }
};

exports.showWeatherPage = async (req, res) => {
    const cityId = req.params.cityId;

    const city = await cityModel.getCityById(cityId);
    let url = `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=60&lon=11`;

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
        console.log(data);

        res.render('meteo', { city, data } );

    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }

};



