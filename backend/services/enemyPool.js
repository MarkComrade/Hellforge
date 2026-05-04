'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// enemyPool.js
//
// 4 dungeons × 4 enemies = 16 archetypes.
// Each enemy has exactly 5 cards with a likelihood weight for selection.
//
// Card effects available to enemies (no extraPlays, no strength):
//   damage    – dealt to player
//   block     – gained by the enemy
//   bleed     – applied to player (stacking DoT)
//   scorch    – applied to player (stacking DoT)
//   vulnerable– applied to player { pct, turns }
//   lifesteal – enemy heals % of damage it deals { pct, turns }
//   healing   – enemy heals directly
//
// Cards tagged defensive: true are only selected when HP < LOW_HP_THRESHOLD.
// All other cards are only selected when HP >= LOW_HP_THRESHOLD.
//
// Damage and healing values are base stats at level 1.
// generateEnemy() scales them by dungeon level before storing on the session.
// ─────────────────────────────────────────────────────────────────────────────

const LOW_HP_THRESHOLD = 0.3; // below 30 % HP → switch to defensive cards
const DMG_SCALE_PER_LEVEL = 0.1; // +10 % per level above 1   (e.g. lvl 5 = ×1.40)

// ─────────────────────────────────────────────────────────────────────────────
// Archetypes
// ─────────────────────────────────────────────────────────────────────────────

