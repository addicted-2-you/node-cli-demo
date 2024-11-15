const sqlite3 = require('sqlite3');

const openDb = (dbPath) =>
  new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        reject(err);
      }

      resolve(db);
    });
  });

const runQuery = (db, query, params = []) =>
  new Promise((resolve, reject) => {
    db.run(query, params, function (err) {
      if (err) reject(err);
      resolve(this);
    });
  });

const getAllRows = (db, query, params = []) =>
  new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) reject(err);
      resolve(rows);
    });
  });

module.exports = { openDb, runQuery, getAllRows };
