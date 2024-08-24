//Implementieren des Express-Frameworks für den Server
const express = require('express');

//Konfiguration eines Express-Servers (app) um JSON- und URL-codierte Daten zu parsen
const app = express()
app.use(express.json())
app.use(express.urlencoded({
  extended: true
}))
const bodyParser = require('body-parser');
app.use(bodyParser.json());

//Verbindung zu SQLite-Datenbanken
const sqlite = require('sqlite')
const sqlite3 = require('sqlite3')

//Sicherstellung, dass Server Zugriff auf statische Dateien
app.use(express.static('./'))

//Rendern von HTML-Vorlagen
const ejs = require('ejs')
const css = require('css')

//Eigene Module
const Proteinkomplex = require('./CORUM.js')
const searchArg = require('./searchArg.js')
//const {translateToSQL} = require('./translateToSQL')

//Definition des Ports
const port = 1337

//Search-Route
app.post('/Proteinkomplexe', (req, res) => {
  const searchArg = req.body.query;
  const sqlQuery = translateToSQL(searchArg);
  res.json({ message: 'SQL Query', query: sqlQuery });
});

//Start-Route RESTful-Server
app.get('/', function(req, res) {
  if (req.accepts("html")) {
    ejs.renderFile('./Startseite.ejs', function(err, str) {
      if (err) {
        res.status(500).send(err.message);
      } else {
        res.send(str);
      }
    });
  } else {
    res.status(406).send('Not Acceptable');
  }
});

//Restful-Server Route um Proteinkomplexe zu durchsuchen
app.get('/Proteinkomplexe', async (req, res) => {
  var db;
  try{
    db = await sqlite.open({
      filename: './mydb.db',
      driver: sqlite3.Database
    })
    const search_arg = req.body.search_arg;
    const complexinfo = await Proteinkomplex.search(search_arg, undefined, undefined, db);
    console.log(complexinfo);
    if (req.accepts("html")) {
      ejs.renderFile('./Proteinkomplexe.ejs', {complexinfo}, {}, function(err, str) {
        if (err) {
          throw err;
        }
        res.send(str);
      });
    } else if (req.accepts("json")) {
      res.json(complexinfo)
    }
  } catch (e) {
    console.error(e);
    res.status(500).send('Internal Server Error');
  } finally {
    if (db) {
      await db.close();
    }
  }
})

//Restful-Server Route um neuen Eintrag zu erstellen
app.post('/Proteinkomplexe', async function(req, res) {
  var db;
  try {
    db = await sqlite.open({
      filename: './mydb.db',
      driver: sqlite3.Database
    })
    const new_Proteinkomplex = await Proteinkomplex.createOne(req.body, db);
    console.log(`Create a new Proteinkomplex record:\n${new_Proteinkomplex}`);
    res.json(new_Proteinkomplex);
  } catch (err) {
    console.log(err);
    res.status(400).send("Internal server error");
  } finally {
    if (db) {
      await db.close;
    }
  }
});

//RESTful-Server Route um einen Proteinkomplex zu updaten
app.put('/Proteinkomplexe/:complexid', async function(req, res) {
  var db;
  try {
    db = await sqliteopen({
      filename: './mydb.db',
      driver: sqlite3.Database
    })
    const updateKeyValuePairs = req.body;
    let Proteinkomplex = await Proteinkomplex.readByID(req.params.complexid, db);
    let result = await Proteinkomplex.update(updateKeyValuePairs, db);
    console.log(`Updated a Proteinkomplex record:\n${result}`);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(300).send("Internal server error");
  } finally {
    if (db) {
      await db.close;
    }
  }
});

//Start Server
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})