# README zur Prüfungsleistung im Modul "Scientific Data Management"

Im vorliegenden Readme soll die komplette Organisation sowie Umsetzungen zur Programmierung eines Data-Warehouses festgehalten werden. Die Erstellung des Data-Warehouses sowie das README sind Bestandteil der Prüfungsleistung des Moduls Scientific Data Management im Masterstudiengang Synthetische Biotechnologie an der Technischen Hochschule in Bingen.

## Inhalt
- Zielsetzung
- Planung und Organisation
- Datenmodelle
- Anlegen der Datenbank
- Server-Programmierung
- Graphical User Interface
- Wissenschaftliche Plots
- Zusammenfassung und Ausblick

## 1 Zielsetzung

Ziel dieser Arbeit ist es ein Data-Warehouse für einen der gegebenen Datensätze zu programmieren. Das Data-Warehouse ist als RESTful Web-Server aufzusetzen, welcher Lesezugriff auf modellierte Daten bieten soll. Darüber hinaus soll ein Graphical Ucer Interface (GUI) implementiert werden, so dass wissenschaftliche Daten durchsucht werden können. Zusätzlich soll in einem weiteren README festgehalten werden, wie der Server zu starten und zu nutzen ist.

Die Aufgabenstellung wird in einer Gruppe von zwei Studierenden bearbeitet. Die Gruppe besteht aus Salma El Moaied El Azem und David Molter.

## 2 Planung und Organisation

Um die vorgegebene Aufgabe zu bearbeiten wurde in der Gruppe eine grobe Planung der einzelnen Schritte vorgenommen. In einem ersten Schritt sollen die gegebenen Datensätze studiert werden. Hierbei schaffen sich die Studierenden, in Einzelarbeit, einen Überblick über die vorgegebenen Datensätze und stellen erste Überlegungen für geeignete Datenmodelle an. Die Überlegungen werden anschließend in der Gruppe vorgetragen und diskutiert. In der Diskussion in der Gruppe wird dann ein Datensatz ausgewählt welcher anschließend bearbeitet werden soll. Im Anschluss wird ein Datenmodell angewendet und die Daten entsprechend modelliert.

Auf Basis des vorhergehenden Schrittes wird anschließend die Datenbank in SQLite programmiert. Hierbei sollen je nach Datenmodell verschiedene Tabellen erstellt werden und diese anschließend mit den Daten des Datensatzes gefüllt werden. Hierbei ist besonders darauf zu achten die Relationen der Tabellen mit Hilfe von FOREIGN KEYs richtig zu etablieren.

Nach dem die Daten modelliert wurden soll ein RESTful-Server in Node.js angelegt werden. Dieser Server hostet das angestrebte Data-Warehouse und ermöglicht den Zugriff sowie eine Lese- und Durchsuchungsfunktion der modellierten Daten.

Abschließend wird das GUI in .ejs bzw. html programmiert, welches es dem Nutzer ermöglichen soll, die Datenbank im Brower einsehen zu können und in der Lage ist die oben genannten Funktionen anzuwenden.

## 3 Datenmodelle

Wie beschrieben wurde einer der gegebenden Datensätze für die weitere Verarbeitung ausgewählt. In der Gruppe wurde der CORUM Datensatz (The comprehensive resource of mammalian protein complexes) ausgewählt, welcher umfassende Informationen zu verschiedenen Proteinkomplexen aus Säugetieren enthält. Anschließend wurden die Überlegungen über die Modellierung der Daten von den einzelnen Studierenden zusammengetragen und diskutiert. Im Allgemeinen wurde sich auf ein relationales Datenmodell geeinigt, in dem die verschiedenen Informationen thematisch in verschiedene Tabellen zugeordnet werden und diese über PRIMARY und FOREIGN KEYs identifiziert und mit einander verbunden sind. In der folgenden Tabelle ist dargestellt, wie die Daten in Tabelle aufgeteilt wurde und welche Größen als PRIMARY oder FOREIGN KEYs verwendet wurden.