const ENEMY_POOL = {
    crypt: [
        {
            id: 'skeleton',
            name: 'Skeleton',
            img_path: '/textures/characters/crypt_skeleton.png',
            baseHp: 22,
            hpPerLevel: 4,
            cardsPerTurn: { min: 1, max: 2 },
            cards: [
                { name: 'Rusty Slash', likelihood: 30, effects: { damage: 6 } },
                { name: 'Bone Tear', likelihood: 25, effects: { damage: 5, bleed: 2 } },
                { name: 'Heavy Swing', likelihood: 20, effects: { damage: 9 } },
                { name: 'Bone Shield', likelihood: 15, effects: { block: 10 }, defensive: true },
                {
                    name: 'Dark Feast',
                    likelihood: 10,
                    effects: { lifesteal: { pct: 20, turns: 2 } },
                    defensive: true
                }
            ]
        },
        {
            id: 'zombie',
            name: 'Zombie',
            img_path: '/textures/characters/crypt_zombie.png',
            baseHp: 32,
            hpPerLevel: 5,
            cardsPerTurn: { min: 1, max: 2 },
            cards: [
                { name: 'Rotting Bite', likelihood: 30, effects: { damage: 8, bleed: 2 } },
                { name: 'Crushing Slam', likelihood: 25, effects: { damage: 11 } },
                { name: 'Corpse Burn', likelihood: 20, effects: { scorch: 3 } },
                { name: 'Rotten Guard', likelihood: 15, effects: { block: 13 }, defensive: true },
                {
                    name: 'Undead Recovery',
                    likelihood: 10,
                    effects: { healing: 9 },
                    defensive: true
                }
            ]
        },
        {
            id: 'crypt_guard',
            name: 'Crypt Guard',
            img_path: '/textures/characters/crypt_guard.png',
            baseHp: 28,
            hpPerLevel: 5,
            cardsPerTurn: { min: 1, max: 2 },
            cards: [
                { name: 'Guard Strike', likelihood: 30, effects: { damage: 8 } },
                {
                    name: 'Crippling Slash',
                    likelihood: 25,
                    effects: { damage: 6, vulnerable: { pct: 20, turns: 1 } }
                },
                { name: 'Shield Raise', likelihood: 20, effects: { block: 12 } },
                {
                    name: 'Fortified Guard',
                    likelihood: 15,
                    effects: { block: 16 },
                    defensive: true
                },
                {
                    name: 'Soul Drain',
                    likelihood: 10,
                    effects: { lifesteal: { pct: 20, turns: 2 } },
                    defensive: true
                }
            ]
        },
        {
            id: 'wraith',
            name: 'Wraith',
            img_path: '/textures/characters/crypt_wraith.png',
            baseHp: 20,
            hpPerLevel: 3,
            cardsPerTurn: { min: 1, max: 2 },
            cards: [
                { name: 'Spectral Burn', likelihood: 25, effects: { damage: 5, scorch: 2 } },
                { name: 'Phantom Claw', likelihood: 25, effects: { damage: 5, bleed: 2 } },
                {
                    name: 'Haunting Hex',
                    likelihood: 20,
                    effects: { vulnerable: { pct: 20, turns: 2 } }
                },
                {
                    name: 'Soul Siphon',
                    likelihood: 20,
                    effects: { lifesteal: { pct: 20, turns: 2 } },
                    defensive: true
                },
                { name: 'Ghostly Veil', likelihood: 10, effects: { block: 10 }, defensive: true }
            ]
        },
        {
            id: 'giant_spider',
            name: 'Giant Spider',
            img_path: '/textures/characters/crypt_giant_spider.png',
            baseHp: 18,
            hpPerLevel: 3,
            cardsPerTurn: { min: 1, max: 2 },
            cards: [
                { name: 'Venomous Bite', likelihood: 30, effects: { damage: 5, bleed: 3 } },
                {
                    name: 'Web Spit',
                    likelihood: 25,
                    effects: { damage: 4, vulnerable: { pct: 25, turns: 2 } }
                },
                { name: 'Fang Strike', likelihood: 20, effects: { damage: 7, scorch: 2 } },
                {
                    name: 'Silk Shroud',
                    likelihood: 15,
                    effects: { block: 9 },
                    defensive: true
                },
                {
                    name: 'Drain Prey',
                    likelihood: 10,
                    effects: { lifesteal: { pct: 25, turns: 2 } },
                    defensive: true
                }
            ]
        },
        {
            id: 'lich',
            name: 'ArcLich',
            img_path: '/textures/characters/crypt_lich.png',
            baseHp: 26,
            hpPerLevel: 4,
            cardsPerTurn: { min: 1, max: 2 },
            cards: [
                { name: 'Necrotic Bolt', likelihood: 28, effects: { damage: 7, bleed: 2 } },
                { name: 'Plague Touch', likelihood: 24, effects: { bleed: 3, scorch: 2 } },
                {
                    name: 'Soul Sap',
                    likelihood: 20,
                    effects: { damage: 9, lifesteal: { pct: 30, turns: 1 } }
                },
                {
                    name: 'Bone Fortress',
                    likelihood: 18,
                    effects: { block: 14 },
                    defensive: true
                },
                {
                    name: 'Dark Ritual',
                    likelihood: 10,
                    effects: { healing: 11 },
                    defensive: true
                }
            ]
        }
    ],

    labyrinth: [
        {
            id: 'minotaur',
            name: 'Minotaur',
            img_path: '/textures/characters/labyrinth_minotaur.png',
            baseHp: 52,
            hpPerLevel: 8,
            cardsPerTurn: { min: 1, max: 3 },
            cards: [
                { name: 'Brutal Smash', likelihood: 30, effects: { damage: 15 } },
                { name: 'Horn Rend', likelihood: 25, effects: { damage: 12, bleed: 3 } },
                {
                    name: 'Crippling Charge',
                    likelihood: 20,
                    effects: { damage: 19, vulnerable: { pct: 25, turns: 1 } }
                },
                { name: 'Thick Hide', likelihood: 15, effects: { block: 18 }, defensive: true },
                {
                    name: 'Battle Recovery',
                    likelihood: 10,
                    effects: { healing: 15 },
                    defensive: true
                }
            ]
        },
        {
            id: 'stone_golem',
            name: 'Stone Golem',
            img_path: '/textures/characters/labyrinth_stone_golem.png',
            baseHp: 68,
            hpPerLevel: 10,
            cardsPerTurn: { min: 1, max: 2 },
            cards: [
                { name: 'Stone Fist', likelihood: 25, effects: { damage: 18 } },
                {
                    name: 'Crushing Blow',
                    likelihood: 25,
                    effects: { damage: 13, vulnerable: { pct: 20, turns: 2 } }
                },
                { name: 'Rock Shield', likelihood: 20, effects: { block: 24 } },
                { name: 'Granite Wall', likelihood: 20, effects: { block: 28 }, defensive: true },
                { name: 'Core Repair', likelihood: 10, effects: { healing: 17 }, defensive: true }
            ]
        },
        {
            id: 'shadow_knight',
            name: 'Shadow Knight',
            img_path: '/textures/characters/labyrinth_shadow_knight.png',
            baseHp: 46,
            hpPerLevel: 7,
            cardsPerTurn: { min: 1, max: 3 },
            cards: [
                { name: 'Shadow Rend', likelihood: 25, effects: { damage: 14, bleed: 3 } },
                {
                    name: 'Darkened Strike',
                    likelihood: 25,
                    effects: { damage: 16, vulnerable: { pct: 25, turns: 2 } }
                },
                { name: 'Cursed Flame', likelihood: 20, effects: { damage: 11, scorch: 3 } },
                { name: 'Night Guard', likelihood: 20, effects: { block: 20 }, defensive: true },
                {
                    name: 'Blood Drain',
                    likelihood: 10,
                    effects: { lifesteal: { pct: 28, turns: 2 } },
                    defensive: true
                }
            ]
        },
        {
            id: 'labyrinth_stalker',
            name: 'Labyrinth Stalker',
            img_path: '/textures/characters/labyrinth_stalker.png',
            baseHp: 40,
            hpPerLevel: 7,
            cardsPerTurn: { min: 1, max: 3 },
            cards: [
                { name: 'Jagged Claw', likelihood: 25, effects: { damage: 12, bleed: 3 } },
                { name: 'Burning Pounce', likelihood: 25, effects: { damage: 9, scorch: 4 } },
                {
                    name: 'Predator Gaze',
                    likelihood: 20,
                    effects: { vulnerable: { pct: 28, turns: 2 } }
                },
                {
                    name: 'Life Drain',
                    likelihood: 20,
                    effects: { lifesteal: { pct: 28, turns: 2 } },
                    defensive: true
                },
                { name: 'Smoke Veil', likelihood: 10, effects: { block: 17 }, defensive: true }
            ]
        },
        {
            id: 'cursed_archer',
            name: 'Cursed Archer',
            img_path: '/textures/characters/labyrinth_cursed_archer.png',
            baseHp: 38,
            hpPerLevel: 6,
            cardsPerTurn: { min: 1, max: 3 },
            cards: [
                { name: 'Venomous Arrow', likelihood: 28, effects: { damage: 11, bleed: 3 } },
                {
                    name: 'Crippling Shot',
                    likelihood: 25,
                    effects: { damage: 9, vulnerable: { pct: 30, turns: 2 } }
                },
                { name: 'Barrage', likelihood: 20, effects: { damage: 14 } },
                {
                    name: 'Shadow Step',
                    likelihood: 17,
                    effects: { block: 16 },
                    defensive: true
                },
                {
                    name: 'Blood Arrow',
                    likelihood: 10,
                    effects: { damage: 8, lifesteal: { pct: 25, turns: 1 } },
                    defensive: true
                }
            ]
        },
        {
            id: 'mummy',
            name: 'Awoken Mummy',
            img_path: '/textures/characters/labyrinth_mummy.png',
            baseHp: 72,
            hpPerLevel: 11,
            cardsPerTurn: { min: 1, max: 2 },
            cards: [
                { name: 'Cursed Grasp', likelihood: 30, effects: { damage: 16, bleed: 4 } },
                {
                    name: 'Ancient Curse',
                    likelihood: 25,
                    effects: { damage: 13, vulnerable: { pct: 25, turns: 2 } }
                },
                { name: 'Bandage Slam', likelihood: 20, effects: { damage: 20 } },
                {
                    name: 'Embalmed Hide',
                    likelihood: 15,
                    effects: { block: 26 },
                    defensive: true
                },
                {
                    name: 'Burial Rites',
                    likelihood: 10,
                    effects: { healing: 18 },
                    defensive: true
                }
            ]
        }
    ],
    // ═══════════════════════════════════════════════════════════════════════
    // laboratory  ─ hard difficulty, levels 1-15, base damage 14-24
    // ═══════════════════════════════════════════════════════════════════════
    laboratory: [
        {
            id: 'lab_chemist',
            name: 'Lab Chemist',
            img_path: '/textures/characters/laboratory_chemist.png',
            baseHp: 74,
            hpPerLevel: 12,
            cardsPerTurn: { min: 2, max: 3 },
            cards: [
                { name: 'Acid Flask', likelihood: 28, effects: { damage: 24, scorch: 5 } },
                { name: 'Corrosive Burst', likelihood: 24, effects: { damage: 26 } },
                {
                    name: 'Toxic Draft',
                    likelihood: 20,
                    effects: { damage: 18, vulnerable: { pct: 30, turns: 2 } }
                },
                { name: 'Fume Screen', likelihood: 18, effects: { block: 28 }, defensive: true },
                {
                    name: 'Emergency Serum',
                    likelihood: 10,
                    effects: { healing: 24 },
                    defensive: true
                }
            ]
        },
        {
            id: 'lab_guardian',
            name: 'Lab Guardian',
            img_path: '/textures/characters/laboratory_guardian.png',
            baseHp: 88,
            hpPerLevel: 14,
            cardsPerTurn: { min: 2, max: 3 },
            cards: [
                { name: 'Guardian Slam', likelihood: 26, effects: { damage: 27 } },
                {
                    name: 'Containment Strike',
                    likelihood: 24,
                    effects: { damage: 22, vulnerable: { pct: 30, turns: 2 } }
                },
                { name: 'Iron Flail', likelihood: 20, effects: { damage: 20, bleed: 5 } },
                {
                    name: 'Reinforced Plating',
                    likelihood: 20,
                    effects: { block: 30 },
                    defensive: true
                },
                {
                    name: 'Stone Mending',
                    likelihood: 10,
                    effects: { healing: 22 },
                    defensive: true
                }
            ]
        },
        {
            id: 'lab_mutant',
            name: 'Lab Mutant',
            img_path: '/textures/characters/laboratory_mutant.png',
            baseHp: 96,
            hpPerLevel: 15,
            cardsPerTurn: { min: 2, max: 3 },
            cards: [
                { name: 'Mutant Claw', likelihood: 28, effects: { damage: 28, bleed: 6 } },
                { name: 'Rending Maul', likelihood: 24, effects: { damage: 31 } },
                {
                    name: 'Toxic Lunge',
                    likelihood: 20,
                    effects: { damage: 23, scorch: 6 }
                },
                {
                    name: 'Bone Carapace',
                    likelihood: 20,
                    effects: { block: 32 },
                    defensive: true
                },
                {
                    name: 'Regenerate Tissue',
                    likelihood: 10,
                    effects: { healing: 24 },
                    defensive: true
                }
            ]
        },
        {
            id: 'lab_specimen',
            name: 'Escaped Specimen',
            img_path: '/textures/characters/laboratory_specimen.png',
            baseHp: 82,
            hpPerLevel: 13,
            cardsPerTurn: { min: 2, max: 3 },
            cards: [
                { name: 'Specimen Pounce', likelihood: 28, effects: { damage: 25 } },
                { name: 'Viral Bite', likelihood: 24, effects: { damage: 21, bleed: 6 } },
                { name: 'Pyro Spit', likelihood: 20, effects: { damage: 22, scorch: 5 } },
                { name: 'Adaptive Hide', likelihood: 18, effects: { block: 30 }, defensive: true },
                {
                    name: 'Feeding Frenzy',
                    likelihood: 10,
                    effects: { lifesteal: { pct: 35, turns: 2 } },
                    defensive: true
                }
            ]
        },
        {
            id: 'abomination',
            name: 'Abomination',
            img_path: '/textures/characters/laboratory_abomination.png',
            baseHp: 65,
            hpPerLevel: 10,
            cardsPerTurn: { min: 2, max: 3 },
            cards: [
                { name: 'Flesh Rend', likelihood: 28, effects: { damage: 19, bleed: 5 } },
                { name: 'Bile Spew', likelihood: 25, effects: { damage: 16, scorch: 4 } },
                {
                    name: 'Grotesque Roar',
                    likelihood: 20,
                    effects: { damage: 13, vulnerable: { pct: 30, turns: 2 } }
                },
                {
                    name: 'Necrotic Hide',
                    likelihood: 17,
                    effects: { block: 26 },
                    defensive: true
                },
                {
                    name: 'Consume Flesh',
                    likelihood: 10,
                    effects: { lifesteal: { pct: 35, turns: 2 } },
                    defensive: true
                }
            ]
        },
        {
            id: 'parasite',
            name: 'Parasite',
            img_path: '/textures/characters/laboratory_parasite.png',
            baseHp: 78,
            hpPerLevel: 12,
            cardsPerTurn: { min: 1, max: 3 },
            cards: [
                { name: 'Burrow', likelihood: 26, effects: { damage: 18, bleed: 5 } },
                { name: 'Infect', likelihood: 24, effects: { bleed: 4, scorch: 3 } },
                {
                    name: 'Toxic Latch',
                    likelihood: 20,
                    effects: { damage: 15, vulnerable: { pct: 30, turns: 2 } }
                },
                {
                    name: 'Chitinous Shell',
                    likelihood: 18,
                    effects: { block: 24 },
                    defensive: true
                },
                {
                    name: 'Leech',
                    likelihood: 12,
                    effects: { lifesteal: { pct: 40, turns: 2 } },
                    defensive: true
                }
            ]
        }
    ],

    // ═══════════════════════════════════════════════════════════════════════
    // GATES OF HELL  ─ extreme difficulty, levels 1-15, base damage 20-32
    // ═══════════════════════════════════════════════════════════════════════
    gates_of_hell: [
        {
            id: 'demon',
            name: 'Infernal Demon',
            img_path: '/textures/characters/gates_of_hell_demon.png',
            baseHp: 95,
            hpPerLevel: 15,
            cardsPerTurn: { min: 2, max: 3 },
            cards: [
                { name: 'Infernal Slash', likelihood: 30, effects: { damage: 31, scorch: 6 } },
                { name: 'Hellfire Strike', likelihood: 25, effects: { damage: 36 } },
                {
                    name: 'Demonic Crush',
                    likelihood: 20,
                    effects: { damage: 24, vulnerable: { pct: 35, turns: 2 } }
                },
                { name: 'Flame Barrier', likelihood: 15, effects: { block: 34 }, defensive: true },
                {
                    name: 'Hellish Recovery',
                    likelihood: 10,
                    effects: { healing: 28 },
                    defensive: true
                }
            ]
        },
        {
            id: 'soul_reaper',
            name: 'Soul Reaper',
            img_path: '/textures/characters/gates_of_hell_soul_reaper.png',
            baseHp: 78,
            hpPerLevel: 13,
            cardsPerTurn: { min: 2, max: 3 },
            cards: [
                { name: 'Soul Rend', likelihood: 25, effects: { damage: 26, bleed: 7 } },
                {
                    name: 'Reaper Curse',
                    likelihood: 25,
                    effects: { damage: 21, vulnerable: { pct: 35, turns: 3 } }
                },
                { name: 'Ashen Flame', likelihood: 20, effects: { damage: 18, scorch: 6 } },
                {
                    name: 'Soul Harvest',
                    likelihood: 20,
                    effects: { lifesteal: { pct: 45, turns: 3 } },
                    defensive: true
                },
                { name: 'Dark Renewal', likelihood: 10, effects: { healing: 26 }, defensive: true }
            ]
        },
        {
            id: 'hell_knight',
            name: 'Hell Knight',
            img_path: '/textures/characters/gates_of_hell_hell_knight.png',
            baseHp: 115,
            hpPerLevel: 17,
            cardsPerTurn: { min: 1, max: 3 },
            cards: [
                { name: 'Hellblade Slash', likelihood: 25, effects: { damage: 34 } },
                { name: 'Blood Cleave', likelihood: 25, effects: { damage: 26, bleed: 7 } },
                {
                    name: 'Crushing Verdict',
                    likelihood: 20,
                    effects: { damage: 28, vulnerable: { pct: 40, turns: 2 } }
                },
                {
                    name: 'Infernal Shield',
                    likelihood: 20,
                    effects: { block: 40 },
                    defensive: true
                },
                {
                    name: 'Soul Feast',
                    likelihood: 10,
                    effects: { lifesteal: { pct: 35, turns: 3 } },
                    defensive: true
                }
            ]
        },
        {
            id: 'infernal_brute',
            name: 'Infernal Brute',
            img_path: '/textures/characters/gates_of_hell_infernal_brute.png',
            baseHp: 102,
            hpPerLevel: 16,
            cardsPerTurn: { min: 2, max: 3 },
            cards: [
                { name: 'Brutal Crush', likelihood: 30, effects: { damage: 39 } },
                { name: 'Savage Tear', likelihood: 25, effects: { damage: 29, bleed: 7 } },
                { name: 'Molten Smash', likelihood: 20, effects: { damage: 34, scorch: 7 } },
                { name: 'Iron Hide', likelihood: 15, effects: { block: 36 }, defensive: true },
                {
                    name: 'Infernal Recovery',
                    likelihood: 10,
                    effects: { healing: 30 },
                    defensive: true
                }
            ]
        },
        {
            id: 'incubus',
            name: 'Incubus',
            img_path: '/textures/characters/gates_of_hell_incubus.png',
            baseHp: 88,
            hpPerLevel: 14,
            cardsPerTurn: { min: 2, max: 3 },
            cards: [
                {
                    name: 'Seductive Gaze',
                    likelihood: 28,
                    effects: { damage: 22, vulnerable: { pct: 40, turns: 2 } }
                },
                {
                    name: 'Life Kiss',
                    likelihood: 25,
                    effects: { damage: 18, lifesteal: { pct: 50, turns: 2 } }
                },
                { name: 'Charm Lash', likelihood: 20, effects: { damage: 28, bleed: 5 } },
                {
                    name: 'Dark Embrace',
                    likelihood: 17,
                    effects: { lifesteal: { pct: 60, turns: 2 } },
                    defensive: true
                },
                {
                    name: 'Infernal Allure',
                    likelihood: 10,
                    effects: { healing: 24 },
                    defensive: true
                }
            ]
        },
        {
            id: 'cultist',
            name: 'Cultist',
            img_path: '/textures/characters/gates_of_hell_cultist.png',
            baseHp: 72,
            hpPerLevel: 12,
            cardsPerTurn: { min: 2, max: 3 },
            cards: [
                {
                    name: 'Blood Offering',
                    likelihood: 28,
                    effects: { damage: 38, scorch: 6 }
                },
                {
                    name: 'Ritual Curse',
                    likelihood: 25,
                    effects: { damage: 24, vulnerable: { pct: 45, turns: 3 } }
                },
                { name: 'Hellfire Chant', likelihood: 20, effects: { scorch: 8 } },
                {
                    name: 'Sacrificial Ward',
                    likelihood: 17,
                    effects: { block: 38 },
                    defensive: true
                },
                {
                    name: 'Dark Communion',
                    likelihood: 10,
                    effects: { healing: 32 },
                    defensive: true
                }
            ]
        }
    ]
};

