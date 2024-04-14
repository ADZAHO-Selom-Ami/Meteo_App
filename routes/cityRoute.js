const express = require('express');
const router = express.Router();

const cityController = require('../controllers/cityController');

router.get('/', cityController.showCityList);
router.post('/addCity', cityController.addCity);
router.get('/searchCity', cityController.searchCity);
router.get('/meteo/:cityId', cityController.showWeatherPage);



module.exports = router;
