const { getBaseTier, normalizeDungeonKey } = require('./lootAlgorithm.js');

const DEFAULT_MARKUP_MIN = 0.8;
const DEFAULT_MARKUP_MAX = 1.2;

function getTierDiff(itemTier, dungeonName, dungeonLevel) {
    const dungeonTier = getBaseTier(normalizeDungeonKey(dungeonName), dungeonLevel);
    let diff = Number(itemTier || 0) - dungeonTier;
    if (diff < -3) diff = -3;
    if (diff > 3) diff = 3;
    return diff;
}

function calculateAdjustedPrice(basePrice, itemTier, dungeonName, dungeonLevel, options = {}) {
    const markupMin = options.markupMin || DEFAULT_MARKUP_MIN;
    const markupMax = options.markupMax || DEFAULT_MARKUP_MAX;
    const price = Math.max(1, Number(basePrice) || 0);

    const tierMultiplier = 1 + getTierDiff(itemTier, dungeonName, dungeonLevel) * 0.25;
    const markup = markupMin + Math.random() * (markupMax - markupMin);

    return Math.max(1, Math.round(price * tierMultiplier * markup));
}

function getMaxAllowedPrice(basePrice, itemTier, dungeonName, dungeonLevel, options = {}) {
    const markupMax = options.markupMax || DEFAULT_MARKUP_MAX;
    const price = Math.max(1, Number(basePrice) || 0);

    const tierMultiplier = 1 + getTierDiff(itemTier, dungeonName, dungeonLevel) * 0.25;

    return Math.max(1, Math.round(price * tierMultiplier * markupMax));
}

function withAdjustedPrice(item, dungeonName, dungeonLevel, options = {}) {
    return {
        ...item,
        adjustedPrice: calculateAdjustedPrice(
            item?.price,
            item?.tier,
            dungeonName,
            dungeonLevel,
            options
        )
    };
}

module.exports = {
    DEFAULT_MARKUP_MIN,
    DEFAULT_MARKUP_MAX,
    calculateAdjustedPrice,
    getMaxAllowedPrice,
    withAdjustedPrice
};
