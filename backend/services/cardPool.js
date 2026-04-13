const CARD_POOL = {
    // ═══════════════════════════════════════════════════════════════════
    // MELEE — up-close violence, bleed stacking, self-damage gambles
    // ═══════════════════════════════════════════════════════════════════
    melee: [
        // ── T1 ──────────────────────────────────────────────────────────
        {
            id: 1,
            name: 'Rusty Slash',
            tier: 1,
            type: 'melee',
            exhaust: false,
            effects: { damage: 3, bleed: 1 }
        },
        {
            id: 2,
            name: 'Poke',
            tier: 1,
            type: 'melee',
            exhaust: false,
            effects: { damage: 1, extraPlays: 1 }
        },
        {
            id: 3,
            name: 'Wild Swing',
            tier: 1,
            type: 'melee',
            exhaust: false,
            effects: { damage: 5, backfire: 1 }
        },
        {
            id: 4,
            name: 'Headbutt',
            tier: 1,
            type: 'melee',
            exhaust: false,
            effects: { damage: 3, backfire: 1, extraPlays: 1 }
        },
        {
            id: 5,
            name: 'Ankle Biter',
            tier: 1,
            type: 'melee',
            exhaust: false,
            effects: { damage: 2, bleed: 2 }
        },
        { id: 6, name: 'Guard', tier: 1, type: 'melee', exhaust: false, effects: { block: 4 } },
        {
            id: 7,
            name: 'Taunt',
            tier: 1,
            type: 'melee',
            exhaust: false,
            effects: { extraPlays: 2, backfire: 8 }
        },
        {
            id: 8,
            name: 'Cheap Shot',
            tier: 1,
            type: 'melee',
            exhaust: false,
            effects: { damage: 4 }
        },
        {
            id: 9,
            name: 'Desperate Lunge',
            tier: 1,
            type: 'melee',
            exhaust: true,
            effects: { damage: 8, backfire: 2 }
        },
        {
            id: 10,
            name: 'Trip',
            tier: 1,
            type: 'melee',
            exhaust: false,
            effects: { damage: 1, bleed: 1, extraPlays: 1 }
        },

        // ── T2 ──────────────────────────────────────────────────────────
        {
            id: 11,
            name: 'Reckless Strike',
            tier: 2,
            type: 'melee',
            exhaust: false,
            effects: { damage: 6, backfire: 2 }
        },
        {
            id: 12,
            name: 'Pommel Smash',
            tier: 2,
            type: 'melee',
            exhaust: false,
            effects: { damage: 5, extraPlays: 1 }
        },
        {
            id: 13,
            name: 'Gut Punch',
            tier: 2,
            type: 'melee',
            exhaust: false,
            effects: { damage: 4, bleed: 1, extraPlays: 1 }
        },
        {
            id: 14,
            name: 'Counter-Slash',
            tier: 2,
            type: 'melee',
            exhaust: false,
            effects: { damage: 5, block: 3 }
        },
        {
            id: 15,
            name: 'Shoulder Charge',
            tier: 2,
            type: 'melee',
            exhaust: false,
            effects: { damage: 7, backfire: 3 }
        },
        {
            id: 16,
            name: 'Warcry',
            tier: 2,
            type: 'melee',
            exhaust: false,
            effects: { extraPlays: 1, strength: 3 }
        },
        {
            id: 17,
            name: 'Sweeping Blow',
            tier: 2,
            type: 'melee',
            exhaust: false,
            effects: { damage: 6, bleed: 1 }
        },
        {
            id: 18,
            name: 'Parry',
            tier: 2,
            type: 'melee',
            exhaust: false,
            effects: { block: 6, extraPlays: 1 }
        },
        {
            id: 19,
            name: 'Gash',
            tier: 2,
            type: 'melee',
            exhaust: false,
            effects: { damage: 5, bleed: 2 }
        },
        {
            id: 20,
            name: 'Bloodlust',
            tier: 2,
            type: 'melee',
            exhaust: true,
            effects: { damage: 10, bleed: 2, backfire: 3 }
        },

        // ── T3 ──────────────────────────────────────────────────────────
        {
            id: 21,
            name: 'Blood Cutter',
            tier: 3,
            type: 'melee',
            exhaust: false,
            effects: { damage: 7, bleed: 2 }
        },
        {
            id: 22,
            name: 'Hamstring',
            tier: 3,
            type: 'melee',
            exhaust: false,
            effects: { damage: 6, bleed: 3 }
        },
        {
            id: 23,
            name: 'Battle Trance',
            tier: 3,
            type: 'melee',
            exhaust: false,
            effects: { extraPlays: 1, strength: 4, backfire: 2 }
        },
        {
            id: 24,
            name: 'Riposte',
            tier: 3,
            type: 'melee',
            exhaust: false,
            effects: { damage: 7, block: 4 }
        },
        {
            id: 25,
            name: 'Cleave',
            tier: 3,
            type: 'melee',
            exhaust: false,
            effects: { damage: 9, backfire: 2 }
        },
        {
            id: 26,
            name: 'Jugular Slice',
            tier: 3,
            type: 'melee',
            exhaust: false,
            effects: { damage: 5, bleed: 4 }
        },
        {
            id: 27,
            name: 'Second Wind',
            tier: 3,
            type: 'melee',
            exhaust: false,
            effects: { healing: 5, extraPlays: 1 }
        },
        {
            id: 28,
            name: 'Whirlwind',
            tier: 3,
            type: 'melee',
            exhaust: false,
            effects: { damage: 8, bleed: 1, extraPlays: 1, backfire: 3 }
        },
        {
            id: 29,
            name: 'Steel Nerve',
            tier: 3,
            type: 'melee',
            exhaust: false,
            effects: { block: 8, extraPlays: 1 }
        },
        {
            id: 30,
            name: 'Feral Ambush',
            tier: 3,
            type: 'melee',
            exhaust: true,
            effects: { damage: 14, bleed: 3, backfire: 4 }
        },

        // ── T4 ──────────────────────────────────────────────────────────
        {
            id: 31,
            name: 'Savage Combo',
            tier: 4,
            type: 'melee',
            exhaust: false,
            effects: { damage: 9, bleed: 2, extraPlays: 1 }
        },
        {
            id: 32,
            name: 'Artery Burst',
            tier: 4,
            type: 'melee',
            exhaust: false,
            effects: { damage: 8, bleed: 4 }
        },
        {
            id: 33,
            name: 'Iron Rend',
            tier: 4,
            type: 'melee',
            exhaust: false,
            effects: { damage: 11, bleed: 3, backfire: 3 }
        },
        {
            id: 34,
            name: 'Death March',
            tier: 4,
            type: 'melee',
            exhaust: false,
            effects: { damage: 7, extraPlays: 1, backfire: 2 }
        },
        {
            id: 35,
            name: "Mama's Chili Oil",
            tier: 4,
            type: 'melee',
            exhaust: false,
            effects: { damage: 10, scorch: 2, extraPlays: 1, backfire: 4 }
        },
        {
            id: 36,
            name: 'Bonecrusher',
            tier: 4,
            type: 'melee',
            exhaust: false,
            effects: { damage: 13, vulnerable: { pct: 20, turns: 1 }, backfire: 4 }
        },
        {
            id: 37,
            name: 'Rally',
            tier: 4,
            type: 'melee',
            exhaust: false,
            effects: { healing: 6, extraPlays: 1 }
        },
        {
            id: 38,
            name: 'Gut Rip',
            tier: 4,
            type: 'melee',
            exhaust: false,
            effects: { damage: 9, bleed: 5, backfire: 2 }
        },
        {
            id: 39,
            name: 'Fortress Stance',
            tier: 4,
            type: 'melee',
            exhaust: false,
            effects: { block: 12, extraPlays: 1 }
        },
        {
            id: 40,
            name: 'Carnage',
            tier: 4,
            type: 'melee',
            exhaust: true,
            effects: { damage: 8, bleed: 4, extraPlays: 1, backfire: 5 }
        },

        // ── T5 ──────────────────────────────────────────────────────────
        {
            id: 41,
            name: "Executioner's Rush",
            tier: 5,
            type: 'melee',
            exhaust: false,
            effects: { damage: 13, bleed: 3, backfire: 3 }
        },
        {
            id: 42,
            name: 'Hemorrhage',
            tier: 5,
            type: 'melee',
            exhaust: false,
            effects: { damage: 11, bleed: 6 }
        },
        {
            id: 43,
            name: 'Skull Splitter',
            tier: 5,
            type: 'melee',
            exhaust: false,
            effects: { damage: 15, vulnerable: { pct: 25, turns: 2 }, backfire: 5 }
        },
        {
            id: 44,
            name: 'Death Rattle',
            tier: 5,
            type: 'melee',
            exhaust: false,
            effects: { damage: 10, bleed: 4, extraPlays: 1 }
        },
        {
            id: 45,
            name: 'Warlord Smash',
            tier: 5,
            type: 'melee',
            exhaust: false,
            effects: { damage: 14, block: 6 }
        },
        {
            id: 46,
            name: 'Crimson Dash',
            tier: 5,
            type: 'melee',
            exhaust: false,
            effects: { damage: 9, bleed: 3, extraPlays: 1 }
        },
        {
            id: 47,
            name: 'Pain is Power',
            tier: 5,
            type: 'melee',
            exhaust: false,
            effects: { damage: 16, backfire: 6, extraPlays: 1 }
        },
        {
            id: 48,
            name: 'Titan Grip',
            tier: 5,
            type: 'melee',
            exhaust: false,
            effects: { damage: 12, block: 8 }
        },
        {
            id: 49,
            name: 'Bloodbath',
            tier: 5,
            type: 'melee',
            exhaust: false,
            effects: { damage: 10, bleed: 5, lifesteal: { pct: 20, turns: 2 } }
        },
        {
            id: 50,
            name: "Reaper's Toll",
            tier: 5,
            type: 'melee',
            exhaust: true,
            effects: { damage: 22, bleed: 6, backfire: 7, extraPlays: 1 }
        },

        // ── T6 ──────────────────────────────────────────────────────────
        {
            id: 51,
            name: 'Doom Blade Frenzy',
            tier: 6,
            type: 'melee',
            exhaust: true,
            effects: { damage: 16, bleed: 4, extraPlays: 1, backfire: 4 }
        },
        {
            id: 52,
            name: 'Obliterate',
            tier: 6,
            type: 'melee',
            exhaust: true,
            effects: { damage: 20, bleed: 5, vulnerable: { pct: 30, turns: 2 }, backfire: 6 }
        },
        {
            id: 53,
            name: 'Hell Cleave',
            tier: 6,
            type: 'melee',
            exhaust: false,
            effects: { damage: 18, bleed: 6, extraPlays: 1 }
        },
        {
            id: 54,
            name: 'Demon Rend',
            tier: 6,
            type: 'melee',
            exhaust: false,
            effects: { damage: 22, bleed: 4, backfire: 8 }
        },
        {
            id: 55,
            name: 'Undying Rage',
            tier: 6,
            type: 'melee',
            exhaust: false,
            effects: { damage: 15, bleed: 5, healing: 5 }
        },
        {
            id: 56,
            name: 'Soulripper',
            tier: 6,
            type: 'melee',
            exhaust: false,
            effects: { damage: 17, bleed: 7, extraPlays: 1 }
        },
        {
            id: 57,
            name: "Death's Embrace",
            tier: 6,
            type: 'melee',
            exhaust: false,
            effects: { damage: 20, healing: 8, lifesteal: { pct: 25, turns: 2 } }
        },
        {
            id: 58,
            name: 'Godsplitter',
            tier: 6,
            type: 'melee',
            exhaust: false,
            effects: { damage: 25, vulnerable: { pct: 30, turns: 3 }, backfire: 10 }
        },
        {
            id: 59,
            name: 'Infernal Combo',
            tier: 6,
            type: 'melee',
            exhaust: false,
            effects: { damage: 14, bleed: 4, extraPlays: 1, backfire: 5 }
        },
        {
            id: 60,
            name: 'Final Rampage',
            tier: 6,
            type: 'melee',
            exhaust: true,
            effects: { damage: 30, bleed: 8, extraPlays: 1, backfire: 12 }
        }
    ],

    // ═══════════════════════════════════════════════════════════════════
    // RANGED — precise, draw-heavy, bleed from a safe distance
    // ═══════════════════════════════════════════════════════════════════
    ranged: [
        // ── T1 ──────────────────────────────────────────────────────────
        {
            id: 61,
            name: 'Quick Shot',
            tier: 1,
            type: 'ranged',
            exhaust: false,
            effects: { damage: 2 }
        },
        {
            id: 62,
            name: 'Pebble Toss',
            tier: 1,
            type: 'ranged',
            exhaust: false,
            effects: { damage: 1, extraPlays: 1 }
        },
        {
            id: 63,
            name: 'Wobbling Arrow',
            tier: 1,
            type: 'ranged',
            exhaust: false,
            effects: { damage: 3, backfire: 1 }
        },
        {
            id: 64,
            name: 'Scratch Shot',
            tier: 1,
            type: 'ranged',
            exhaust: false,
            effects: { damage: 2, scorch: 1 }
        },
        {
            id: 65,
            name: 'Duck and Fire',
            tier: 1,
            type: 'ranged',
            exhaust: false,
            effects: { damage: 2, block: 2 }
        },
        {
            id: 66,
            name: 'Nock and Think',
            tier: 1,
            type: 'ranged',
            exhaust: false,
            effects: { extraPlays: 2 }
        },
        {
            id: 67,
            name: 'Close Quarters Shot',
            tier: 1,
            type: 'ranged',
            exhaust: false,
            effects: { damage: 4, backfire: 2 }
        },
        {
            id: 68,
            name: 'Kneecap Shot',
            tier: 1,
            type: 'ranged',
            exhaust: false,
            effects: { damage: 2, bleed: 1, extraPlays: 1, backfire: 1 }
        },
        {
            id: 69,
            name: 'Loose Bolt',
            tier: 1,
            type: 'ranged',
            exhaust: false,
            effects: { damage: 5, backfire: 3 }
        },
        {
            id: 70,
            name: 'Opening Salvo',
            tier: 1,
            type: 'ranged',
            exhaust: true,
            effects: { damage: 7, bleed: 1, extraPlays: 1 }
        },

        // ── T2 ──────────────────────────────────────────────────────────
        {
            id: 71,
            name: 'Piercing Arrow',
            tier: 2,
            type: 'ranged',
            exhaust: false,
            effects: { damage: 5 }
        },
        {
            id: 72,
            name: 'Crippling Shot',
            tier: 2,
            type: 'ranged',
            exhaust: false,
            effects: { damage: 4, bleed: 2 }
        },
        {
            id: 73,
            name: 'Fan of Knives',
            tier: 2,
            type: 'ranged',
            exhaust: false,
            effects: { damage: 3, bleed: 1, extraPlays: 1 }
        },
        {
            id: 74,
            name: 'Calculated Aim',
            tier: 2,
            type: 'ranged',
            exhaust: false,
            effects: { damage: 6, vulnerable: { pct: 15, turns: 1 }, extraPlays: 1, backfire: 1 }
        },
        {
            id: 75,
            name: 'Smoke and Shoot',
            tier: 2,
            type: 'ranged',
            exhaust: false,
            effects: { damage: 4, block: 3 }
        },
        {
            id: 76,
            name: 'Scatter Shot',
            tier: 2,
            type: 'ranged',
            exhaust: false,
            effects: { damage: 3, bleed: 2, extraPlays: 1 }
        },
        {
            id: 77,
            name: 'Backpedal',
            tier: 2,
            type: 'ranged',
            exhaust: false,
            effects: { block: 5, extraPlays: 1 }
        },
        {
            id: 78,
            name: 'Poisoned Tip',
            tier: 2,
            type: 'ranged',
            exhaust: false,
            effects: { damage: 4, scorch: 3, backfire: 1 }
        },
        {
            id: 79,
            name: 'Double Tap',
            tier: 2,
            type: 'ranged',
            exhaust: false,
            effects: { damage: 7, backfire: 2, extraPlays: 1 }
        },
        {
            id: 80,
            name: 'Aimed Burst',
            tier: 2,
            type: 'ranged',
            exhaust: true,
            effects: { damage: 10, bleed: 2, extraPlays: 1 }
        },

        // ── T3 ──────────────────────────────────────────────────────────
        {
            id: 81,
            name: 'Trick Shot',
            tier: 3,
            type: 'ranged',
            exhaust: false,
            effects: { damage: 6, vulnerable: { pct: 20, turns: 1 } }
        },
        {
            id: 82,
            name: "Hunter's Mark",
            tier: 3,
            type: 'ranged',
            exhaust: false,
            effects: { damage: 5, bleed: 3, extraPlays: 1 }
        },
        {
            id: 83,
            name: 'Evasive Shot',
            tier: 3,
            type: 'ranged',
            exhaust: false,
            effects: { damage: 5, block: 4 }
        },
        {
            id: 84,
            name: 'Burst Fire',
            tier: 3,
            type: 'ranged',
            exhaust: false,
            effects: { damage: 8, extraPlays: 1, backfire: 2 }
        },
        {
            id: 85,
            name: 'Bleeding Shaft',
            tier: 3,
            type: 'ranged',
            exhaust: false,
            effects: { damage: 4, bleed: 4 }
        },
        {
            id: 86,
            name: 'Redirect',
            tier: 3,
            type: 'ranged',
            exhaust: false,
            effects: { extraPlays: 1 }
        },
        {
            id: 87,
            name: 'Serrated Bolt',
            tier: 3,
            type: 'ranged',
            exhaust: false,
            effects: { damage: 7, scorch: 3, backfire: 2 }
        },
        {
            id: 88,
            name: 'Shadow Step',
            tier: 3,
            type: 'ranged',
            exhaust: false,
            effects: { block: 6, extraPlays: 1 }
        },
        {
            id: 89,
            name: 'Overcharge',
            tier: 3,
            type: 'ranged',
            exhaust: false,
            effects: { damage: 9, backfire: 3 }
        },
        {
            id: 90,
            name: 'Deadeye',
            tier: 3,
            type: 'ranged',
            exhaust: true,
            effects: { damage: 14, bleed: 3, extraPlays: 1 }
        },

        // ── T4 ──────────────────────────────────────────────────────────
        {
            id: 91,
            name: 'Volley',
            tier: 4,
            type: 'ranged',
            exhaust: false,
            effects: { damage: 5, vulnerable: { pct: 20, turns: 2 }, extraPlays: 1 }
        },
        {
            id: 92,
            name: 'Hail Shot',
            tier: 4,
            type: 'ranged',
            exhaust: false,
            effects: { damage: 9, bleed: 3, backfire: 3 }
        },
        {
            id: 93,
            name: 'Ricochet',
            tier: 4,
            type: 'ranged',
            exhaust: false,
            effects: { damage: 8, extraPlays: 1 }
        },
        {
            id: 94,
            name: 'Incendiary Arrow',
            tier: 4,
            type: 'ranged',
            exhaust: false,
            effects: { damage: 7, scorch: 4, backfire: 2 }
        },
        {
            id: 95,
            name: 'Covering Fire',
            tier: 4,
            type: 'ranged',
            exhaust: false,
            effects: { damage: 6, block: 7, extraPlays: 1 }
        },
        {
            id: 96,
            name: 'Rapid Draw',
            tier: 4,
            type: 'ranged',
            exhaust: false,
            effects: { extraPlays: 1 }
        },
        {
            id: 97,
            name: 'Piercing Volley',
            tier: 4,
            type: 'ranged',
            exhaust: false,
            effects: { damage: 11, bleed: 3 }
        },
        {
            id: 98,
            name: 'Disarm Shot',
            tier: 4,
            type: 'ranged',
            exhaust: false,
            effects: { damage: 8, extraPlays: 1, backfire: 4 }
        },
        {
            id: 99,
            name: 'Needle Rain',
            tier: 4,
            type: 'ranged',
            exhaust: false,
            effects: { damage: 6, bleed: 5, backfire: 2 }
        },
        {
            id: 100,
            name: "Sniper's Gambit",
            tier: 4,
            type: 'ranged',
            exhaust: true,
            effects: { damage: 18, bleed: 4, backfire: 5 }
        },

        // ── T5 ──────────────────────────────────────────────────────────
        {
            id: 101,
            name: 'Sniper Focus',
            tier: 5,
            type: 'ranged',
            exhaust: false,
            effects: { damage: 11 }
        },
        {
            id: 102,
            name: 'Heartseeker',
            tier: 5,
            type: 'ranged',
            exhaust: false,
            effects: { damage: 13, scorch: 4 }
        },
        {
            id: 103,
            name: 'Arrow Storm',
            tier: 5,
            type: 'ranged',
            exhaust: false,
            effects: { damage: 10, bleed: 3, extraPlays: 1 }
        },
        {
            id: 104,
            name: 'Ghost Bolt',
            tier: 5,
            type: 'ranged',
            exhaust: false,
            effects: { damage: 12, extraPlays: 1, backfire: 3 }
        },
        {
            id: 105,
            name: 'Barbed Salvo',
            tier: 5,
            type: 'ranged',
            exhaust: false,
            effects: { damage: 9, scorch: 6, backfire: 2 }
        },
        {
            id: 106,
            name: 'Lethal Aim',
            tier: 5,
            type: 'ranged',
            exhaust: false,
            effects: { damage: 15, vulnerable: { pct: 25, turns: 2 }, backfire: 5 }
        },
        {
            id: 107,
            name: 'Retreating Volley',
            tier: 5,
            type: 'ranged',
            exhaust: false,
            effects: { damage: 10, block: 7, extraPlays: 1 }
        },
        {
            id: 108,
            name: 'Blinding Shot',
            tier: 5,
            type: 'ranged',
            exhaust: false,
            effects: { damage: 8, bleed: 3, extraPlays: 1, backfire: 3 }
        },
        {
            id: 109,
            name: 'Phantom Arrow',
            tier: 5,
            type: 'ranged',
            exhaust: false,
            effects: { damage: 12, bleed: 5, extraPlays: 1 }
        },
        {
            id: 110,
            name: 'Thousand Cuts',
            tier: 5,
            type: 'ranged',
            exhaust: true,
            effects: { damage: 14, bleed: 8, extraPlays: 1, backfire: 4 }
        },

        // ── T6 ──────────────────────────────────────────────────────────
        {
            id: 111,
            name: 'Rain of Arrows',
            tier: 6,
            type: 'ranged',
            exhaust: true,
            effects: { damage: 14, extraPlays: 1 }
        },
        {
            id: 112,
            name: 'Godshot',
            tier: 6,
            type: 'ranged',
            exhaust: false,
            effects: { damage: 20, scorch: 5, backfire: 6 }
        },
        {
            id: 113,
            name: 'Hell Volley',
            tier: 6,
            type: 'ranged',
            exhaust: false,
            effects: { damage: 17, bleed: 6, extraPlays: 1 }
        },
        {
            id: 114,
            name: 'Doomsday Arrow',
            tier: 6,
            type: 'ranged',
            exhaust: false,
            effects: { damage: 22, bleed: 4, backfire: 8 }
        },
        {
            id: 115,
            name: 'Infinite Quiver',
            tier: 6,
            type: 'ranged',
            exhaust: false,
            effects: { damage: 10, bleed: 3, extraPlays: 1, backfire: 4 }
        },
        {
            id: 116,
            name: 'Soulpiercer',
            tier: 6,
            type: 'ranged',
            exhaust: false,
            effects: { damage: 18, bleed: 7, extraPlays: 1 }
        },
        {
            id: 117,
            name: 'Entropy Bolt',
            tier: 6,
            type: 'ranged',
            exhaust: false,
            effects: { damage: 16, bleed: 5, extraPlays: 1, backfire: 5 }
        },
        {
            id: 118,
            name: "Marksman's Doom",
            tier: 6,
            type: 'ranged',
            exhaust: false,
            effects: { damage: 24, backfire: 10 }
        },
        {
            id: 119,
            name: 'Rapid Hellfire',
            tier: 6,
            type: 'ranged',
            exhaust: false,
            effects: { damage: 13, scorch: 4, extraPlays: 1, backfire: 5 }
        },
        {
            id: 120,
            name: 'Oblivion Barrage',
            tier: 6,
            type: 'ranged',
            exhaust: true,
            effects: { damage: 30, bleed: 9, extraPlays: 1, backfire: 12 }
        }
    ],

    // ═══════════════════════════════════════════════════════════════════
    // HELMET — brain power, draws, extra plays, cheeky utility
    // ═══════════════════════════════════════════════════════════════════
    helmet: [
        // ── T1 ──────────────────────────────────────────────────────────
        {
            id: 121,
            name: 'Focus Visor',
            tier: 1,
            type: 'helmet',
            exhaust: false,
            effects: { extraPlays: 1, strength: 1 }
        },
        {
            id: 122,
            name: 'Dented Think Cap',
            tier: 1,
            type: 'helmet',
            exhaust: false,
            effects: { extraPlays: 1, backfire: 1 }
        },
        {
            id: 123,
            name: 'Squint',
            tier: 1,
            type: 'helmet',
            exhaust: false,
            effects: { extraPlays: 1 }
        },
        {
            id: 124,
            name: 'Gut Feeling',
            tier: 1,
            type: 'helmet',
            exhaust: false,
            effects: { extraPlays: 1, healing: 2 }
        },
        {
            id: 125,
            name: 'Headshake',
            tier: 1,
            type: 'helmet',
            exhaust: false,
            effects: { extraPlays: 2, backfire: 5 }
        },
        {
            id: 126,
            name: 'Minor Recovery',
            tier: 1,
            type: 'helmet',
            exhaust: false,
            effects: { healing: 2, regen: 1 }
        },
        {
            id: 127,
            name: 'Look Around',
            tier: 1,
            type: 'helmet',
            exhaust: false,
            effects: { extraPlays: 2 }
        },
        {
            id: 128,
            name: 'Instinct',
            tier: 1,
            type: 'helmet',
            exhaust: false,
            effects: { extraPlays: 1, strength: 2, backfire: 2 }
        },
        {
            id: 129,
            name: 'Foresight',
            tier: 1,
            type: 'helmet',
            exhaust: false,
            effects: { extraPlays: 1, block: 2 }
        },
        {
            id: 130,
            name: 'Hyper Focus',
            tier: 1,
            type: 'helmet',
            exhaust: true,
            effects: { extraPlays: 1, strength: 2, vulnerable: { pct: 10, turns: 1 }, backfire: 3 }
        },

        // ── T2 ──────────────────────────────────────────────────────────
        {
            id: 131,
            name: 'Tactical Insight',
            tier: 2,
            type: 'helmet',
            exhaust: false,
            effects: { extraPlays: 1 }
        },
        {
            id: 132,
            name: 'Cold Logic',
            tier: 2,
            type: 'helmet',
            exhaust: false,
            effects: { extraPlays: 2, backfire: 6 }
        },
        {
            id: 133,
            name: 'Quick Thinking',
            tier: 2,
            type: 'helmet',
            exhaust: false,
            effects: { extraPlays: 1 }
        },
        {
            id: 134,
            name: 'Mental Armor',
            tier: 2,
            type: 'helmet',
            exhaust: false,
            effects: { block: 5, extraPlays: 1 }
        },
        {
            id: 135,
            name: 'Field Medic',
            tier: 2,
            type: 'helmet',
            exhaust: false,
            effects: { healing: 4, regen: 3 }
        },
        {
            id: 136,
            name: 'Read the Room',
            tier: 2,
            type: 'helmet',
            exhaust: false,
            effects: { extraPlays: 1, backfire: 2 }
        },
        {
            id: 137,
            name: 'Cool Head',
            tier: 2,
            type: 'helmet',
            exhaust: false,
            effects: { extraPlays: 1, block: 3 }
        },
        {
            id: 138,
            name: 'Calculated Risk',
            tier: 2,
            type: 'helmet',
            exhaust: false,
            effects: { extraPlays: 1, backfire: 2 }
        },
        {
            id: 139,
            name: 'Tactical Retreat',
            tier: 2,
            type: 'helmet',
            exhaust: false,
            effects: { block: 6, extraPlays: 1 }
        },
        {
            id: 140,
            name: 'Brain Blast',
            tier: 2,
            type: 'helmet',
            exhaust: true,
            effects: { extraPlays: 1, strength: 3, backfire: 2 }
        },

        // ── T3 ──────────────────────────────────────────────────────────
        {
            id: 141,
            name: 'Battle Awareness',
            tier: 3,
            type: 'helmet',
            exhaust: false,
            effects: { extraPlays: 1, strength: 3 }
        },
        {
            id: 142,
            name: 'Overclocked',
            tier: 3,
            type: 'helmet',
            exhaust: false,
            effects: { extraPlays: 1, strength: 3, backfire: 3 }
        },
        {
            id: 143,
            name: 'Adrenaline',
            tier: 3,
            type: 'helmet',
            exhaust: false,
            effects: { extraPlays: 2, backfire: 3 }
        },
        {
            id: 144,
            name: 'Meditate',
            tier: 3,
            type: 'helmet',
            exhaust: false,
            effects: { healing: 4, regen: 4 }
        },
        {
            id: 145,
            name: 'Eye of the Storm',
            tier: 3,
            type: 'helmet',
            exhaust: false,
            effects: { extraPlays: 1, block: 3 }
        },
        {
            id: 146,
            name: 'Think Fast',
            tier: 3,
            type: 'helmet',
            exhaust: false,
            effects: { extraPlays: 1, backfire: 2 }
        },
        {
            id: 147,
            name: 'Adaptive Defense',
            tier: 3,
            type: 'helmet',
            exhaust: false,
            effects: { block: 7, extraPlays: 1 }
        },
        {
            id: 148,
            name: 'Focused Healing',
            tier: 3,
            type: 'helmet',
            exhaust: false,
            effects: { healing: 6, regen: 5 }
        },
        {
            id: 149,
            name: 'Cunning Plan',
            tier: 3,
            type: 'helmet',
            exhaust: false,
            effects: { extraPlays: 1, healing: 6 }
        },
        {
            id: 150,
            name: 'Genius Mode',
            tier: 3,
            type: 'helmet',
            exhaust: true,
            effects: { extraPlays: 2, strength: 4 }
        },

        // ── T4 ──────────────────────────────────────────────────────────
        {
            id: 151,
            name: 'War Command',
            tier: 4,
            type: 'helmet',
            exhaust: false,
            effects: { extraPlays: 2, strength: 1 }
        },
        {
            id: 152,
            name: 'Iron Discipline',
            tier: 4,
            type: 'helmet',
            exhaust: false,
            effects: { extraPlays: 2, backfire: 2 }
        },
        {
            id: 153,
            name: 'Combat Clarity',
            tier: 4,
            type: 'helmet',
            exhaust: false,
            effects: { extraPlays: 1, block: 4 }
        },
        {
            id: 154,
            name: 'Supreme Focus',
            tier: 4,
            type: 'helmet',
            exhaust: false,
            effects: { extraPlays: 2 }
        },
        {
            id: 155,
            name: "Warlord's Mind",
            tier: 4,
            type: 'helmet',
            exhaust: true,
            effects: { extraPlays: 2, strength: 5 }
        },
        {
            id: 156,
            name: 'Flash of Brilliance',
            tier: 4,
            type: 'helmet',
            exhaust: false,
            effects: { extraPlays: 3, backfire: 9 }
        },
        {
            id: 157,
            name: 'Steel Resolve',
            tier: 4,
            type: 'helmet',
            exhaust: false,
            effects: { block: 7, extraPlays: 1 }
        },
        {
            id: 158,
            name: 'Trauma Response',
            tier: 4,
            type: 'helmet',
            exhaust: false,
            effects: { healing: 8, regen: 5, extraPlays: 1 }
        },
        {
            id: 159,
            name: 'Warpath',
            tier: 4,
            type: 'helmet',
            exhaust: false,
            effects: { extraPlays: 1, healing: 3, strength: 3, block: 3 }
        },
        {
            id: 160,
            name: 'Total Recall',
            tier: 4,
            type: 'helmet',
            exhaust: true,
            effects: { extraPlays: 1, regen: 4, block: 4 }
        },

        // ── T5 ──────────────────────────────────────────────────────────
        {
            id: 161,
            name: 'Strategist Crown',
            tier: 5,
            type: 'helmet',
            exhaust: false,
            effects: { extraPlays: 1, healing: 2 }
        },
        {
            id: 162,
            name: 'Battlemind',
            tier: 5,
            type: 'helmet',
            exhaust: false,
            effects: { extraPlays: 2, strength: 4 }
        },
        {
            id: 163,
            name: 'Zen State',
            tier: 5,
            type: 'helmet',
            exhaust: false,
            effects: { extraPlays: 1, healing: 5, regen: 5 }
        },
        {
            id: 164,
            name: 'Legendary Grit',
            tier: 5,
            type: 'helmet',
            exhaust: false,
            effects: { block: 10, extraPlays: 1, vulnerable: { pct: 20, turns: 2 } }
        },
        {
            id: 165,
            name: 'Hellbent',
            tier: 5,
            type: 'helmet',
            exhaust: false,
            effects: { extraPlays: 2, strength: 3 }
        },
        {
            id: 166,
            name: 'Surge',
            tier: 5,
            type: 'helmet',
            exhaust: false,
            effects: { extraPlays: 1, strength: 5, backfire: 5 }
        },
        {
            id: 167,
            name: 'Divine Clarity',
            tier: 5,
            type: 'helmet',
            exhaust: false,
            effects: { extraPlays: 1, healing: 6, regen: 6 }
        },
        {
            id: 168,
            name: 'Overkill Strat',
            tier: 5,
            type: 'helmet',
            exhaust: false,
            effects: { extraPlays: 2, strength: 5 }
        },
        {
            id: 169,
            name: 'Juggernaut Mind',
            tier: 5,
            type: 'helmet',
            exhaust: false,
            effects: { extraPlays: 1, block: 10 }
        },
        {
            id: 170,
            name: 'Galaxy Brain',
            tier: 5,
            type: 'helmet',
            exhaust: true,
            effects: { extraPlays: 2, strength: 5, block: 5 }
        },

        // ── T6 ──────────────────────────────────────────────────────────
        {
            id: 171,
            name: 'Holy Trinity',
            tier: 6,
            type: 'helmet',
            exhaust: true,
            effects: { extraPlays: 3, healing: 3, block: 3 }
        },
        {
            id: 172,
            name: "God's Eye",
            tier: 6,
            type: 'helmet',
            exhaust: false,
            effects: { extraPlays: 2, vulnerable: { pct: 15, turns: 2 } }
        },
        {
            id: 173,
            name: 'Infinite Thought',
            tier: 6,
            type: 'helmet',
            exhaust: false,
            effects: { extraPlays: 1, healing: 6, regen: 6 }
        },
        {
            id: 174,
            name: 'Hell Commander',
            tier: 6,
            type: 'helmet',
            exhaust: false,
            effects: { extraPlays: 2, strength: 6 }
        },
        {
            id: 175,
            name: 'Transcendence',
            tier: 6,
            type: 'helmet',
            exhaust: false,
            effects: { extraPlays: 1, healing: 5, regen: 8 }
        },
        {
            id: 176,
            name: "Madman's Genius",
            tier: 6,
            type: 'helmet',
            exhaust: false,
            effects: { extraPlays: 2, strength: 6, backfire: 6 }
        },
        {
            id: 177,
            name: 'Absolute Focus',
            tier: 6,
            type: 'helmet',
            exhaust: true,
            effects: { extraPlays: 3, strength: 6, healing: 12 }
        },
        {
            id: 178,
            name: 'Overvolt',
            tier: 6,
            type: 'helmet',
            exhaust: true,
            effects: { extraPlays: 4, backfire: 10 }
        },
        {
            id: 179,
            name: 'Demon Intellect',
            tier: 6,
            type: 'helmet',
            exhaust: false,
            effects: { extraPlays: 1, strength: 3, healing: 5 }
        },
        {
            id: 180,
            name: 'Apocalypse Protocol',
            tier: 6,
            type: 'helmet',
            exhaust: true,
            effects: { extraPlays: 1, healing: 5, block: 5, bleed: 5 }
        }
    ],

    // ═══════════════════════════════════════════════════════════════════
    // ARMOUR — tanky healing, blocks, endurance under fire
    // ═══════════════════════════════════════════════════════════════════
    armour: [
        // ── T1 ──────────────────────────────────────────────────────────
        {
            id: 181,
            name: 'Worn Armor',
            tier: 1,
            type: 'armour',
            exhaust: false,
            effects: { healing: 3 }
        },
        {
            id: 182,
            name: 'Brace',
            tier: 1,
            type: 'armour',
            exhaust: false,
            effects: { block: 3, healing: 1 }
        },
        {
            id: 183,
            name: 'Shrug It Off',
            tier: 1,
            type: 'armour',
            exhaust: false,
            effects: { healing: 2, extraPlays: 1 }
        },
        {
            id: 184,
            name: 'Dented Shield',
            tier: 1,
            type: 'armour',
            exhaust: false,
            effects: { block: 4 }
        },
        {
            id: 185,
            name: 'Grit',
            tier: 1,
            type: 'armour',
            exhaust: false,
            effects: { healing: 2, block: 2 }
        },
        {
            id: 186,
            name: 'Clank',
            tier: 1,
            type: 'armour',
            exhaust: false,
            effects: { block: 3, extraPlays: 1 }
        },
        {
            id: 187,
            name: 'Patch Up',
            tier: 1,
            type: 'armour',
            exhaust: false,
            effects: { healing: 4 }
        },
        {
            id: 188,
            name: 'Stomp',
            tier: 1,
            type: 'armour',
            exhaust: false,
            effects: { damage: 2, block: 3 }
        },
        {
            id: 189,
            name: 'Stubborn',
            tier: 1,
            type: 'armour',
            exhaust: false,
            effects: { healing: 3 }
        },
        {
            id: 190,
            name: 'Emergency Patch',
            tier: 1,
            type: 'armour',
            exhaust: true,
            effects: { healing: 8, block: 3 }
        },

        // ── T2 ──────────────────────────────────────────────────────────
        {
            id: 191,
            name: 'Reinforced Plate',
            tier: 2,
            type: 'armour',
            exhaust: false,
            effects: { block: 4, regen: 1 }
        },
        {
            id: 192,
            name: 'Iron Hide',
            tier: 2,
            type: 'armour',
            exhaust: false,
            effects: { block: 6 }
        },
        {
            id: 193,
            name: 'Spiked Recoil',
            tier: 2,
            type: 'armour',
            exhaust: false,
            effects: { damage: 3, block: 4 }
        },
        {
            id: 194,
            name: 'Tighten Straps',
            tier: 2,
            type: 'armour',
            exhaust: false,
            effects: { healing: 4, block: 3 }
        },
        {
            id: 195,
            name: 'Endure',
            tier: 2,
            type: 'armour',
            exhaust: false,
            effects: { healing: 6 }
        },
        {
            id: 196,
            name: 'Counter Brace',
            tier: 2,
            type: 'armour',
            exhaust: false,
            effects: { block: 5, extraPlays: 1 }
        },
        {
            id: 197,
            name: 'Iron Mend',
            tier: 2,
            type: 'armour',
            exhaust: false,
            effects: { healing: 5, damage: 2 }
        },
        {
            id: 198,
            name: 'Shell Up',
            tier: 2,
            type: 'armour',
            exhaust: false,
            effects: { block: 7 }
        },
        {
            id: 199,
            name: 'Bolstered',
            tier: 2,
            type: 'armour',
            exhaust: false,
            effects: { healing: 4, block: 4 }
        },
        {
            id: 200,
            name: 'Second Skin',
            tier: 2,
            type: 'armour',
            exhaust: true,
            effects: { healing: 10, block: 5, extraPlays: 1 }
        },

        // ── T3 ──────────────────────────────────────────────────────────
        {
            id: 201,
            name: 'Guard Stance',
            tier: 3,
            type: 'armour',
            exhaust: false,
            effects: { healing: 6 }
        },
        {
            id: 202,
            name: 'Bulwark Bash',
            tier: 3,
            type: 'armour',
            exhaust: false,
            effects: { damage: 5, block: 6 }
        },
        {
            id: 203,
            name: 'Pain Resistance',
            tier: 3,
            type: 'armour',
            exhaust: false,
            effects: { healing: 7 }
        },
        {
            id: 204,
            name: 'Fortress',
            tier: 3,
            type: 'armour',
            exhaust: false,
            effects: { block: 9, extraPlays: 1 }
        },
        {
            id: 205,
            name: 'Battle Mend',
            tier: 3,
            type: 'armour',
            exhaust: false,
            effects: { healing: 6, damage: 3 }
        },
        {
            id: 206,
            name: 'Rebound',
            tier: 3,
            type: 'armour',
            exhaust: false,
            effects: { block: 6, healing: 3, regen: 3 }
        },
        {
            id: 207,
            name: 'Teeth Gritted',
            tier: 3,
            type: 'armour',
            exhaust: false,
            effects: { healing: 5, regen: 4 }
        },
        {
            id: 208,
            name: 'Juggernaut',
            tier: 3,
            type: 'armour',
            exhaust: false,
            effects: { block: 8, damage: 4 }
        },
        {
            id: 209,
            name: 'Desperate Mend',
            tier: 3,
            type: 'armour',
            exhaust: false,
            effects: { healing: 5, extraPlays: 1 }
        },
        {
            id: 210,
            name: 'Ironclad',
            tier: 3,
            type: 'armour',
            exhaust: true,
            effects: { healing: 12, block: 8, damage: 3 }
        },

        // ── T4 ──────────────────────────────────────────────────────────
        {
            id: 211,
            name: 'Iron Wall',
            tier: 4,
            type: 'armour',
            exhaust: false,
            effects: { healing: 8 }
        },
        {
            id: 212,
            name: 'Resolute Defense',
            tier: 4,
            type: 'armour',
            exhaust: false,
            effects: { block: 11, extraPlays: 1 }
        },
        {
            id: 213,
            name: 'Wrath Barrier',
            tier: 4,
            type: 'armour',
            exhaust: false,
            effects: { damage: 6, block: 8 }
        },
        {
            id: 214,
            name: 'Deep Mend',
            tier: 4,
            type: 'armour',
            exhaust: false,
            effects: { healing: 10, extraPlays: 1 }
        },
        {
            id: 215,
            name: 'Armor of Thorns',
            tier: 4,
            type: 'armour',
            exhaust: false,
            effects: { damage: 5, block: 9, bleed: 2 }
        },
        {
            id: 216,
            name: 'Indomitable',
            tier: 4,
            type: 'armour',
            exhaust: true,
            effects: { healing: 6, block: 6, regen: 5 }
        },
        {
            id: 217,
            name: 'Heavy Mend',
            tier: 4,
            type: 'armour',
            exhaust: false,
            effects: { healing: 11, damage: 4 }
        },
        {
            id: 218,
            name: 'Titanic Block',
            tier: 4,
            type: 'armour',
            exhaust: false,
            effects: { block: 14 }
        },
        {
            id: 219,
            name: 'Undying',
            tier: 4,
            type: 'armour',
            exhaust: false,
            effects: { healing: 8, extraPlays: 1 }
        },
        {
            id: 220,
            name: 'Unbreakable',
            tier: 4,
            type: 'armour',
            exhaust: true,
            effects: { healing: 16, block: 10, extraPlays: 1 }
        },

        // ── T5 ──────────────────────────────────────────────────────────
        {
            id: 221,
            name: 'Last Stand Armor',
            tier: 5,
            type: 'armour',
            exhaust: false,
            effects: { healing: 11, damage: 3 }
        },
        {
            id: 222,
            name: 'Legendary Bulwark',
            tier: 5,
            type: 'armour',
            exhaust: false,
            effects: { block: 15, extraPlays: 1 }
        },
        {
            id: 223,
            name: 'Pyrrhic Heal',
            tier: 5,
            type: 'armour',
            exhaust: false,
            effects: { healing: 8, regen: 6 }
        },
        {
            id: 224,
            name: 'Demigod Skin',
            tier: 5,
            type: 'armour',
            exhaust: false,
            effects: { block: 13, healing: 6 }
        },
        {
            id: 225,
            name: 'Spite Barrier',
            tier: 5,
            type: 'armour',
            exhaust: false,
            effects: { damage: 8, block: 10, bleed: 3 }
        },
        {
            id: 226,
            name: 'Endurance Champion',
            tier: 5,
            type: 'armour',
            exhaust: false,
            effects: { healing: 12, block: 7, extraPlays: 1 }
        },
        {
            id: 227,
            name: 'Gritted Teeth',
            tier: 5,
            type: 'armour',
            exhaust: false,
            effects: { healing: 8, damage: 5, regen: 5 }
        },
        {
            id: 228,
            name: 'Siege Wall',
            tier: 5,
            type: 'armour',
            exhaust: false,
            effects: { block: 16 }
        },
        {
            id: 229,
            name: 'Mending Roar',
            tier: 5,
            type: 'armour',
            exhaust: false,
            effects: { healing: 10, extraPlays: 1 }
        },
        {
            id: 230,
            name: 'Defy Death',
            tier: 5,
            type: 'armour',
            exhaust: true,
            effects: { healing: 20, block: 12, extraPlays: 1 }
        },

        // ── T6 ──────────────────────────────────────────────────────────
        {
            id: 231,
            name: 'Immortal Bulwark',
            tier: 6,
            type: 'armour',
            exhaust: true,
            effects: { healing: 9, regen: 6, block: 9 }
        },
        {
            id: 232,
            name: 'Hellguard',
            tier: 6,
            type: 'armour',
            exhaust: false,
            effects: { block: 20, healing: 8 }
        },
        {
            id: 233,
            name: 'Rebirth Plating',
            tier: 6,
            type: 'armour',
            exhaust: false,
            effects: { healing: 20, extraPlays: 1 }
        },
        {
            id: 234,
            name: 'Damnation Shell',
            tier: 6,
            type: 'armour',
            exhaust: false,
            effects: { damage: 10, block: 16, bleed: 4 }
        },
        {
            id: 235,
            name: 'Unkillable',
            tier: 6,
            type: 'armour',
            exhaust: false,
            effects: { healing: 12, block: 10, regen: 6 }
        },
        {
            id: 236,
            name: 'Colossus',
            tier: 6,
            type: 'armour',
            exhaust: false,
            effects: { block: 22, damage: 8 }
        },
        {
            id: 237,
            name: 'Monument',
            tier: 6,
            type: 'armour',
            exhaust: false,
            effects: { block: 18, healing: 12, extraPlays: 1 }
        },
        {
            id: 238,
            name: 'Spite Incarnate',
            tier: 6,
            type: 'armour',
            exhaust: false,
            effects: { damage: 12, block: 14, bleed: 5, healing: 6 }
        },
        {
            id: 239,
            name: 'Undying Legion',
            tier: 6,
            type: 'armour',
            exhaust: true,
            effects: { healing: 16, extraPlays: 1, block: 12, damage: 6 }
        },
        {
            id: 240,
            name: 'Invincible',
            tier: 6,
            type: 'armour',
            exhaust: true,
            effects: { block: 1000 }
        }
    ]
};

