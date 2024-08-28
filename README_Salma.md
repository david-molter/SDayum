In diesem README werden der Aufbau, die Struktur und die Bedienung sowie die Funktionen des Datawarehouses beschrieben.

# Datenmodelle

Für den ausgegebenen Datensatz aus der CORUM-Datenbank wurden relationale Datenmodelle gewählt, da diese eine gute Abfrageeffizienz aufweisen. Dazu wurde der Datensatz thematisch in 4 Tabellen (Datenmodelle) unterteilt: Eine Tabelle mit Übersichtsinformationen (complexinfo) sowie Tabellen zu den Proteinuntereinheiten (untereinheiten), den Funktionen (funktion) und der Publikation aus der die Daten stammen (publikation).

| Tabelle       | Spalten (Namen aus txt-Datei, keine Keys)     | Primary Key   | Foreign Keys              |
|---------------|-----------------------------------------------|---------------|---------------------------|
| complexinfo   | ComplexName, Organism, Synonym, Cell line     | complexid     |  sub_id, pub_id, fun_id   |
| untereinheiten| subunits(Protein name), SWISSPROT organism, subunits(Gene Name), subunits(Gene name syn), subunits(UniProt IDs), subunits(Entrez IDs) | subid         | complex_id, pub_id        |
| publikation   | Protein complex purification method, Complex comment, Disease complex, Subunits comment, PubMed ID| pubid | complex_id, sub_id |
| funktion      | FunCat ID, FunCat description, GO ID, GO description | funid | complex_id |

Die complexid stammt hierbei aus der Originaltabelle. Die sub_id, pub_id und fun_id sind jedoch neu vergeben und entsprechen den Werten der complexid.

## Implementieren in SQL - CORUM.sql

In SQLite3 wurden die oben beschriebenen 4 Tabellen erzeugt und die Datentypen der Einträge festgelegt. Die Relationen zwischen den Tabellen wurden mittels Indexen separat noch einmal festegehalten um die Abfraggeschwindigkeit zu erhöhen. Anschließend wurde ein Skript erstellt, mit dem die Tabellen aus einer CSV-Datei heraus befüllt werden können. Hierfür wurde die ausgegebene TXT-Datei (allComplexes.txt) in eine CSV-Datei umgeschrieben. Damit es beim Import keinen Datatype-Mismatch gibt, wurden die Spaltentitel gelöscht und Spalten für sub_id, pub_id und fun_id hinzugefügt indem die ComplexID-Spalte vervielfätigt wurde. Die CSV-Datei wurde dann in eine Import-Tabelle (csv_import) importiert und die entsprechenden Spalten in die 4 CORUM-Tabellen insertiert. Die Import-Tabelle wird dann gelöscht und die Änderungen über Commit in die mit der SQL-Datei verbundenen Datenbankdatei (mydb.db) geschrieben.

ACHTUNG: Unter dem Commit-Statement befinden sich DROP Table- Statements, die nicht mitausgeführt werden sollten! Sie stammen aus der Entwicklung des Codes bzw. dem Testen seiner Ausführbarkeit!

# Server

Beim Server handelt es sich um einen Express-Server, wie er in den Vorgaben definiert ist. Das Server-Backend wurde mit Javascript geschrieben, das Frontend mit mit HTML beziehungsweise embedded Javascript (ejs). Das Grunddesign ist in einem CSS-Stylesheet festgehalten.

## Server Backend

Das Server-Backend wird durch die drei Dateien CORUM.js, searchArg.js und server.js definiert, alle ineinander greifen. Wobei die Datei server.js das Herzstück der Webanwendung darstellt. 

### server.js 

In der Datei server.js werden zunächst die benötigten node module angefordert inklusive der Etablierung des Servers als Express-Server und der Port auf 1337 gesetzt. Anschließend wird EJS als View Engine eingesetzt und der Pfad der Views auf die Root-Directory festgelegt, damit dynamische HTML-Anwendungen umgesetzt werden können. Außerdem wird die Verbindung mit der Datenbank mydb.db sowie eine Verbindung mit statischen Files wie dem Stylesheet style.css ermöglicht. 

Nachfolgend werden die Server-Routen fpür die Übersicht ('/'), die Suchfunktion ('/search') und die Anzeige der einzelnen Einträge ('/entries:id') mit einem GET-Request verwirklicht. Dazu wird die Datei Proteinkomplexe.ejs gerendert und eine Suchfunktion etabliert, die in drei Spalten (name, complexid oder organismus) nach Einträgen sucht, welche eingegebenen Werte in die Suchanfrage enthalten (LIKE-Operator). Um die einzelnen Einträge über die Entry-Route darzustellen wird die ID des ausgewählten Komplexes mittels eines Loggers an die darauffolgende Datenbankabfrage übergeben. Hierbei werden die Einträge aller 4 Tabellen (s. Datenmodelle) nach der ID durchsucht und die zugehörgigen Informationen an die Entry-Seite geschickt.

## Server Frontend