|Complexinfo   |Untereinheiten |Funktion       |Publikation    |
|--------------|---------------|---------------|---------------|
|complexid (PK)|subid (PK)     |funid (PK)     |pubid (PK)     |
|name          |subname        |funcat_id      |purification   |
|synonym       |swissorganismus|fundescription |complex_comment|
|organismus    |gen            |go_id          |disease_comment|
|cell_line     |gen_synonym    |godescription  |sub_comment    |
|sub_id (FK)   |uniprot_id     |complex_id (FK)|pubmed_id      |
|fun_id (FK)   |entrez_id      |               |complex_id (FK)|
|pub_id(FK)    |complex_id (FK)|               |sub_id (FK)    |
|              |pub_id (FK)    |               |               |
|              |               |               |               |

Es wurde ein relationales Datenmodell gewählt, da diese Art von Datenmodellen ein starkes query Potential haben und auch die relationen zwischen den Tabellen gut dargestellt werden können. Die Tabelle "complexinfo" soll dabei im Zentrum stehen, da hier allgemeine Informationen zu den Proteinkomplexen, wie Name, ID, Synonyme und Organismus, festgehalten wurden. Diese Tabelle soll zum Durchsuchen der Datenbank verwendet werden. Das Ziel soll es später sein, dass man die Tabelle "complexinfo" nach einem Proteinkomplex durchsuchen kann und durch Auswählen des Komplexes alle Informationen zu diesem Komplex aus den anderen Tabellen einsehen kann. Die anderen Tabellen umfassen eine Tabelle für die Untereinheiten, in der alle Informationen zu den Untereinheiten des Komplexes festgehalten wurden. Eine weitere Tabelle umfasst die Funktionen des Komplexes die in der Form von GO und FunCat IDs und deren Beschreibung festgehalten wurden. Die letzte Tabelle soll alle referenzierenden Informationen enthalten, wie Kommentare, Aufreinigungsmethode oder Querverweise zu Publikationen.

Nachdem das Grundgerüst der Datenmodells konzeptioniert wurde, kann im nächsten schritt mit der Implementierung des Datenmodells in SQLite begonnen werden und die dort erstellten Tabellen mit den Daten aus dem Datensatz gefüllt werden.

## 4 Anlegen der Datenbank
Die Programmierung der SQLite Datenbank erfolgt in SQLite in VSCode. VSCode wurde dabei so eingesetzt, dass die Dateien auf einem Github Repository lagen und VSCode mit diesem verküpft war und Änderungen an den Dateien herunter und hochgeladen werden konnten. Dadurch wurde gewährleistet, dass alle Gruppenmitglieder unabhängig von einander an der neuesten Version arbeit können und in gegebenen Fällen auch ältere Versionen als Sicherheit gespeichert sind.

Um mit der Programmierung der Datenbank in SQLite zu starten wurde die "CORUM.sql" Datei erstellt. Hier wurden zunächst die in Kapitel 3 dargestellten Tabellen und ihre Einträge definiert. Des weiteren wurde auch definiert, welche Werte die PRIMARY KEYs und welche die FOREIGN KEYs darstellen sollen. Anschließend wurden die Relationen zwischen den Tabellen nochmals über Indexe festgehalten um die Abfragegeschwindigkeit zu erhöhen. Nachdem die Tabellen erstellt und definiert wurden, mussten diese mit den Daten aus dem vorgegebenen Datensatz gefüllt werden. Hierzu wurde die Datei "allComplexes.txt" in eine CSV Datei konvertiert und die erste Zeile, welche die Spalten repräsentiert ausgeschnitten um später einen Datatype-Mismatch zu vermeiden. Außerdem wurden in der CSV Datei die Spalten für sub_id, fun_id und pub_id hinzugefügt, welche Kopien der complexid der jeweiligen Spalte darstellen. Die CSV Datei wurde dann im SQL-Skript als "csv_import" Tabelle importiert. Mit der `INSERT INTO` Funktion wurden dann die jeweiligen Werte aus der "csv_import" Datei in die korrespondierenden Spalten der vier Tabellen eingefügt. Im Anschluss wurde die "csv_import" Tabelle gedropt, das diese für die weiteren Prozesse nicht gebraucht wird. Um anschließend einen .db File für die weiteren Anwendungen zu generieren, wurde im Terminal der Befehl `sqlite3 mydb.db` eingegeben. Dadurch wurde das SQLite Skript ausgeführt und die dabei erstellten Tabellen in der Datei "mydb.db" gespeichert. 


