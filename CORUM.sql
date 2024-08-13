BEGIN;
    CREATE TABLE complexinfo (
        complexid INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(250) NOT NULL,
        synonym VARCHAR(250) NOT Null,
        organismus VARCHAR(250) NOT Null,
        cell line VARCHAR(250) NOT NULL,
        sub_id INTEGER NOT NULL,
        fun_id INTEGER NOT NULL,
        pub_id INTEGER NOT NULL,
        FOREIGN KEY (sub_id) REFERENCES untereinheiten(subid),
        FOREIGN KEY (fun_id) REFERENCES funcat(funcatid),
        FOREIGN KEY (pub_id) REFERENCES publikation(pubid)
    );

    CREATE TABLE untereinheiten (
        subid INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(250) NOT NULL,
        organismus VARCHAR(250) NOT NULL,
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
        complex_id INTEGER NOT NULL,
        funcat_id INTEGER NOT NULL,
        go_id INTEGER NOT NULL,
        FOREIGN KEY (complex_id) REFERENCES complexinfo(complexid),
        FOREIGN KEY (funcat_id) REFERENCES funcat(funcatid),
        FOREIGN KEY (go_id) REFERENCES go(goid)
        );

    CREATE TABLE funcat (
        funcatid INTEGER PRIMARY KEY AUTOINCREMENT,
        fundescription VARCHAR(250) NOT NULL
        );

    CREATE TABLE go (
        goid INTEGER PRIMARY KEY AUTOINCREMENT,
        godescription VARCHAR(250) NOT NULL
        );

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



COMMIT;