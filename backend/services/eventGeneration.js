require('../sql/database');
const {} = require('../sql/database.js');
const { getRandomItem } = require('./lootAlgorithm.js');

function generateEventType() {
    const roll = Math.random();
    let eventType;
    if (roll < 0.2) {
        eventType = 'trade';
    } else if (roll < 0.5) {
        eventType = 'loot';
    } else if (roll < 0.7) {
        eventType = 'yesOrNo';
    } else if (roll < 0.9) {
        eventType = 'trap';
    } else {
        eventType = 'dialogue';
    }

    return eventType;
}
function eventManager(dungeonName, dungeonLevel) {
    const eventType = generateEventType();
    switch (eventType) {
        case 'trade':
            break;
        case 'loot':
            const baseTier = getBaseTier(dungeonName, dungeonLevel);
            break;
        case 'yesOrNo':
            break;
        case 'trap':
            break;
        case 'dialogue':
            break;
        default:
            break;
    }
}

module.exports = {
    eventManager
};
