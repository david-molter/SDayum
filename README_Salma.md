# Einleitung

Dieses README stellt einen Teil der Prüfungsleistung für das Wahlpflichtmodul SDAM im Sommersemester 2024 dar. Hierin soll gezeigt werden, welche Überlegungen dem erstellten Datawarehouse zugrundeliegen und wie diese In Programmcode umgesetzt wurden. Es werden die Zielsetzung des Projekt, der Aufbau und die Struktur der erstellten Datenbank und die Umsetzung des Datawarehouse als lokaler Server mit Grafischem User Interface beschrieben.

# Inhalt
1. Zielsetzung
2. Projektplanung
3. Datenmodelle
4. Server und Grafisches User Interface
5. BWissenschaftliche Plots
6. Zusammenfassung und Aussicht

# 1. Zielsetzung

Die Zielsetzung für das Projekt ergibt sich aus den Anforderungen an die Prüfungsleistung. So soll ein Datawarehouse auf der Basis eines der ausgegebenen Datensätze erstellt werden. Dies soll auf mehreren Ebenen geschehen. Auf der Datenbankebene sollen mehrere Datenmodelle in einer SQLite3-Datenbank etabliert werden, welche mit den Daten des ausgewählten Datensatzes befüllt werden soll. Zudem soll ein Server in JavaScript programmiert werden, der grundlegende Lesefunktionen ermöglicht, wie das Auslesen eines spezifischen Eintrags aus der Datenbank über eine Suchfunktion. Das Frontend des Servers soll in HTML bzw. Embedded JavaScript (EJS) und CSS aufgebaut werden. Hierbei soll auch ein grafisches User Interface (GUI) umgesetzt werden, welches dem Benutzer ermöglicht, die Einträge im Datawarehouse auf einfache Art (Klicken, Suchen) auszulesen. Zudem sollen die Daten des Datensatzes in wissenschaftlichen Plots dargestellt werden.

# 2. Projektplanung

Zur Umsetzung der Ziele wurde ein Projektplan erstellt, der sich in mehrere Phasen unterteilt: Auseinandersetzen jedes einzelnen Gruppenmitglieds mit allen ausgegebenen Datensätzen, Diskussion und Wahl eines Datensatzes,Festlegung der Datenmodelle und Strukturierung der Daten, Setup der Programmierumgebung in VSCode und Verbinden mit einem Git-Repository auf GitHub, Aufbau einer Datenbank in SQLite3 und befüllen der Datenbank mit Daten des Datensatzes und Programmieren des Servers inklusive Backend und Frontend.

# 3. Datenmodelle

Zuerst wurden alle ausgegebenen Datensätze betrachtet und diskutiert, welcher Datensatz in der Gruppe präferiert wird um Datenmodelle zu etablieren und ein Datawarehouse zu erstellen. Dabei wurde sich für die CORUM-Datensatz entschieden, da dessen Daten für alle Gruppenmitglieder inhaltlich am besten greifbar und am interessantesten war. Der CORUM-Datensatz (CORUM = comprehensive resource of mammalian protein complexes) beinhaltet Daten zum Aufbau und der Funktion von Proteinkomplexee aus Säugern. 
Für den ausgegebenen Datensatz aus der CORUM-Datenbank wurden relationale Datenmodelle gewählt, da diese eine gute Abfrageeffizienz aufweisen. Dazu wurde der Datensatz thematisch in 4 Tabellen (Datenmodelle) unterteilt: Eine Tabelle mit Übersichtsinformationen (complexinfo) sowie Tabellen zu den Proteinuntereinheiten (untereinheiten), den Funktionen (funktion) und der Publikation aus der die Daten stammen (publikation). Alle Tabellen sind durch Primary und Foreign Keys miteinander verknüpft.

| Tabelle       | Spalten (Namen aus txt-Datei, keine Keys)     | Primary Key   | Foreign Keys              |
|---------------|-----------------------------------------------|---------------|---------------------------|
| complexinfo   | ComplexName, Organism, Synonym, Cell line     | complexid     |  sub_id, pub_id, fun_id   |
| untereinheiten| subunits(Protein name), SWISSPROT organism, subunits(Gene Name), subunits(Gene name syn), subunits(UniProt IDs), subunits(Entrez IDs) | subid         | complex_id, pub_id        |
| publikation   | Protein complex purification method, Complex comment, Disease complex, Subunits comment, PubMed ID| pubid | complex_id, sub_id |
| funktion      | FunCat ID, FunCat description, GO ID, GO description | funid | complex_id |

