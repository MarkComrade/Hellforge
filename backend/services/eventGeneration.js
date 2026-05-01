const database = {
    ...require('../sql/queries/inventoryQueries.js'),
    ...require('../sql/queries/shopQueries.js')
};
const { generateFinalLoot } = require('./lootAlgorithm.js');
const { withAdjustedPrice } = require('./pricing.js');

const DUNGEON_FALLBACK = 'crypt';
const MAX_LEVEL = 20;
const SHOP_MARKUP_MIN = 0.8;
const SHOP_MARKUP_MAX = 1.2;
const TRADE_DISCOUNT_MIN = 0.1;
const TRADE_DISCOUNT_MAX = 0.5;
const TRAP_GOLD_LOSS_MIN = 10;
const TRAP_GOLD_LOSS_MAX = 40;

const CURSED_TRAP_CARD_POOL = [
    { id: 901, name: 'Hellpact', effect: 'Power borrowed from hell is power paid in flesh' },
    {
        id: 902,
        name: 'Soul Sacrifice',
        effect: 'The souls you burn will not forget the hand that lit them'
    },
    { id: 903, name: 'Blood Pact', effect: 'Strength signed in blood is always collected' },
    {
        id: 904,
        name: 'Infernal Contract',
        effect: 'Every clause of this contract was written against you'
    },
    {
        id: 905,
        name: 'Damnation Strike',
        effect: "Strike with damnation's edge and bleed alongside your enemy"
    },
    { id: 906, name: 'Void Gamble', effect: 'The void gives generously and takes back everything' },
    { id: 907, name: 'Sacrifice Play', effect: 'To win the board, you lay yourself down first' },
    { id: 908, name: 'Black Mark', effect: 'Something has noticed you. It does not wish you well' },
    { id: 909, name: 'Tainted Blow', effect: 'The poison on this blade knows no master' },
    {
        id: 910,
        name: 'Cursed Reflex',
        effect: "Your instincts have been rewritten in someone else's ink"
    },
    { id: 911, name: 'Hex Wound', effect: 'The wound is not where the blade landed' },
    { id: 912, name: 'Void Drain', effect: 'Something feeds on your vitality from the other side' },
    { id: 913, name: 'Berserker Pact', effect: 'Fury this pure burns the one who holds it' },
    {
        id: 914,
        name: 'Cursed Flurry',
        effect: 'Swing wild enough and your own hands become the enemy'
    },
    { id: 915, name: 'Doom Volley', effect: 'When everything burns, so do you' },
    { id: 916, name: 'Forbidden Strength', effect: 'With great strength, great drawback comes' },
    { id: 917, name: 'Hell Roulette', effect: 'Spin the cylinder. The odds were never yours' },
    { id: 918, name: 'Ruinous Step', effect: 'Every step forward here costs something' },
    { id: 919, name: 'Cursed Whisper', effect: 'What you heard was not meant for living ears' },
    { id: 920, name: 'Hollow Strike', effect: 'The blow connected. So did the curse' },
    {
        id: 921,
        name: 'Marked',
        effect: 'Something has written your name somewhere you cannot read'
    },
    { id: 922, name: 'Wretched Touch', effect: 'Whatever this card once was, it is wretched now' },
    { id: 923, name: 'Blight Grasp', effect: 'To reach for this power is to grasp a thorn' },
    {
        id: 924,
        name: 'Doom Brand',
        effect: 'The brand is already on you. You just cannot see it yet'
    },
    { id: 925, name: 'Spectral Leech', effect: 'The ghost drinks from both ends of the wound' },
    { id: 926, name: 'Cursed Burden', effect: 'Some burdens, once carried, cannot be set down' },
    { id: 927, name: 'Hex Pulse', effect: 'The hex is brief. The memory is not' },
    { id: 928, name: 'Vile Scar', effect: 'Every scar from this place heals wrong' },
    { id: 929, name: 'Rot Touch', effect: 'What you touch rots. What touches you rots faster' },
    { id: 930, name: 'Tainted Pulse', effect: 'The taint has no loyalty' },
    {
        id: 931,
        name: 'Forsaken Strike',
        effect: 'Even the forsaken land their blows — on themselves'
    },
    { id: 932, name: 'Cursed Ache', effect: 'It does not hurt much. It just does not stop' },
    {
        id: 933,
        name: 'Withered Blow',
        effect: 'Withered by curse, it still falls — just not very far'
    },
    { id: 934, name: 'Shadow Sting', effect: 'Shadows do not sting without cause' },
    { id: 935, name: 'Foul Brand', effect: 'The brand is foul because it chose you freely' },
    { id: 936, name: 'Hex Lash', effect: 'The lash cuts twice: once forward, once back' },
    { id: 937, name: 'Plagued Touch', effect: 'The plague does not ask permission' },
    { id: 938, name: 'Cursed Miasma', effect: 'Breathe deep. The miasma was already inside you' },
    {
        id: 939,
        name: 'Wretched Blow',
        effect: 'The blow is wretched, but it still lands somewhere'
    },
    { id: 940, name: 'Dark Fumble', effect: 'In the dark, your hands work against you' }
];