## 5 Server-Programmierung

Im folgenden Schritt wurde der Server in Node.js programmiert. Hierfür wurde ein `express` server etabliert. Dabei wurden zunächst die benötigten Module wie `express`, `sqlite3` und `ejs` angefordert. Außerdem wurde mit `const port = 1337` festgelegt, dass der Server auf Port 1337 läuft.

In einem nächsten Schritt wurde die view engine auf Embedded Java Script festgelegt und mit der Funktion `app.use(express.static())` dem Server ermöglicht auf statische Datein wie CSS zuzugreifen und diese zu verarbeiten. Außerdem wurde mit `const db = new sqlite3.Database('./mydb.db')` eine Verbindung zu unserem Database-File aufgebaut.

Anschließend wurden die verschiedenen Routen und deren Funktionen definiert. Die Überlegung war, zwei Seiten zu etablieren. Eine Seite um alle Proteinkomplexe einzusehen und durchsuchen zu können und eine zweite Seite auf der alle weiteren Informationen angezeigt werden. Die Routen wurden mit dem `app.get()` Befehlt etabliert.

Als erstes wurde die Home Route für die Durchsuchung der Datenbank durch `app.get('/')` definiert. Wenn nun die Seite http://localhost:1337/ aufgerufen wird, wird die Seite Proteinkomplexe.ejs gerendert. Auf dieser Seite soll nach einem Protenkomplex gesucht werden können. Wenn nun eine Suche durchgeführt wird, wird die Funktion `app.get('/search')` ausgeführt. Hier wurde dementsprechend die Such Funktion programmiert. Sendet der Nutzer seine Suchanfrage wird die Tabelle ComplexInfo auf den Werten complexid, name und organismus auf den Such-Input gefiltert und die Seite Proteinkomplexe.ejs neu gerendert und die Suchergebnisse dort tabellarisch dargestellt.

Um die Entry-Seiten zu definieren wurde anschließend die Route `app.get('entries/:id')`definiert. Diese Seite soll über einen Klick auf den gewünschten Proteinkomplex aufrufbar sein. Beim Klick auf den entsprechenden Proteinkomplex wird dann die ID des Komplexes übergeben und alle Details zu diesem Komplex aus allen Tabellen zusammengesucht und dargestellt. Abschließend wird dann die Seite entries.ejs gerendert.

Um den Server starten zu können wurde abschließend die Funktion `app.listen()` etabliert. Durch den angegebenen `console.log` bekommt der User außerdem eine Rückmeldung ob der Server erfolgreich gestartet wurde und auf welchem Port dieser läuft.

## 6 Graphical User Interface

Im folgenden wird beschrieben wie das graphische User Interface (GUI) programmiert wurde. Hierfür wurden die Dateien "Proteinkomplexe.ejs" und "entries.ejs" erstellt. Außerdem wurde die CSS Datei "style.css" erstellt, in der die Darstellungsweise der verschiedenen Elemente definiert werden sollen.

Als erstes wurde die Home-Route welche durch Proteinkomplexe.ejs dargestellt werden soll programmiert. Dabei wurde das HTML mit der style.css Datei verbunden und anschließend der Aufbau der Seite programmiert. Dabei wurde eine Überschrift der Seite erstellt und anschließend die Searchbar über `searchForm` etabliert. Nach der Searchbar wird dann die Tabelle der Suchergebnisse dargestellt, welche die Spalten 'complexid, name, synonym und organismus' aus der complexinfo Tabelle anzeigt. die Spalte der Komplexnamen wurde dabei als interner Link etbaliert welcher auf die jeweilige Entry-Seite verweisen soll. Abschließend wurden dann noch die Pagination-Buttons programmiert, welche es dem Nutzer erlauben durch die Seiten der Tabelle zu navigieren.

