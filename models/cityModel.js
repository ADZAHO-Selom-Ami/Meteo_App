const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.db');

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS cities (
    id INTEGER PRIMARY KEY,
    cityName TEXT,
    lon REAL,
    lat REAL
  )`, (err) => {
        if (err) {
            console.error(err.message);
        } else {
            console.log('Table created successfully');
        }
    });
});

exports.addCity = (cityName, lon, lat) => {
    return new Promise((resolve, reject) => {
        const query = `INSERT INTO cities (cityName, lon, lat) VALUES (?, ?, ?)`;
        db.run(query, [cityName, lon, lat], (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};

exports.getAllCities = () => {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM cities`;
        db.all(query, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};

exports.searchCity = (search) => {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM cities WHERE cityName LIKE ?`;
        db.get(query, [`%${search}%`], (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
};

exports.getCityById = (cityId) => {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM cities WHERE id = ?`;
        db.get(query, [cityId], (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
};
