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

Der Server sollte nun auf Port 1337 laufen und mit einem Browser der Wahl (z.B. Firefox, Safari, Chrome etc.) über die Adresse http://localhost:1337/ abrufbar sein. 

Werden die Module beim Starten des Servers nicht gefunden, sollte der Dateipfad so gewählt werden, dass die Module im selben Ordner wie die Datei server.js gewählt werden.

## Benutzen des Datawarehouses

Beim Anzeigen des Servers im Browser unter der obigen Adresse erscheint eine Seite mit der Überschrift Proteinkomplexe und einer Suchleiste. Über die Suchleiste können sowohl alle Proteinkomplexe angezeigt werden (kein Eintrag in das Textfeld, bevor auf "Enter" oder "Suchen" gedrückt wird) als auch nach Complex ID, Komplex Name oder Organismus gefiltert werden. Das Suchargument ist hierbei logisch mit einer ODER-Verknüpfung aufgebaut und durchsucht die Datenbank nach Einträgen in den 3 genannten Spalten, die den Text/die Zahl aus der Suchanfrage beinhalten aber nicht zwingend identisch sind ('LIKE ?').
Die aufgelisteten Suchergebnisse sind nach aufsteigender Complex ID sortiert und paginiert. Pro Seite werden 10 Einträge angezeigt.

Die Namen der einzelnen Einträge (Entries) sind anklickbar, und leiten den Benutzer auf eine Seite mit weiterführenden Informationen zu dem jeweiligen Eintrag weiter (z.B. http://localhost:1337/entries/1 für den Eintrag mit der Complex ID 1). Hier sind die allegemeine Informationen sowie Informationen zu den Untereinheiten des Proteinkomplexes, den Funktionen und den Referenzen (Kommentare, Methoden und PubMed ID der zugrundeliegenden Publikation) aufgeführt.  Die Informationen über die Funktionen und die Untereinheiten sind grafisch als Tabelle dargestellt.
Für die UniProt ID, die Entrez ID, die GO ID und die PubMed ID sind zudem klickbare externe Links integriert die auf die Einträge der jeweiligen externen Datenbank verweisen.