function generateEventType() {
    const roll = Math.random();
    if (roll < 0.3) {
        return 'trade';
    }

    if (roll < 0.4) {
        return 'loot';
    }

    if (roll < 0.7) {
        return 'trap';
    }

    return 'dialogue';
}

function normalizeDungeonName(dungeonName) {
    const normalized = String(dungeonName || '')
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '_');

    if (!normalized) {
        return DUNGEON_FALLBACK;
    }

    return normalized;
}

function sanitizeLevel(dungeonLevel) {
    const parsed = Number(dungeonLevel);
    if (!Number.isInteger(parsed)) {
        return 1;
    }

    return Math.min(Math.max(parsed, 1), MAX_LEVEL);
}

function randomFromArray(values) {
    if (!Array.isArray(values) || values.length === 0) {
        return null;
    }
    return values[Math.floor(Math.random() * values.length)] || null;
}

function createSimpleEventPayload(type, title, description, choices = []) {
    return {
        success: true,
        type,
        title,
        description,
        choices,
        eventId: `${Date.now()}-${Math.floor(Math.random() * 1e6)}`
    };
}

function applyTradeDiscount(item, minDiscount, maxDiscount) {
    const discountPercent = minDiscount + Math.random() * (maxDiscount - minDiscount);
    const sourcePrice = Number(item?.adjustedPrice || item?.price || 0);
    const discountedPrice = Math.max(1, Math.round(sourcePrice * (1 - discountPercent)));

    return {
        ...item,
        adjustedPrice: discountedPrice
    };
}

async function generateTradeOffer(dungeon, dungeonName, dungeonLevel) {
    if (!dungeon) {
        return [];
    }

    const roomKey = `${dungeon.playerX},${dungeon.playerY}`;
    const cachedOffer = dungeon.shopStock?.[roomKey];
    if (Array.isArray(cachedOffer) && cachedOffer.length > 0) {
        return cachedOffer;
    }

    const items = await database.getRandomShopItems(1);
    if (!Array.isArray(items) || items.length === 0) {
        return [];
    }

    const pricedOffer = items
        .map((item) =>
            withAdjustedPrice(item, dungeonName, dungeonLevel, {
                markupMin: SHOP_MARKUP_MIN,
                markupMax: SHOP_MARKUP_MAX
            })
        )
        .map((item) => applyTradeDiscount(item, TRADE_DISCOUNT_MIN, TRADE_DISCOUNT_MAX));

    dungeon.shopStock[roomKey] = pricedOffer;
    return pricedOffer;
}

