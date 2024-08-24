function translateSearchTripletToSQL(triplet) {
    const { field, operator, value } = searchArg;
    return `${field} ${operator} '${value}'`;
}
 
function translateToSQL(searchArg) {
    const header = "SELECT * FROM Proteinkomplexe WHERE ";
    var searchSql = translateToSqlRecursive(searchArg);
    return `${header} ${searchSql}`;
}
 
function translateToSqlRecursive(searchArg) {
    var hasDescendants = searchArg.descendants !== undefined;
    if (hasDescendants) {
        var descSqlArr = searchArg.descendants.map(translateToSqlRecursive);
        var sql = descSqlArr.reduce((a, c) => `${a} ${searchArg.op} ${c}`);
        return `(${sql})`;
    } else {
        return translateSearchTripletToSQL(searchArg);
    }
}
 
module.exports = {translateToSQL};