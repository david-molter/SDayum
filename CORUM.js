const searchArg = require('./searchArg.js')

class Proteinkomplex{

    //Definition des Eintrags und dessen Attribute
    complexid;
    name;
    synonym;
    organismus;
    cell_line;
    sub_id;
    fun_id;
    pub_id;

    //Constructor als Funktion um neue Instanzen (Records) hinzuzufügen
    constructor(keyValuePairs) {
        this.complexid = keyValuePairs.complexid;
        this.name = keyValuePairs.name;
        this.synonym = keyValuePairs.synonym;
        this.organismus = keyValuePairs.organismus;
        this.cell_line = keyValuePairs.cell_line;
        this.sub_id = keyValuePairs.sub_id;
        this.fun_id = keyValuePairs.fun_id;
        this.pub_id = keyValuePairs.pub_id;
    }

    //Statische Methode um einen neuen Eintrag für Proteinkomplexe in Database aufzunehmen
    static async createOne(keyValuePairs, db_connection) {
        const sql = "INSERT INTO Proteinkomplexe " +
        "(complexid, name, synonym, organismus, cell_line, sub_id, fun_id, pub_id)" +
        "(?, ?, ?, ?, ?, ?, ?, ?)";
        const db_res = await db_connection.run(sql,
            keyValuePairs.complexid, keyValuePairs.name, keyValuePairs.synonym, keyValuePairs.organismus,
            keyValuePairs.cell_line, keyValuePairs.sub_id, keyValuePairs.fun_id, keyValuePairs.pub_id);
        const new_Preoteinkomplex = await db_connection.get(
            'SELECT * FROM Proteinkomplexe WHERE complexid = ?',
            keyValuePairs.complexid
        );
        return new_Preoteinkomplex;
    }

    //Lesen eines Eintrags aus der Database
    static async readById(id, db_connection) {
        const sql = "SELECT complexid, name, synonym, organismus, cell_line, sub_id, fun_id, pub_id FROM Proteinkomplexe WHERE complexid = ?";
        const db_res = await db_connection.get(sql, id);
        console.log(db_res);
        return new Proteinkomplex(db_res);
    }

    //Auslesen eines Proteinkomplex Eintrags
    static async search(search_arg, order_arg, pagination_arg, db_connection) {
        const searchSql = (search_arg !== undefined && search_arg !== null) ? search_arg.translateToSQL(search_arg) : "SELECT complexid, name, synonym, organismus, cell_line, sub_id, fun_id, pub_id FROM Proteinkomplexe";
        console.log(`SQL genereated to search Proteinkomplexe records:\n${JSON.stringify(searchSql)}`);
        const dbResult = await db_connection.all(searchSql);
        return dbResult;
    }

    //Update Proteinkomplexe Record
    async update(keyValuePairs, db_connection) {
        let sql = "UPDATE Proteinkomplexe SET";
        for (const[key, value] of Object.entries(keyValuePairs)) {
            sql += `${key} = ${value}`;
        }
        sql += "WHERE complexid = ?";
        console.log(sql);
        const db_res = await db_connection.run(sql, this.complexidid);
        const updated_proteinkomplex = await db_connection.get(
            'SELECT * FROM Proteinkomplexe WHERE complexid = ?',
            this.complexid
        );
        return updated_proteinkomplex;
    }
}

module.exports = Proteinkomplex;