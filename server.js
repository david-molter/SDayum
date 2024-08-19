//Implementieren des Express-Frameworks für den Server
const express = require('express')

//Konfiguration eines Express-Servers (app) um JSON- und URL-codierte Daten zu parsen
const app = express()
app.use(express.json())
app.use(express.urlencoded({
  extended: true
}))

//Verbindung zu SQLite-Datenbanken
const sqite = require('sqlite')
const sqlite3 = require('sqlite3')

//Rendern von HTML-Vorlagen
const ejs = require('eja')