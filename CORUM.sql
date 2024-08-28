

BEGIN;
    CREATE TABLE complexinfo (
        complexid INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(250) NOT NULL,
        synonym VARCHAR(250) NOT Null,
        organismus VARCHAR(250) NOT Null,
        cell_line VARCHAR(250) NOT NULL,
        sub_id INTEGER NOT NULL,
        fun_id INTEGER NOT NULL,
        pub_id INTEGER NOT NULL,
        FOREIGN KEY (sub_id) REFERENCES untereinheiten(subid),
        FOREIGN KEY (fun_id) REFERENCES funktion(funid),
        FOREIGN KEY (pub_id) REFERENCES publikation(pubid)
    );

    CREATE TABLE untereinheiten (
        subid INTEGER PRIMARY KEY AUTOINCREMENT,
        subname VARCHAR(250) NOT NULL,
        swissorganismus VARCHAR(250) NOT NULL,
        gen VARCHAR(250) NOT NULL,
        gen_synonym VARCHAR(250) NOT NULL,
        uniprot_id VARCHAR(250) NOT NULL,
        entrez_id VARCHAR(250) NOT NULL,
        complex_id INTEGER NOT NULL,
        pub_id INTEGER NOT NULL,
        FOREIGN KEY (complex_id) REFERENCES complexinfo(complexid),
        FOREIGN KEY (pub_id) REFERENCES publikation(pubid)
        );

    CREATE TABLE funktion (
        funid INTEGER PRIMARY KEY AUTOINCREMENT,
        funcat_id  VARCHAR(250) NOT NULL,
        fundescription VARCHAR(250) NOT NULL,
        go_id VARCHAR(250) NOT NULL,
        godescription VARCHAR(250) NOT NULL,
        complex_id INTEGER NOT NULL,
        FOREIGN KEY (complex_id) REFERENCES complexinfo(complexid)
        );

   -- CREATE TABLE funcat (
        --funcatid INTEGER PRIMARY KEY AUTOINCREMENT,
        --fundescription VARCHAR(250) NOT NULL
       -- );

    --CREATE TABLE go (
      --  goid INTEGER PRIMARY KEY AUTOINCREMENT,
        --godescription VARCHAR(250) NOT NULL
        --);

    CREATE TABLE publikation (
        pubid INTEGER PRIMARY KEY AUTOINCREMENT,
        purification VARCHAR(250) NOT NULL,
        complex_comment VARCHAR(250) NOT NULL,
        disease_comment VARCHAR(250) NOT NULL,
        sub_comment VARCHAR(250) NOT NULL,
        pubmed_id VARCHAR(250) NOT NULL,
        complex_id INTEGER NOT NULL,
        sub_id INTEGER NOT NULL,
        FOREIGN KEY (complex_id) REFERENCES complexinfo(complexid),
        FOREIGN KEY (sub_id) REFERENCES untereinheiten(subid)
        );

-- Definition der Relationen zwischen den oben eingefügten Datenmodellen

--Indexing:
CREATE INDEX complexinfo_sub_id_fk_index ON complexinfo(sub_id);
CREATE INDEX complexinfo_fun_id_fk_index ON complexinfo(fun_id);
CREATE INDEX complexinfo_pub_id_fk_index ON complexinfo(pub_id);
-- Indexing der Relationen in complexinfo

CREATE INDEX untereinheiten_sub_id_fk_index ON untereinheiten(complex_id);
CREATE INDEX untereinheiten_pub_id_fk_index ON untereinheiten(pub_id);
-- Indexing der Relationen in untereinheiten

CREATE INDEX funktion_complex_id_fk_index ON funktion(complex_id);
CREATE INDEX funktion_funcat_id_fk_index ON funktion(funcat_id);
CREATE INDEX funktion_go_id_fk_index ON funktion(go_id);
-- Indexing der Relationen in funktion

CREATE INDEX publikation_complex_id_fk_index ON publikation(complex_id);
CREATE INDEX publikation_sub_id_fk_index ON publikation(sub_id);
-- Indexing der Relationen in publikation

-- Skript zum Füllen der Tabellen: 
-- 1. Erstellen einer temporären Tabelle und import des ausgegebenen CORUM-Datensatzes f. alle Komplexe
-- 2. Einfügen der zutreffenden Spalten in die jeweiligen Tabellen der DB
-- 3. Löschen der temporären Tabelle csv_import über DROP TABLE
CREATE TABLE csv_import (complex_id INTEGER, complex_name text, organismus text, synonyme text, zelllinie text, uniprot_id text, 
entrez_id text, purification text, go_id text, go_description text, funcat_id text, funcat_description text, pubmed INTEGER, 
comment_c text, comment_d text, comment_s text, swiss_organismus text, name_sub text, gen_sub text, gen_sub_synonym text, subid INTEGER, 
funid INTEGER, pubid INTEGER);
.mode csv
.separator ";"
.import /Users/davidmolter/Documents/M_Biotechnologie/SoSe24/SDAM/Prüfungsleistung/allComplexes_mod_noheaders.CSV csv_import
--.import C:/SDAM/CORUM/allComplexes_mod_noheaders.CSV csv_import
--NOTE: For Importing file from local directory (Windows)
-- In CSV: Removed Column headers for improved Import and added Columns 
--         for fun_id, sub_id and pub_id (copied column complex_id)

INSERT INTO complexinfo (complexid, name, synonym, organismus, cell_line, sub_id, fun_id, pub_id) SELECT complex_id, complex_name, synonyme, organismus, zelllinie, subid, funid, pubid
    FROM csv_import WHERE 1;

-- NOTE: To Debug: Added  columns subid, funid and pubid to csv_import, and colums sub_id, fun_id, pub_id 
--       to INSERT INTO complexinfo-statement and applied fix to other Tables
INSERT INTO untereinheiten (subid, subname, swissorganismus, gen, gen_synonym, uniprot_id, entrez_id, complex_id, pub_id) SELECT subid, name_sub, swiss_organismus, gen_sub, gen_sub_synonym, uniprot_id, entrez_id, complex_id, pubid
    FROM csv_import WHERE 1;
INSERT INTO funktion (funid, funcat_id, fundescription, go_id, godescription, complex_id) SELECT funid, funcat_id, funcat_description, go_id, go_description, complex_id
    FROM csv_import WHERE 1;
--INSERT INTO funcat (funcatid, fundescription) SELECT funcat_id, funcat_description
  --  FROM csv_import WHERE 1;
    -- Datatype mismatch: funcatid ist integer, funcat_id ist aber text, in csv-datei ist es String aus zahlen (text), muss noch geändert werden
--INSERT INTO go (goid, godescription) SELECT go_id, go_description
  --  FROM csv_import WHERE 1; --> Siehe Problem bei funcat-Tabelle: Datatype mismatch
INSERT INTO publikation (pubid, purification, complex_comment, disease_comment, sub_comment, pubmed_id, complex_id, sub_id) 
SELECT pubid, purification, comment_c, comment_d, comment_s, pubmed, complex_id, subid
    FROM csv_import WHERE 1;

DROP TABLE csv_import;

COMMIT;

-- DROP TABLE Statements to clear DB during testing, have to be moved to comments in final version
-- DROP TABLE complexinfo;
-- DROP Table untereinheiten;
-- DROP Table funktion;
-- DROP TABLE publikation;
-- DROP TABLE csv_import;