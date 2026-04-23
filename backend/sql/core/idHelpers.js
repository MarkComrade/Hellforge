const { pool } = require('./connection.js');

async function findNextAvailableId(tableName, columnName, connection = null) {
    const db = connection || pool;
    const forUpdate = connection ? 'FOR UPDATE' : '';

    const [all] = await db.query(
        `SELECT \`${columnName}\` FROM \`${tableName}\` ORDER BY \`${columnName}\` ASC ${forUpdate}`
    );

    if (all.length === 0) return 1;

    let expected = 1;
    for (const row of all) {
        if (row[columnName] > expected) {
            return expected;
        }
        expected = row[columnName] + 1;
    }

    return expected;
}

module.exports = {
    findNextAvailableId
};