Die complexid stammt hierbei aus der Originaltabelle. Die sub_id, pub_id und fun_id sind jedoch neu vergeben und entsprechen den Werten der complexid. Die Tabelle `complexinfo` beinhaltet in der erstellten Datenbank im wesentliche allgemeine Informationen und nimmt bei der Entwicklung des Servers (s.u.) eine zentrale Rolle ein.

## 3.1 Implementieren in SQLite3 - CORUM.sql

In der Datei `CORUM.sql` werden die oben beschriebenen 4 Tabellen SQLite3 erzeugt und die Datentypen der Einträge festgelegt. Die Relationen zwischen den Tabellen werden mittels Indizes separat noch einmal festegehalten um die Abfraggeschwindigkeit zu erhöhen. Anschließend wird ein Skript erstellt, mit dem die Tabellen aus einer CSV-Datei heraus befüllt werden können. Hierfür wird die ausgegebene TXT-Datei (`allComplexes.txt`) in eine CSV-Datei umgeschrieben. Damit es beim Import keinen Datatype-Mismatch gibt, werden die Spaltentitel gelöscht und Spalten für sub_id, pub_id und fun_id hinzugefügt indem die ComplexID-Spalte vervielfätigt wird. Die CSV-Datei wird dann in eine Import-Tabelle (`csv_import`) importiert und die entsprechenden Spalten in die 4 CORUM-Tabellen eingefügt. Die Import-Tabelle wird dann gelöscht und die Änderungen über Commit in die mit der SQL-Datei verbundenen Datenbankdatei (`mydb.db`) geschrieben.

ACHTUNG: Unter dem Commit-Statement befinden sich DROP Table- Statements, die nicht mitausgeführt werden sollten! Sie stammen aus der Entwicklung des Codes bzw. dem Testen seiner Ausführbarkeit!

# 4. Server und Grafisches User Interface

Beim Server handelt es sich um einen Express-Server, wie er in den Vorgaben definiert ist. Das Server-Backend wurde mit Javascript geschrieben, das Frontend mit HTML beziehungsweise embedded Javascript (ejs). Das Grunddesign ist in einem CSS-Stylesheet festgehalten.

## 4.1 Server Backend

Das Server-Backend wird durch die Datei server.js definiert, in welcher die wesentlichen Funktionen (Paginierung, Suchen, Anzeigen, Auslesen) des Servers programmiert wurden. Die Datei `server.js` verarbeitet die Anfragen des Frontends (EJS-Dateien). 

In der Datei server.js werden zunächst die benötigten Node-Module angefordert inklusive der Etablierung des Servers als Express-Server und der Port auf 1337 gesetzt. Anschließend wird EJS als View-Engine eingesetzt und der Pfad der Views auf die Root-Directory festgelegt, damit dynamische HTML-Anwendungen umgesetzt werden können. Außerdem wird die Verbindung mit der Datenbank `mydb.db` sowie eine Verbindung mit statischen Files wie dem Stylesheet `style.css` ermöglicht. 

Nachfolgend werden die Server-Routen für die Übersicht (`app.get('/')`), die Suchfunktion (`app.get('/search')`) und die Anzeige der einzelnen Einträge (`app.get('entries/:id')`) mit einem GET-Request verwirklicht. Dazu wird die Datei Proteinkomplexe.ejs gerendert und eine Suchfunktion etabliert, die in drei Spalten (name, complexid oder organismus) nach Einträgen sucht, welche eingegebenen Werte in die Suchanfrage enthalten (`LIKE`-Operator). Um die einzelnen Einträge über die Entry-Route darzustellen wird die ID des ausgewählten Komplexes mittels eines Loggers an die darauffolgende Datenbankabfrage übergeben. Hierbei werden die Einträge aller 4 Tabellen (s. Datenmodelle) nach der ID durchsucht und die zugehörgigen Informationen an die Entry-Seite geschickt.

Damit Server-Fehler entdeckt und behoben werden können, sind einige Error-Events im server.js integriert, sofern ein Fehler vorliegt. So können bei der Datenbankabfrage beispielsweise die Fehlertexte "'Fehler bei der Datenbankabfrage: `err`" (Probleme bei Abfrage der SQLite Datenbank z.B. bei Syntaxfehlern in der Suchanfrage), "Serverfehler" (Anfrage konnte generell nicht verarbeitet werden) oder "Eintrag nicht gefunden" (Zur eingegebenen ID kann kein Eintrag gefunden werden) im Output des Terminals ausgegeben werden. Dies vereinfacht das Troubleshooting sowohl bei der Anwendung als auch bei der Server-Entwicklung.



## 4.2 Server Frontend

