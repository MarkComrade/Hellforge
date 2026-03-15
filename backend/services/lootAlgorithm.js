function getWeakestGear(inventory) {
    const helmetTier = Number(inventory?.helmet_tier) || 1;
    const armorTier = Number(inventory?.armor_tier) || 1;
    const meleeTier = Number(inventory?.melee_tier) || 1;
    const rangedTier = Number(inventory?.ranged_tier) || 1;

    const slots = [
        { slot: 'helmet', tier: helmetTier, group: 'armor' },
        { slot: 'armor', tier: armorTier, group: 'armor' },
        { slot: 'melee', tier: meleeTier, group: 'weapon' },
        { slot: 'ranged', tier: rangedTier, group: 'weapon' }
    ];

    const averageTier = (helmetTier + armorTier + meleeTier + rangedTier) / 4;
    const weakest = slots.reduce((minSlot, current) =>
        current.tier < minSlot.tier ? current : minSlot
    );

    return {
        averageTier,
        weakestSlot: weakest.slot
    };
}
//dungein tipus kulonbseg
//altag gearhez kepest pluisz minusz loot rng
//hardcap dungeonokon
//leggyengebb item upgrade
//loot table szintenkent
//varja a dungeon szintet tipust es player idt
//visszaadja a lootot es a leggyengebb itemet amire upgradeelni lehetne
//

module.exports = {
    getWeakestGear
};
