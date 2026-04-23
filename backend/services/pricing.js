const { getBaseTier, normalizeDungeonKey } = require('./lootAlgorithm.js');

const DEFAULT_MARKUP_MIN = 0.8;
const DEFAULT_MARKUP_MAX = 1.2;

function clampTierDiff(tierDiff) {
    if (tierDiff < -3) return -3;
    if (tierDiff > 3) return 3;
    return tierDiff;
}

function getTierDiff(itemTier, dungeonName, dungeonLevel) {
    const dungeonKey = normalizeDungeonKey(dungeonName);
    const dungeonTier = getBaseTier(dungeonKey, dungeonLevel);
    const rawDiff = Number(itemTier || 0) - dungeonTier;
    return clampTierDiff(rawDiff);
}

function calculateAdjustedPrice(basePrice, itemTier, dungeonName, dungeonLevel, options = {}) {
    const markupMin = Number.isFinite(options.markupMin) ? options.markupMin : DEFAULT_MARKUP_MIN;
    const markupMax = Number.isFinite(options.markupMax) ? options.markupMax : DEFAULT_MARKUP_MAX;
    const safeBasePrice = Math.max(1, Number(basePrice) || 0);

    const tierDiff = getTierDiff(itemTier, dungeonName, dungeonLevel);
    const tierMultiplier = 1 + tierDiff * 0.25;
    const randomMarkup = markupMin + Math.random() * (markupMax - markupMin);
    const adjustedPrice = Math.max(1, Math.round(safeBasePrice * tierMultiplier * randomMarkup));

    return adjustedPrice;
}

function getMaxAllowedPrice(basePrice, itemTier, dungeonName, dungeonLevel, options = {}) {
    const markupMax = Number.isFinite(options.markupMax) ? options.markupMax : DEFAULT_MARKUP_MAX;
    const safeBasePrice = Math.max(1, Number(basePrice) || 0);

    const tierDiff = getTierDiff(itemTier, dungeonName, dungeonLevel);
    const tierMultiplier = 1 + tierDiff * 0.25;

    return Math.max(1, Math.round(safeBasePrice * tierMultiplier * markupMax));
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
