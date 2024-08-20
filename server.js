//Implementieren des Express-Frameworks für den Server
const express = require('express')

//Konfiguration eines Express-Servers (app) um JSON- und URL-codierte Daten zu parsen
const app = express()
app.use(express.json())
app.use(express.urlencoded({
  extended: true
}))

//Verbindung zu SQLite-Datenbanken
const sqlite = require('sqlite')
const sqlite3 = require('sqlite3')

//Rendern von HTML-Vorlagen
const ejs = require('ejs')

//Eigene Module
const Proteinkomplex = require('./CORUM.js')

//Definition des Ports
const port = 1337

//Mappen der Funktionen

//Routen zum Testen
app.get('/Welcome', function(req, res) {
  res.send('Welcome to CORUM?')
})

//Restful-Server Route um Proteinkomplexe zu durchsuchen
app.get('/Proteinkomplexe', async (req, res) => {
  var db;
  try{
    db = await sqlite.open({
      filename: './mydb.db',
      driver: sqlite3.Database
    })
    const search_arg = req.body.search_arg;
    const Proteinkomplexe = await Proteinkomplex.search(search_arg, db);
    console.log(Proteinkomplexe);
    if (req.accepts("html")) {
      ejs.renderFile('./Proteinkomplexe.ejs', {Proteinkomplexe}, {}, function(err, str) {
        if (err) {
          throw err;
        }
        res.send(str);
      });
    } else if (req.accepts("json")) {
      res.json(Proteinkomplexe)
    }
  } catch (e) {
    console.error(e);
    res.status(500);
  } finally {
    delete db
  }
})

//Start Server
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})