function generateTradeDialogue(dungeonName, dungeonLevel) {
    const level = Math.max(1, Number(dungeonLevel) || 1);
    const levelBand = level <= 3 ? 'low' : level <= 7 ? 'mid' : level <= 12 ? 'high' : 'endgame';

    const tradeDialogueByDungeon = {
        crypt: {
            low: [
                'A grave-robber smiles through cracked teeth and offers one relic below market value.',
                'From behind a broken tomb, a peddler reveals a single bargain wrapped in funeral cloth.'
            ],
            mid: [
                'A lantern-lit broker slides you one reliquary and names a price too low to trust.',
                'The merchant whispers that this piece was taken before the dead could reclaim it.'
            ],
            high: [
                'An undertaker-trader opens a velvet case and insists the deal ends with this room.',
                "A hooded scavenger offers one cursed-looking prize at a hunter's discount."
            ],
            endgame: [
                'A tomb broker bows once and offers a kingly relic for less than it should ever cost.',
                "The crypt's last merchant names a blood-cheap price for a single forbidden prize."
            ]
        },
        labyrinth: {
            low: [
                'A maze runner emerges from a false wall with one item and a surprisingly soft price.',
                'The trader swears this bargain disappears when the corridor shifts again.'
            ],
            mid: [
                'A horn-marked merchant offers one shortcut in the form of steel and leather.',
                'From a rotating passage, a dealer presents a single discount before the walls close.'
            ],
            high: [
                'A battered survivor unloads one elite piece cheap, eager to travel lighter.',
                "The labyrinth's broker says the minotaur is near, so the price drops now."
            ],
            endgame: [
                "At the maze core, a final merchant offers one champion's bargain and nothing more.",
                'The walls grind shut while a trader presses one last discounted offer into view.'
            ]
        },
        laboratory: {
            low: [
                'A salvage tech opens a case of recovered gear and marks one prototype down for speed.',
                'A soot-stained researcher offers a single underpriced tool before alarms return.'
            ],
            mid: [
                'A black-market scientist slides one field-tested item across the bench at a favor price.',
                'The trader claims the lab is about to lock down, so one item goes cheap.'
            ],
            high: [
                'A smuggler in a hazard cloak offers one unstable upgrade at a deep cut.',
                'Between reactor pulses, a broker promises this prototype is worth more than the asking price.'
            ],
            endgame: [
                "At the edge of meltdown, a director's fixer unloads one masterpiece for a desperate discount.",
                "The lab's last broker offers a single forbidden device at a price that ignores reason."
            ]
        },
        gates_of_hell: {
            low: [
                'A scorched dealer kicks ash from a satchel and offers one infernal bargain.',
                'A chain-bound merchant names a gentle price before the fires notice you both.'
            ],
            mid: [
                'A devilish quartermaster offers one war spoil below cost, eager to keep moving.',
                'The trader grins and says one item is cheap today because hell is hungry.'
            ],
            high: [
                'A horned broker reveals one battlefield trophy at a price meant to tempt fools and victors alike.',
                'The merchant swears the next patrol is close, so this single offer comes discounted.'
            ],
            endgame: [
                'At the gate itself, a damned trader offers one hell-forged prize for a shockingly kind sum.',
                'A final infernal merchant lowers the price on one relic before vanishing into the ashstorm.'
            ]
        }
    };

    const lines = (tradeDialogueByDungeon[dungeonName] || tradeDialogueByDungeon.crypt)[levelBand];
    return randomFromArray(lines) || 'A merchant offers one item at an unusually favorable price.';
}

