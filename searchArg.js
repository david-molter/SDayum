function translateToSQL() {
    var example_search_arg_1 = {
        descendants: [{
            field: "name",
            op: "like",
            val: "%CoREST%"
        },
        {
            field: "organismus",
            op: "=",
            val: "Human"
        }
    ],
    op: "AND"
    };

    var example_search_arg_2 = {
        op: "AND",
        descendants: [{
            op: "OR",
            descendants: [{
                field: "name",
                op: "like",
                val: "%CoREST%"
            },
            {
                field: "organismus",
                op: "=",
                val: "Human"
            }
        ]
    },
    {
        field: "organismus",
        op: "=",
        val: true
    }
    ]
    };
    const expected_sql_example_1 =
    'SELECT * FROM Proteinkomplexe WHERE ( (name like %CoREST%) AND (organismus = Human) )';
    const test_1 = translateToSQL(example_search_arg_1) === expected_sql_example_1;

    return test_1;
}

const fieldTypes = {
    compexid: "int",
    
}

function translateSearchTripletToSQL(triplet) {
    const { field, operator, value } = searchArg;
    return `${field} ${operator} '${value}'`;
}
 
function testTranslateToSQL(searchArg) {
    const header = "SELECT * FROM complexinfo WHERE ";
    var searchSql = translateToSQLRecursive(searchArg);
    return `${header} ${searchSql}`;
}

function translateToSQLRecursive(searchArg) {
    var hasDescendants = searchArg.descendants !== undefined;
    if (hasDescendants) {
        var descSqlArr = searchArg.descendants.map(translateToSQLRecursive);
        var sql = descSqlArr.reduce((a, c) => `${a} ${searchArg.op} ${c}`);
        return `(${sql})`;
    } else {
        return translateSearchTripletToSQL(searchArg);
    }
}
 
module.exports = {translateToSQL, testTranslateToSQL};