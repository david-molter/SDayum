# README zur Prüfungsleistung im Modul "Scientific Data Management"

Im folgenden README wird der Aufbau und die Nutzung des Data-Warehouses beschrieben.

## Herunterladen des Servers

Die benötigten Datein für den Server sind auf folgendem Github-Repository zu finden https://github.com/david-molter/SDayum. Um den Server starten zu können werden folgende Dateien benötigt:

- server.js
- mydb.db
- Proteinkomplexe.ejs
- entries.ejs
- style.css

Die Dateien sollten alle in dem gleichen Ordner liegen, damit die im Code definierten Directorys stimmen und die verschiedenen Anwendungen aus einander zugreifen können.

## Starten des Data-Warehouses

Nun wird das Starten des Data-Warehouses erklärt.

Zunächst muss sichergestellt sein, dass node.js verfügbar ist und die entsprechenden node-Module installiert sind:

```sh
npm install sqlite --save
npm install sqlite3 --save
npm install express --save
npm install css --save
npm install ejs --save
```
Wurden die im vorherigen Kapitel aufgeführten Datein vom Repository heruntergeladen, kann die Root-Directory auf diesen Speicherort gesetzt werden und der Server wie folgt im Terminal gestartet werden:

```sh
node server.js
```

Der Server sollte nun auf Port 1337 laufen und mit einem Browser der Wahl (z.B. Firefox, Safari, Chrome etc.) über die Adresse http://localhost:1337/ abrufbar sein. 

Werden die Module beim Starten des Servers nicht gefunden, sollte der Dateipfad so gewählt werden, dass die Module im selben Ordner wie die Datei server.js gewählt werden.

## Benutzen des Datawarehouses

Beim Anzeigen des Servers im Browser unter der obigen Adresse erscheint eine Seite mit der Überschrift Proteinkomplexe und einer Suchleiste. Wird in die Suchleiste nichts eingegeben, bevor auf `Enter`oder den Suchbutton geklickt wird, werden alle 5280  Proteinkomplexe paginiert dargestellt. Über die Eingabe einer Complex ID, eines Komplex Namens oder eines Organismus in die Suchleiste können die Einträge allerdings auch gefiltert werden. Das Suchargument ist hierbei logisch mit einer ODER-Verknüpfung aufgebaut und durchsucht die 3 genannten Spalten in der complexinfo-Tabelle der Datenbank nach Einträgen, die den Text/die Zahl aus der Suchanfrage beinhalten aber nicht zwingend identisch sind (`LIKE ?`).
Die aufgelisteten Suchergebnisse sind nach aufsteigender Complex ID sortiert und paginiert. Pro Seite werden 10 Einträge angezeigt.

Die Namen der einzelnen Einträge (Entries) sind anklickbar, und leiten den Benutzer auf eine Seite mit weiterführenden Informationen zu dem jeweiligen Eintrag weiter (z.B. http://localhost:1337/entries/1 für den Eintrag mit der Complex ID 1). Hier sind die allegemeine Informationen sowie Informationen zu den Untereinheiten des Proteinkomplexes, den Funktionen und den Referenzen (Kommentare, Methoden und PubMed ID der zugrundeliegenden Publikation) aufgeführt.  Die Informationen über die Funktionen und die Untereinheiten sind grafisch als Tabelle dargestellt.
Für die UniProt ID, die Entrez ID, die GO ID und die PubMed ID sind zudem klickbare externe Links integriert die auf die Einträge der jeweiligen externen Datenbank verweisen.

## Beenden des Servers

Der Server kann aus dem Terminal heraus beendet werden, welches zum starten des Servers benutzt wurde, indem dort `Ctrl-C` eingeben wird.