function generateLootDialogue(dungeonName, dungeonLevel) {
    const level = Math.max(1, Number(dungeonLevel) || 1);
    const levelBand = level <= 3 ? 'low' : level <= 7 ? 'mid' : level <= 12 ? 'high' : 'endgame';

    const lootDialogueByDungeon = {
        crypt: {
            low: [
                'You brush dust from a cracked chest and find something still untouched.',
                'A loose skull rolls aside, revealing a hidden stash beneath it.'
            ],
            mid: [
                'A bone-locked reliquary snaps open with a dry crack.',
                'Between broken sarcophagi, a forgotten cache glints in torchlight.'
            ],
            high: [
                'You pry open a cursed coffer while whispers rise from the walls.',
                'A grave-sealed vault yields relics that should have stayed buried.'
            ],
            endgame: [
                "An ancient tomb king's tribute spills out at your feet.",
                'The crypt grants a blood-price reward to the one still standing.'
            ]
        },
        labyrinth: {
            low: [
                'A false wall shifts, exposing supplies left by someone less lucky.',
                'You find a hidden niche where the maze keeps its offerings.'
            ],
            mid: [
                'Behind a turning slab, a sealed satchel waits untouched.',
                'You follow fresh scrape marks to a cache behind the stone.'
            ],
            high: [
                'At a dead-end shrine, you uncover loot meant for the maze champion.',
                'A trapped alcove opens just long enough for you to claim its prize.'
            ],
            endgame: [
                "At the maze core, a victor's hoard waits beneath shattered horns.",
                'The labyrinth yields a final tribute to your persistence.'
            ]
        },
        laboratory: {
            low: [
                'You crack open a supply crate marked with faded hazard runes.',
                'A maintenance locker pops open with useful salvage inside.'
            ],
            mid: [
                'A specimen drawer hides loot beside shattered vials.',
                'You recover a secured bundle from under a scorched console.'
            ],
            high: [
                'A containment rack unlocks, releasing valuable experimental gear.',
                "You tear open an emergency vault and claim the lab's reserves."
            ],
            endgame: [
                "From the director's cache, prototype treasures spill into your hands.",
                'The final reactor vault opens and yields a forbidden reward.'
            ]
        },
        gates_of_hell: {
            low: [
                'Among smoldering ash, you spot valuables not yet consumed by fire.',
                "A sinner's cache lies hidden beneath blackened chains."
            ],
            mid: [
                'A scorched war chest cracks open under your blade.',
                'You claim a tribute pile abandoned in the infernal rush.'
            ],
            high: [
                "A demon captain's spoils are yours after a brutal search.",
                'From a molten altar, you pull loot still burning at the edges.'
            ],
            endgame: [
                "Hell's tribute chest bursts open under crimson lightning.",
                'At the gate itself, the abyss offers one final prize.'
            ]
        }
    };

    const lines = (lootDialogueByDungeon[dungeonName] || lootDialogueByDungeon.crypt)[levelBand];
    return randomFromArray(lines) || 'You uncover a small cache of loot.';
}

