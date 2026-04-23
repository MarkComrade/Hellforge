const { pool } = require('./core/connection.js');
const { findNextAvailableId } = require('./core/idHelpers.js');
const authUserQueries = require('./queries/authUserQueries.js');
const inventoryQueries = require('./queries/inventoryQueries.js');
const adminQueries = require('./queries/adminQueries.js');
const shopQueries = require('./queries/shopQueries.js');
const combatQueries = require('./queries/combatQueries.js');

module.exports = {
    pool,
    findNextAvailableId,
    ...authUserQueries,
    ...inventoryQueries,
    ...adminQueries,
    ...shopQueries,
    ...combatQueries
};