function getCardById(cardId) {
    for (const pool of Object.values(CARD_POOL)) {
        const found = pool.find((c) => c.id === cardId);
        if (found) return found;
    }
    return null;
}

// itemType is the DB subtype: 'Melee', 'Ranged', 'Helmet', or 'Armor'
// Returns 5 unique cards from the matching pool.
// Tier 1 always returns the same deterministic starter cards (sorted by id).
// For tier 2+: each card independently rolls its own tier —
//   15% one tier lower, 70% matching item tier, 15% one tier higher.
function pickCardsForItem(itemType, tier) {
    const typeMap = { Melee: 'melee', Ranged: 'ranged', Helmet: 'helmet', Armor: 'armour' };
    const poolKey = typeMap[itemType];
    if (!poolKey || !CARD_POOL[poolKey]) return [];

    const pool = CARD_POOL[poolKey];

    // Tier 1 starter gear always gets the same fixed cards
    if (tier === 1) {
        const t1 = pool.filter((c) => c.tier === 1).sort((a, b) => a.id - b.id);
        return t1.slice(0, 5);
    }

    const maxTier = 6;
    const minTier = 1;

    function rollCardTier() {
        const roll = Math.random();
        if (roll < 0.15) return Math.max(minTier, tier - 1);
        if (roll < 0.85) return tier;
        return Math.min(maxTier, tier + 1);
    }

    // Pick 5 cards, each with its own independent tier roll.
    // Avoid duplicates by tracking used ids.
    const picked = [];
    const usedIds = new Set();

    for (let i = 0; i < 5; i++) {
        const cardTier = rollCardTier();

        // Candidates at the rolled tier, excluding already picked
        let candidates = pool.filter((c) => c.tier === cardTier && !usedIds.has(c.id));

        // Fall back to adjacent tiers if needed
        if (candidates.length === 0) {
            candidates = pool.filter((c) => Math.abs(c.tier - cardTier) <= 1 && !usedIds.has(c.id));
        }

        // Last resort: any remaining card in the pool
        if (candidates.length === 0) {
            candidates = pool.filter((c) => !usedIds.has(c.id));
        }

        if (candidates.length === 0) break; // pool exhausted

        const card = candidates[Math.floor(Math.random() * candidates.length)];
        picked.push(card);
        usedIds.add(card.id);
    }

    return picked;
}

module.exports = {
    CARD_POOL,
    getCardById,
    pickCardsForItem
};
