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
Nachdem alle im Datenbank-Ordner befindlichen Dateien heruntergeladen und lokal gespeichert wurden, kann der Server wie folgt im Terminal gestartet werden:

```sh
node server.js
```

Werden die Module beim Starten des Servers nicht gefunden, sollte der Dateipfad so gewählt werden, dass die Module im selben Ordner wie die Datei server.js gewählt werden.

Nun kann der Server in einem Browser der Wahl (z.B. Firefox) über die Adresse http://localhost:1337/ angezeigt werden. Hier ist eine Startseite zu sehen, die die Anzeige aller bereits in der Datenbank vorhandenen Proteinkomplexe ermöglicht (Adresse: http://localhost:1337/Proteinkomplexe) und deren Änderung sowie die Anlage neuer Komplexe erlaubt.