Das Server Frontend und damit auch das Grafische User Interface wird durch die 3 Dateien `Proteinkomplexe.ejs`, `entries.ejs` und `style.css` gebildet. Das CSS-Stylesheet gibt dabei vor, wie die Elemente des Servers standardmäßig dargestellt werden und formatiert beispielsweise eine Standard-Tabelle, den Hintergrund der Webseite, die Schriftgröße, die Designs der klickbaren Buttons (Paginierung, Suchen, Zurück) und Überschriften. Das Style-Sheet ist in beide EJS-Dateien eingebunden (`<link rel="stylesheet" href="/style.css">`), kann aber durch in-line Commands in den EJS-Dateien ausgehebelt werden.
Die EJS-Dateien wiederum kommunizieren bidirektional mit dem der server.js Datei im Backend, sodass die Funtkionen des Servers dynamisch in einem Grafischen User Interface durch den Benutzer angewendet werden können. 

Zuerst wurde die EJS-Datei `Proteinkomplexe.ejs` erstellt und darin neben Der Überschrift der Seite auch die Kommunikation mit dem darunterliegenden Server-Backend bezüglich der Anzeige der gesamten Komplexe in der Datenbank (Spalten comlexid, complex_name, synonym und organismus aus der complexinfo Tabelle der Datenbank), des Durchsuchens bzw.Filterns der Datenbank (wieder in der Tabelle complexinfo, Kommunikation an Server bei klicken der Searchbar oder Enter) und der Paginierung programmiert. Die Paginierung ist so programmiert, dass ein Button für dievorherige Seite nur angezeigt wird, wenn die aktuelle Seitenzahl >1 ist.
Wichtig für die einzelnen Entry-Seiten ist hier die Programmierung eines Links, dem bei klicken des Komplexnamens gefolgt wird. Das ist in der Proteinkomplexe.ejs so umgesetzt, dass die complex_id die vom Server aus der Datenbank zu dem Eintrag gezogen wird, in die Route zu einer so eindeutig zuordnenbaren Entry-Seite integriert wird (`<td><a href="/entries/<%= item.complexid %>"><%= item.name %></a></td>`). 

Die Seite(n) zu den einzelnen Entries sind in der Datei `entries.ejs` programmiert. Der Inhalt der Entry-Seite hängt maßgeblich von der in der URL (s. o.) mitgegebenden ID ab. Anhand der ID findet eine Datenbankabfrage über den Server statt, die alle zu der ID gehörigen Informationen aus den 4 definierten Datenmodellen ausliest. Anhand dieser Daten wird die Entry-Seite gerendert.


# 5. Wissenschaftliche Plots

Bei den Daten des CORUM-Datensatzes handelt es sich bis auf die IDs und Referenzcodes ausschließlich um Informationen die den Datentyp Text haben. Da Auftragungen wie Balkendiagramme, Scatter-Plots oder Ähnliches für diesen Datentyp ungeeignet sind, wurden die Daten auf den Entry Seiten als Tabellen aufgetragen. Dabei wurden zwei Tabellentypen gewählt: eine "unsichtbare" Tabelle für einfache Zusammenhänge, wie für die Allgemeinen Informationen oder die Referenzen bei denen nur ein Eintrag pro Kategorie existiert (z. B. PubMed ID: xyz) und sichtbare Tabellen für die komplexeren Einträge. Die "unsichtbare" Tabelle dient hierbei mehr zu einer einheitlichen Gestaltung der Auflistung, da dies sie einfachste Umsetzung von Tab-Stops für den vorliegenden Fall darstellt. 
Die "sichtbare" Tabelle ist grafisch über das CSS-Stylesheet definiert und findet auch in auf der Seite zu den Proteinkomplexen Anwendung. Sie ist so formatiert, dass die Zeilen der Tabelle abwechselnd weiß oder beige hinterlegt sind und dunkel hervorgehoben werden, wenn mit dem Cursor darüber gefahren wird. Somit wird die Lesbarkeite der Tabelleneinträge für den Benutzer vereinfacht. Eine Besonderheit der "sichtbaren" Tabellen der Entry-Seiten ist, dass die Einträge der Datenbank nicht einfach nur aufgerufen werden, sondern mit Semikolon als Trennzeichen auf dem Server in eine neue Untertabelle geschrieben werden. Dies ist möglich da die Einträge in den Funktions- und Untereinheitentabellen der Datenbank innerhalb der einzelnen Zellen durch Semikolon getrennt sind (z.B. mehrere GO-IDs und GO-Beschreibungen zum selben Proteinkomplex).

# 6. Zusammenfassung und Aussicht