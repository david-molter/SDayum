# README zur Prüfungsleistung im Modul "Scientific Data Management"

Im folgenden README wird der Aufbau und die Nutzung des Data-Warehouses beschrieben. 

## Starten des Data-Warehouses

Nun wird das Starten des Data-Warehouses erklärt.

Zunächst muss sichergestellt sein, dass node.js verfügbar ist und die entsprechenden node-Module installiert sind:

```sh
npm install sqlite --save
npm install sqlite3 --save
npm install express --save
npm install css --save
```
Nachdem alle Dateien heruntergeladen und lokal gespeichert wurde, kann der Server wie folgt im Terminal gestartet werden:

```sh
node server.js
```

Werden die Module beim Starten des Servers nicht gefunden, sollte der Dateipfad so gewählt werden, dass die Module im selben Ordner wie die Datei server.js gewählt werden.