const express = require('express')
const app = express()

app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.set('view engine', 'twig')

const cityRoute = require('./routes/cityRoute');
app.use('/', cityRoute);

app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
})