async function resolveTrapEvent(playerID) {
    const safePlayerId = Number(playerID);
    if (!Number.isInteger(safePlayerId) || safePlayerId <= 0) {
        return createSimpleEventPayload(
            'dialogue',
            'Silent Trap',
            'A trap springs, but without a registered adventurer profile its effects cannot be applied.'
        );
    }

    const trapRoll = Math.random();

    if (trapRoll < 1 / 3) {
        const curseResult = await database.curseRandomItemCard(safePlayerId, CURSED_TRAP_CARD_POOL);
        if (!curseResult.success || !curseResult.cardSwap) {
            return createSimpleEventPayload(
                'trap',
                'Misfired Rune',
                'A curse rune flares and fizzles before it can bind to your gear.'
            );
        }

        const cursedMeta =
            CURSED_TRAP_CARD_POOL.find((card) => card.id === curseResult.cardSwap.newCardId) ||
            null;

        return createSimpleEventPayload(
            'trap',
            'Hexed Card Sigil',
            `A trap sigil rewrites one of your item cards into "${cursedMeta?.name || 'Cursed Card'}" (${cursedMeta?.effect || 'harmful'}).`
        );
    }

    if (trapRoll < 2 / 3) {
        const totalGoldResult = await database.getTotalGold(safePlayerId);
        const totalGold =
            (Number(totalGoldResult?.gold?.stash) || 0) +
            (Number(totalGoldResult?.gold?.loadout) || 0);

        const lossPercent =
            TRAP_GOLD_LOSS_MIN +
            Math.floor(Math.random() * (TRAP_GOLD_LOSS_MAX - TRAP_GOLD_LOSS_MIN + 1));

        let amountToLose = Math.floor((totalGold * lossPercent) / 100);
        if (amountToLose < 1 && totalGold > 0) {
            amountToLose = 1;
        }
        if (amountToLose > totalGold) {
            amountToLose = totalGold;
        }

        const goldResult = await database.applyGoldTrapLoss(safePlayerId, amountToLose);

        if (!goldResult.success || Number(goldResult.lostGold || 0) <= 0) {
            return createSimpleEventPayload(
                'trap',
                'Empty Purse Snare',
                'A coin-draining mechanism triggers, but you have no gold for it to steal.'
            );
        }

        return createSimpleEventPayload(
            'trap',
            'Coin Siphon',
            `Hidden claws skim ${lossPercent}% of your gold (${goldResult.lostGold} lost).`
        );
    }

    const itemResult = await database.deleteRandomNonEquippedItem(safePlayerId);
    if (!itemResult.success || !itemResult.deletedItem) {
        return createSimpleEventPayload(
            'trap',
            'Item Crusher',
            'An item-crushing trap slams shut, but all your remaining gear is currently equipped.'
        );
    }

    const deleted = itemResult.deletedItem;
    const deletedType = deleted.weapon_id
        ? 'weapon'
        : deleted.armor_id
          ? 'armor'
          : deleted.misc_item_id
            ? 'item'
            : 'gear';

    return createSimpleEventPayload(
        'trap',
        'Item Crusher',
        `A crushing plate destroys one non-equipped ${deletedType} from your inventory.`
    );
}