function pickByLikelihood(cards) {
    const total = cards.reduce((sum, c) => sum + c.likelihood, 0);
    let roll = Math.random() * total;
    for (const card of cards) {
        roll -= card.likelihood;
        if (roll <= 0) return card;
    }
    return cards[cards.length - 1];
}

function scaleForLevel(base, level) {
    return Math.round(base * (1 + (level - 1) * DMG_SCALE_PER_LEVEL));
}

function selectTurnCards(enemy) {
    const isLowHp = enemy.hp / enemy.maxHp < LOW_HP_THRESHOLD;

    const offensivePool = enemy.cards.filter((c) => !c.defensive);
    const defensivePool = enemy.cards.filter((c) => c.defensive);

    const range = enemy.cardsPerTurn.max - enemy.cardsPerTurn.min;
    const rolledCount = enemy.cardsPerTurn.min + Math.floor(Math.random() * (range + 1));

    if (!isLowHp) {
        const pool = offensivePool.length > 0 ? offensivePool : enemy.cards;
        const selected = [];
        for (let i = 0; i < rolledCount; i++) {
            selected.push(pickByLikelihood(pool));
        }
        return selected;
    }

    const defPool = defensivePool.length > 0 ? defensivePool : enemy.cards;
    const atkPool = offensivePool.length > 0 ? offensivePool : enemy.cards;

    const totalCount = Math.max(2, rolledCount);
    const selected = [pickByLikelihood(defPool)];
    for (let i = 1; i < totalCount; i++) {
        selected.push(pickByLikelihood(atkPool));
    }
    return selected;
}

