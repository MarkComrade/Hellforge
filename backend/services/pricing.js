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
    let markupMin = DEFAULT_MARKUP_MIN;
    if (Number.isFinite(options.markupMin)) markupMin = options.markupMin;

    let markupMax = DEFAULT_MARKUP_MAX;
    if (Number.isFinite(options.markupMax)) markupMax = options.markupMax;

    let safeBasePrice = Number(basePrice) || 0;
    if (safeBasePrice < 1) safeBasePrice = 1;

    const tierDiff = getTierDiff(itemTier, dungeonName, dungeonLevel);
    const tierMultiplier = 1 + tierDiff * 0.25;
    const randomMarkup = markupMin + Math.random() * (markupMax - markupMin);

    let adjustedPrice = Math.round(safeBasePrice * tierMultiplier * randomMarkup);
    if (adjustedPrice < 1) adjustedPrice = 1;

    return adjustedPrice;
}

function getMaxAllowedPrice(basePrice, itemTier, dungeonName, dungeonLevel, options = {}) {
    let markupMax = DEFAULT_MARKUP_MAX;
    if (Number.isFinite(options.markupMax)) markupMax = options.markupMax;

    let safeBasePrice = Number(basePrice) || 0;
    if (safeBasePrice < 1) safeBasePrice = 1;

    const tierDiff = getTierDiff(itemTier, dungeonName, dungeonLevel);
    const tierMultiplier = 1 + tierDiff * 0.25;

    let result = Math.round(safeBasePrice * tierMultiplier * markupMax);
    if (result < 1) result = 1;
    return result;
}

function withAdjustedPrice(item, dungeonName, dungeonLevel, options = {}) {
    const price = item ? item.price : undefined;
    const tier = item ? item.tier : undefined;
    const adjusted = calculateAdjustedPrice(price, tier, dungeonName, dungeonLevel, options);
    return Object.assign({}, item, { adjustedPrice: adjusted });
}

module.exports = {
    DEFAULT_MARKUP_MIN,
    DEFAULT_MARKUP_MAX,
    calculateAdjustedPrice,
    getMaxAllowedPrice,
    withAdjustedPrice
};