Die Entry-Seite wurde in der Datei entries.ejs programmiert. Die Überlegung war, alle Informationen zu dem jeweiligen Proteinkomplex anzeigen zu lassen, diese jedoch thematisch von einander getrennt darzustellen. Aus diesem Grund wurden hier mehrere Tabellen erstellt. Die erste Tabelle zeigt demnach die allgemeinen Informaionen des Proteinkomplexes (aus complexinfo) an. In der zweiten Tabelle sollen dann alle Informationen zu den jeweiligen Untereinheiten des Komplexes dargestellt werden, gefolgt von einer Tabelle die alle Informationen zur Funktion der Komplexes darstellt. Abschließend sollen Referenzierende Daten, wie Kommentare und Verweise, dargestellt werden. Da die Spalten der Untereinheite und der Funktionen mehrere Werte enthielten die durch ein ";" getrennt wurden, wurden nachträglich Skripte hinzugefügt welche die Daten nach dem Semikolon trennen und in jeweils eine neue Zeile übertragen. Unter den Daten waren außerdem viele IDs oder Referenzen zu anderen Webseiten, darunter UniProt IDs, Entrez IDs, GO-Terms und PubMed IDs. Diese Werte wurde hier passenderweise als externe Links etabliert, welche den Nutzer auf die entsprechende Seite mit dem entsprechenden Eintrag weiter leiten. Dies soll es dem Nutzer vereinfachen, weitere Informationen per 1-Klick abrufen zu können.

Der Style der HTML-Elemente wurde abschließend in einer CSS-Datei programmiert. Dabei wurden Hintergrund der Website, sowie Tabellen-Formate, Searchbar und weitere Elemente definiert. Solange kein anderes inline style command definiert ist, werden die Elemente nach der Definition in der CSS Datei dargestellt. Dadurch müssen vor allem wieder verwendete Elemente nicht jedes mal im HTML head neu definiert werden.

## 7 Wissenschaftliche Plots

Aufgrund er Beschaffenheit der Daten wurden hier ausschließlich tabellarische Plots angewendet. Diese Tabellen wurden in CSS so definiert, so dass jede zweite Zeile eine andere Hintergrundfarbe besitzt, um das Lesen der Daten für den Nutzer angenehmer zu gestalten. Außerdem wurde eine Hover Funktion hinzugefügt, die einzelne Einträge bei drüber fahren mit der Maus hervor zu heben. Um die Datenbank in Zukunft aber weiter zu entwickeln könnte man neue Daten einbetten die bspw. die Zusammensetzung der Untereinheiten zum Proteinkomplex beschreiben. Diese Daten könnte man anschließend graphisch mit einbeziehen und darstellen. Auch Daten zu Proteinstrukturen ließen sich hier verwenden und graphisch darstellen.

## 8 Zusammenfassung und Ausblick

In der beschriebenen Arbeit konnte erfolgreich ein Data-Warehouse nach der RESTful-Server Prinzip mit Hilfe von SQLite, JavaScript, EmbeddedJavaScript, HTML und CSS programmiert werden. Der erstellte Server ermöglicht es dem Nutzer den CORUM Datensatz nach ComplexIDs, Proteinkomplexen und den Organismus des Proteinkomplexes zu durchsuchen. Durch Auswählen eines bestimmten Proteinkomplexes wird der Nutzer außerdem auf eine neue Seite weitergeleitet, in der ausführliche Informationen des Proteinkomplexes aufgeführt sind. Auf der Informationsseite wurden außerdem verschiedene Einträge mit externen Links verknüpft die den Nutzer zur entsprechenden Seite (UniProt, Entrez oder PubMed) weiterleite und dort den entsprechenden Inhalt anzeigen.

Um das Data-Warehouse weiter zu entwicklen könnte man weiter Funktionen hinzufügen. Eine Funktion zu Erstellung neuer Einträge würde Nutzern bspw. erlauben, neue Einträge der Datenbank zu formulieren und die Datenbank somit zu erweitern. Neben dem Hinzufügen neuer Einträge könnte außerdem eine Update Funktion von Einträgen formuliert werden, um die Einträge der Datenbank längerfristig auf dem neusten Stand zu halten. Im Zuge einer Update Funktion könnte man außerdem eine Funktion hinzufügen, die einem für jeden Eintrag anzeigt, wann dieser zuletzt aktualisiert wurde. Zuletzt könnte die Datanbank mit einer Eintrag löschen Funktion ausgestattet werden, die es dem Nutzer erlauben veraltete oder falsche Einträge aus der Datenbank zu löschen. 