async function eventManager(dungeon, playerID) {
    const dungeonName = dungeon?.dungeonName;
    const dungeonLevel = dungeon?.dungeonLevel;
    const eventType = generateEventType();
    const safeDungeon = normalizeDungeonName(dungeonName);
    const safeLevel = sanitizeLevel(dungeonLevel);

    switch (eventType) {
        case 'trade': {
            const offer = await generateTradeOffer(dungeon, safeDungeon, safeLevel);
            if (offer.length === 0) {
                return createSimpleEventPayload(
                    'dialogue',
                    'Empty Satchel',
                    'A merchant pats empty pockets, offers an apology, and disappears into the dark.'
                );
            }

            return {
                success: true,
                type: 'trade',
                title: 'Traveling Merchant',
                description: generateTradeDialogue(safeDungeon, safeLevel),
                items: offer,
                eventId: `${Date.now()}-${Math.floor(Math.random() * 1e6)}`
            };
        }
        case 'loot': {
            const safePlayerId = Number(playerID);
            if (!Number.isInteger(safePlayerId) || safePlayerId <= 0) {
                return createSimpleEventPayload(
                    'dialogue',
                    'Locked Cache',
                    'You find a sealed cache, but without a registered adventurer profile it remains closed.'
                );
            }

            const lootResult = await generateFinalLoot(safePlayerId, safeDungeon, safeLevel);
            if (!lootResult || lootResult.success === false) {
                return createSimpleEventPayload(
                    'dialogue',
                    'Empty Chamber',
                    'You search the room, but nothing of value remains.'
                );
            }

            return {
                ...lootResult,
                type: 'loot',
                title: 'Hidden Cache',
                description: generateLootDialogue(safeDungeon, safeLevel)
            };
        }

        case 'trap':
            return resolveTrapEvent(playerID);
        case 'dialogue': {
            const dungeonDialogues = generateDialogue(safeDungeon, safeLevel);
            const pickedDialogue =
                randomFromArray(dungeonDialogues) || 'The dungeon watches in silence.';
            return createSimpleEventPayload('dialogue', 'Dungeon Whisper', pickedDialogue);
        }
        default:
            return createSimpleEventPayload('dialogue', 'Silence', 'Nothing happens.');
    }
}
function generateDialogue(dungeonName, dungeonLevel) {
    const level = Math.max(1, Number(dungeonLevel) || 1);
    const levelBand = level <= 3 ? 'low' : level <= 7 ? 'mid' : level <= 12 ? 'high' : 'endgame';

    // Each dungeon tier contains at least 10 lines.
    const dialoguesByDungeon = {
        crypt: {
            low: [
                ` Dust-choked coffins crack as old bones begin to stir.`,
                ` A cold draft crawls through the crypt and extinguishes your torch.`,
                ` Candlelight trembles as tiny skulls roll across the floor.`,
                ` You brush aside cobwebs and uncover a freshly disturbed grave.`,
                ` A rusted bell rings once, though no living hand touched it.`,
                ` Loose bones clatter from the shelves when you pass.`,
                ` Moist soil leaks between cracked tiles beneath your boots.`,
                ` A faded epitaph glows faintly, then fades into darkness.`,
                ` Your breath fogs in the sudden grave-cold air.`,
                ` A broken sarcophagus lid scrapes open by itself.`
            ],
            mid: [
                ` Rattling skeletons patrol the aisles as if guarding a secret rite.`,
                ` The smell of rot thickens, and claw marks scar the stone sarcophagi.`,
                ` Rotting banners sway over a corridor lined with black urns.`,
                ` Bone totems stitched with sinew mark a forbidden chamber.`,
                ` A necromancer's chant echoes from below the crypt floor.`,
                ` Funeral braziers flare green as shadowy forms gather.`,
                ` A sealed tomb leaks dark mist that coils around your ankles.`,
                ` Fresh claw marks lead toward a newly broken reliquary.`,
                ` You find boot prints that end abruptly at a wall.`,
                ` Dozens of empty eye sockets seem fixed on your movement.`
            ],
            high: [
                ` Necrotic runes pulse across the walls, feeding on every heartbeat.`,
                ` A mass grave has split open, and something ancient is awake below.`,
                ` Graveknights kneel in a ring around a blood-stained altar.`,
                ` A tomb guardian drags a chained blade through shattered bones.`,
                ` Purple-black flame crawls over coffins without consuming them.`,
                ` A cursed crown rests on a skull that still whispers.`,
                ` The ceiling cracks, dropping fistfuls of funeral ash.`,
                ` A choir of the dead hums from behind sealed walls.`,
                ` Your shadow lags behind, as if reluctant to follow.`,
                ` An ossuary gate unlocks with a sound like breaking ribs.`
            ],
            endgame: [
                ` Funeral bells echo from nowhere as the crypt itself seems alive.`,
                ` The dead kneel in silence, waiting for a command not meant for mortals.`,
                ` A lich throne rises from the floor, carved from fused skeletons.`,
                ` Rivers of grave-light pour from cracks in the mausoleum walls.`,
                ` Thousand-year-old kings open their eyes in unison.`,
                ` A death sigil blooms overhead and smothers all sound.`,
                ` The catacombs rearrange into a ritual labyrinth of bones.`,
                ` A colossal sarcophagus unlocks with a scream of metal.`,
                ` Every corpse in sight turns to face you at once.`,
                ` The crypt's heart beats beneath your feet like a war drum.`
            ]
        },
        labyrinth: {
            low: [
                ` The maze shifts behind you, erasing the path you just walked.`,
                ` Whispering voices trade your name between the stone corridors.`,
                ` Chalk arrows you drew moments ago have vanished.`,
                ` A dead-end wall slides away when you look elsewhere.`,
                ` A faint laugh travels down three passages at once.`,
                ` Wind whistles from a corridor that does not exist on your map.`,
                ` Old carvings shift into new symbols while you watch.`,
                ` Footprints appear ahead of you, matching your boots.`,
                ` A lantern at the far turn goes dark as you approach.`,
                ` Pebbles roll uphill toward the maze center.`
            ],
            mid: [
                ` Marked walls twist into unfamiliar angles as the labyrinth learns your route.`,
                ` Footsteps follow at a distance, always one turn out of sight.`,
                ` Stone teeth grind inside the walls whenever you hesitate.`,
                ` You hear chains dragging from beyond a locked archway.`,
                ` False doors lure you into rooms that seal behind you.`,
                ` Dust spirals form arrows that point in different directions.`,
                ` Hidden pressure plates click beneath loose gravel.`,
                ` A horn blast echoes, and the maze falls eerily silent.`,
                ` Broken spears line a corridor like warning stakes.`,
                ` A mirrored hall reflects a version of you that stands still.`
            ],
            high: [
                ` Echoes split in two directions, but only one of them is yours.`,
                ` The center feels close, yet every archway bends you farther away.`,
                ` Minotaur runes glow red on the walls near each junction.`,
                ` The floor trembles as something massive charges nearby.`,
                ` Spiked gates slam shut behind you without warning.`,
                ` A blood trail loops back to where it began.`,
                ` Blade traps reset with clockwork precision around you.`,
                ` The ceiling lowers in pulses like a giant heartbeat.`,
                ` Roars bounce through the maze and shake loose stone dust.`,
                ` A shattered shrine marks territory you were never meant to enter.`
            ],
            endgame: [
                ` The maze seals itself in a thunder of stone and hunting horns.`,
                ` A colossal shadow crosses the ceiling, matching your turns perfectly.`,
                ` Crimson torches ignite one by one toward the final arena.`,
                ` A gigantic gate etched with horns unlocks from within.`,
                ` Every corridor narrows, funneling you to the heart.`,
                ` Drums boom from under the stone as the walls begin to close.`,
                ` The maze redraws itself into a kill-path around you.`,
                ` Ancient judges carved in stone turn their heads as you pass.`,
                ` A beast's breath steams through cracks in the central doors.`,
                ` The labyrinth's core opens like the jaws of a titan.`
            ]
        },
        laboratory: {
            low: [
                ` Glass tubes bubble with unstable mixtures and acrid green vapor.`,
                ` A half-finished construct twitches on a metal slab as lightning flickers.`,
                ` Copper pipes hiss as coolant leaks onto cracked tiles.`,
                ` A notebook describes experiments in hurried, panicked handwriting.`,
                ` Rows of jars hold organs that should not still be beating.`,
                ` Tiny servo-spiders scatter into vents as you enter.`,
                ` A test chamber window is smeared from inside.`,
                ` Coils spark overhead and throw strobing shadows.`,
                ` A chemical spill eats slowly through a steel grate.`,
                ` An autopsy table is still warm to the touch.`
            ],
            mid: [
                ` Alchemical fires burn blue while notes describe forbidden human trials.`,
                ` Clockwork limbs clatter in the dark, searching for missing components.`,
                ` A restraint chair jerks as if someone is still bound in it.`,
                ` Mutagen tanks pulse with bioluminescent sludge.`,
                ` Lab alarms blink red but emit no sound.`,
                ` A grafted hound snarls from behind cracked glass.`,
                ` Steel shutters drop and lock sections of the hall.`,
                ` Surgical drones hover silently above blood-marked trays.`,
                ` A pressure gauge spikes when you step near the reactor wing.`,
                ` Prototype armor stands stand in formation, tracking your movement.`
            ],
            high: [
                ` A giant reactor throbs against its chains, ready to rupture.`,
                ` Mutated specimens claw at reinforced glass, drawn by your movement.`,
                ` Containment doors cycle open and shut on corrupted commands.`,
                ` Arc lightning leaps across catwalks with lethal precision.`,
                ` A fusion vat overflows with flesh-metal hybrids.`,
                ` The central AI repeats one phrase: Subject escaped.`,
                ` A hulking construct tears free from magnetic clamps.`,
                ` Shock lances descend from the ceiling in timed bursts.`,
                ` Your compass spins as gravity pulses through the chamber.`,
                ` Failed prototypes line the walls, still reaching for you.`
            ],
            endgame: [
                ` The master experiment has escaped containment and stalks the upper gantries.`,
                ` Reality warps around cracked apparatus, as if the lab rewrote natural law.`,
                ` The final reactor begins a catastrophic overload countdown.`,
                ` A colossal bio-engineered horror drags chains through molten steel.`,
                ` Emergency sirens chant evacuation orders in a dead language.`,
                ` Antimatter coils hum while gravity folds around the core.`,
                ` The director's chamber unlocks and floods with sterile fog.`,
                ` Every monitor displays your vitals and projected death time.`,
                ` Autonomous turrets switch to purge protocol on your location.`,
                ` The lab collapses inward as its experiments tear open space.`
            ]
        },
        gates_of_hell: {
            low: [
                ` Sulfurous wind blasts through the iron gate and chars the ground.`,
                ` Distant screams rise and fall like a choir from the abyss.`,
                ` Ember rain falls softly and burns through cloth.`,
                ` Black ash drifts from above like cursed snow.`,
                ` A cracked obelisk oozes molten runes onto the path.`,
                ` Chains rattle beneath the basalt floor with each step.`,
                ` A distant infernal horn announces your arrival.`,
                ` Flame vents erupt from fissures at random intervals.`,
                ` Charred statues of sinners bow toward the gate.`,
                ` A demon sigil smolders where your shadow falls.`
            ],
            mid: [
                ` Infernal chains drag across basalt as lesser demons prowl the rim.`,
                ` Rivers of ember-light divide the path, boiling with cursed souls.`,
                ` Hellhounds patrol the bridges between burning pits.`,
                ` War drums pulse from fortified towers of obsidian.`,
                ` Fire imps dive from broken battlements above.`,
                ` A branded execution ground crackles with fresh heat.`,
                ` Demonic standards snap in a wind that smells of blood.`,
                ` A pit warden drags a hooked chain through the dust.`,
                ` Lava geysers erupt beside narrow causeways.`,
                ` The sky darkens with winged scavengers circling overhead.`
            ],
            high: [
                ` War banners of the damned ignite above battlements carved from bone.`,
                ` A horned sentinel watches in silence, hand resting on a runed blade.`,
                ` Siege engines hurl burning skulls across the horizon.`,
                ` A legion marshal marks your name in brimstone.`,
                ` Abyssal portals crack open and spit out elite hunters.`,
                ` A molten colossus rises from a pit and roars.`,
                ` Cursed artillery locks onto your movement from afar.`,
                ` The road is paved with shattered halos and broken chains.`,
                ` A blood moon hangs low, feeding the flames below.`,
                ` Demon captains chant battle hymns around a black altar.`
            ],
            endgame: [
                ` The gates yawn wide, and the heat feels like a god's wrath.`,
                ` Archdemons chant your fate while the sky fractures with red lightning.`,
                ` A throne of magma rises as the final court convenes.`,
                ` Chains of the damned tighten around a world-sized seal.`,
                ` Infernal choirs scream as reality thins at the gate.`,
                ` A prince of hell descends with a blade of living fire.`,
                ` Meteoric embers rain down and reshape the battlefield.`,
                ` The abyss opens beneath you, revealing endless war below.`,
                ` Every bell in hell tolls once for your arrival.`,
                `The final seal cracks, and the legion surges forward.`
            ]
        }
    };

    const dungeonDialogues = (dialoguesByDungeon[dungeonName] || dialoguesByDungeon.crypt)[
        levelBand
    ];
    return dungeonDialogues;
}

module.exports = {
    eventManager,
    CURSED_TRAP_CARD_POOL
};