function generateEnemy(dungeonType, dungeonLevel) {
    const pool = ENEMY_POOL[dungeonType] || ENEMY_POOL.crypt;
    const archetype = pool[Math.floor(Math.random() * pool.length)];
    const level = Math.max(1, Math.floor(Number(dungeonLevel) || 1));

    const maxHp = archetype.baseHp + (level - 1) * archetype.hpPerLevel;

    const scaledCards = archetype.cards.map((card) => {
        const scaled = {
            name: card.name,
            likelihood: card.likelihood,
            effects: { ...card.effects }
        };
        if (scaled.effects.damage !== undefined)
            scaled.effects.damage = scaleForLevel(scaled.effects.damage, level);
        if (scaled.effects.healing !== undefined)
            scaled.effects.healing = scaleForLevel(scaled.effects.healing, level);
        if (card.defensive) scaled.defensive = true;
        return scaled;
    });

    return {
        enemyId: archetype.id,
        archetype: archetype.name,
        img_path: archetype.img_path || null,
        hp: maxHp,
        maxHp,
        block: 0,
        strength: 0,
        statuses: [],
        cardsPerTurn: { ...archetype.cardsPerTurn },
        cards: scaledCards
    };
}
function generateEnemyGroup(dungeonType, dungeonLevel, count) {
    const clamped = Math.max(1, Math.min(5, Math.floor(Number(count) || 1)));
    const enemies = [];
    for (let i = 0; i < clamped; i++) {
        const enemy = generateEnemy(dungeonType, dungeonLevel);
        enemy.index = i;
        enemies.push(enemy);
    }
    return enemies;
}

function rollEnemyCount(dungeonType, dungeonLevel = 1) {
    const level = Math.max(1, Math.min(10, Number(dungeonLevel) || 1));

    if (level <= 3) return 1;

    const levelScale = (level - 1) / 9;

    let base;
    switch (dungeonType) {
        case 'crypt':
            base = [0.55, 0.85, 0.97, 1.0];
            break;
        case 'labyrinth':
            base = [0.35, 0.65, 0.88, 0.97];
            break;
        case 'laboratory':
            base = [0.25, 0.5, 0.78, 0.93];
            break;
        case 'gates_of_hell':
            base = [0.12, 0.3, 0.58, 0.85];
            break;
        default:
            base = [0.5, 0.82, 0.96, 1.0];
            break;
    }

    const t = base.map((b) => 1.0 - (1.0 - b) * levelScale);

    const roll = Math.random();
    if (roll < t[0]) return 1;
    if (roll < t[1]) return 2;
    if (roll < t[2]) return 3;
    if (roll < t[3]) return 4;
    return 5;
}

module.exports = {
    generateEnemy,
    generateEnemyGroup,
    rollEnemyCount,
    selectTurnCards,
    ENEMY_POOL
};
