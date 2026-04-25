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
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 3, bleed: 1 }
        },
        {
            id: 2,
            name: 'Poke',
            tier: 1,
            type: 'melee',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 1, extraPlays: 1 }
        },
        {
            id: 3,
            name: 'Wild Swing',
            tier: 1,
            type: 'melee',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 5, backfire: 1 }
        },
        {
            id: 4,
            name: 'Headbutt',
            tier: 1,
            type: 'melee',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 3, backfire: 1, extraPlays: 1 }
        },
        {
            id: 5,
            name: 'Ankle Biter',
            tier: 1,
            type: 'melee',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 2, bleed: 2 }
        },
        {
            id: 6,
            name: 'Guard',
            tier: 1,
            type: 'melee',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { block: 4 }
        },
        {
            id: 7,
            name: 'Taunt',
            tier: 1,
            type: 'melee',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { extraPlays: 2, backfire: 8 }
        },
        {
            id: 8,
            name: 'Cheap Shot',
            tier: 1,
            type: 'melee',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 4 }
        },
        {
            id: 9,
            name: 'Desperate Lunge',
            tier: 1,
            type: 'melee',
            exhaust: true,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 8, backfire: 2 }
        },
        {
            id: 10,
            name: 'Trip',
            tier: 1,
            type: 'melee',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 1, bleed: 1, extraPlays: 1 }
        },

        // ── T2 ──────────────────────────────────────────────────────────
        {
            id: 11,
            name: 'Reckless Strike',
            tier: 2,
            type: 'melee',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 6, backfire: 2 }
        },
        {
            id: 12,
            name: 'Pommel Smash',
            tier: 2,
            type: 'melee',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 5, extraPlays: 1 }
        },
        {
            id: 13,
            name: 'Gut Punch',
            tier: 2,
            type: 'melee',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 4, bleed: 1, extraPlays: 1 }
        },
        {
            id: 14,
            name: 'Counter-Slash',
            tier: 2,
            type: 'melee',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 5, block: 3 }
        },
        {
            id: 15,
            name: 'Shoulder Charge',
            tier: 2,
            type: 'melee',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 7, backfire: 3 }
        },
        {
            id: 16,
            name: 'Warcry',
            tier: 2,
            type: 'melee',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { extraPlays: 1, strength: 3 }
        },
        {
            id: 17,
            name: 'Sweeping Blow',
            tier: 2,
            type: 'melee',
            exhaust: false,
            targetType: 'all',
            affectedTargets: 'all',
            effects: { damage: 6, bleed: 1 }
        },
        {
            id: 18,
            name: 'Parry',
            tier: 2,
            type: 'melee',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { block: 6, extraPlays: 1 }
        },
        {
            id: 19,
            name: 'Gash',
            tier: 2,
            type: 'melee',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 5, bleed: 2 }
        },
        {
            id: 20,
            name: 'Bloodlust',
            tier: 2,
            type: 'melee',
            exhaust: true,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 10, bleed: 2, backfire: 3 }
        },

        // ── T3 ──────────────────────────────────────────────────────────
        {
            id: 21,
            name: 'Blood Cutter',
            tier: 3,
            type: 'melee',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 7, bleed: 2 }
        },
        {
            id: 22,
            name: 'Hamstring',
            tier: 3,
            type: 'melee',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 6, bleed: 3 }
        },
        {
            id: 23,
            name: 'Battle Trance',
            tier: 3,
            type: 'melee',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { extraPlays: 1, strength: 4, backfire: 2 }
        },
        {
            id: 24,
            name: 'Riposte',
            tier: 3,
            type: 'melee',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 7, block: 4 }
        },
        {
            id: 25,
            name: 'Cleave',
            tier: 3,
            type: 'melee',
            exhaust: false,
            targetType: 'all',
            affectedTargets: 'all',
            effects: { damage: 9, backfire: 2 }
        },
        {
            id: 26,
            name: 'Jugular Slice',
            tier: 3,
            type: 'melee',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 5, bleed: 4 }
        },
        {
            id: 27,
            name: 'Second Wind',
            tier: 3,
            type: 'melee',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { healing: 5, extraPlays: 1 }
        },
        {
            id: 28,
            name: 'Whirlwind',
            tier: 3,
            type: 'melee',
            exhaust: false,
            targetType: 'all',
            affectedTargets: 'all',
            effects: { damage: 8, bleed: 1, extraPlays: 1, backfire: 3 }
        },
        {
            id: 29,
            name: 'Steel Nerve',
            tier: 3,
            type: 'melee',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { block: 8, extraPlays: 1 }
        },
        {
            id: 30,
            name: 'Feral Ambush',
            tier: 3,
            type: 'melee',
            exhaust: true,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 14, bleed: 3, backfire: 4 }
        },

        // ── T4 ──────────────────────────────────────────────────────────
        {
            id: 31,
            name: 'Savage Combo',
            tier: 4,
            type: 'melee',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 9, bleed: 2, extraPlays: 1 }
        },
        {
            id: 32,
            name: 'Artery Burst',
            tier: 4,
            type: 'melee',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 8, bleed: 4 }
        },
        {
            id: 33,
            name: 'Iron Rend',
            tier: 4,
            type: 'melee',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 11, bleed: 3, backfire: 3 }
        },
        {
            id: 34,
            name: 'Death March',
            tier: 4,
            type: 'melee',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 7, extraPlays: 1, backfire: 2 }
        },
        {
            id: 35,
            name: "Mama's Chili Oil",
            tier: 4,
            type: 'melee',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 10, scorch: 2, extraPlays: 1, backfire: 4 }
        },
        {
            id: 36,
            name: 'Bonecrusher',
            tier: 4,
            type: 'melee',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 13, vulnerable: { pct: 20, turns: 1 }, backfire: 4 }
        },
        {
            id: 37,
            name: 'Rally',
            tier: 4,
            type: 'melee',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { healing: 6, extraPlays: 1 }
        },
        {
            id: 38,
            name: 'Gut Rip',
            tier: 4,
            type: 'melee',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 9, bleed: 5, backfire: 2 }
        },
        {
            id: 39,
            name: 'Fortress Stance',
            tier: 4,
            type: 'melee',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { block: 12, extraPlays: 1 }
        },
        {
            id: 40,
            name: 'Carnage',
            tier: 4,
            type: 'melee',
            exhaust: true,
            targetType: 'all',
            affectedTargets: 'all',
            effects: { damage: 8, bleed: 4, extraPlays: 1, backfire: 5 }
        },

        // ── T5 ──────────────────────────────────────────────────────────
        {
            id: 41,
            name: "Executioner's Rush",
            tier: 5,
            type: 'melee',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 13, bleed: 3, backfire: 3 }
        },
        {
            id: 42,
            name: 'Hemorrhage',
            tier: 5,
            type: 'melee',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 11, bleed: 6 }
        },
        {
            id: 43,
            name: 'Skull Splitter',
            tier: 5,
            type: 'melee',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 15, vulnerable: { pct: 25, turns: 2 }, backfire: 5 }
        },
        {
            id: 44,
            name: 'Death Rattle',
            tier: 5,
            type: 'melee',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 10, bleed: 4, extraPlays: 1 }
        },
        {
            id: 45,
            name: 'Warlord Smash',
            tier: 5,
            type: 'melee',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 14, block: 6 }
        },
        {
            id: 46,
            name: 'Crimson Dash',
            tier: 5,
            type: 'melee',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 9, bleed: 3, extraPlays: 1 }
        },
        {
            id: 47,
            name: 'Pain is Power',
            tier: 5,
            type: 'melee',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 16, backfire: 6, extraPlays: 1 }
        },
        {
            id: 48,
            name: 'Titan Grip',
            tier: 5,
            type: 'melee',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 12, block: 8 }
        },
        {
            id: 49,
            name: 'Bloodbath',
            tier: 5,
            type: 'melee',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 10, bleed: 5, lifesteal: { pct: 20, turns: 2 } }
        },
        {
            id: 50,
            name: "Reaper's Toll",
            tier: 5,
            type: 'melee',
            exhaust: true,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 22, bleed: 6, backfire: 7, extraPlays: 1 }
        },

        // ── T6 ──────────────────────────────────────────────────────────
        {
            id: 51,
            name: 'Doom Blade Frenzy',
            tier: 6,
            type: 'melee',
            exhaust: true,
            targetType: 'random',
            affectedTargets: 3,
            effects: { damage: 16, bleed: 4, extraPlays: 1, backfire: 4 }
        },
        {
            id: 52,
            name: 'Obliterate',
            tier: 6,
            type: 'melee',
            exhaust: true,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 20, bleed: 5, vulnerable: { pct: 30, turns: 2 }, backfire: 6 }
        },
        {
            id: 53,
            name: 'Hell Cleave',
            tier: 6,
            type: 'melee',
            exhaust: false,
            targetType: 'all',
            affectedTargets: 'all',
            effects: { damage: 18, bleed: 6, extraPlays: 1 }
        },
        {
            id: 54,
            name: 'Demon Rend',
            tier: 6,
            type: 'melee',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 18, bleed: 4, backfire: 8 }
        },
        {
            id: 55,
            name: 'Undying Rage',
            tier: 6,
            type: 'melee',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 15, bleed: 5, healing: 5 }
        },
        {
            id: 56,
            name: 'Soulripper',
            tier: 6,
            type: 'melee',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 17, bleed: 7, extraPlays: 1 }
        },
        {
            id: 57,
            name: "Death's Embrace",
            tier: 6,
            type: 'melee',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 16, healing: 6, lifesteal: { pct: 20, turns: 2 } }
        },
        {
            id: 58,
            name: 'Godsplitter',
            tier: 6,
            type: 'melee',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 20, vulnerable: { pct: 25, turns: 2 }, backfire: 10 }
        },
        {
            id: 59,
            name: 'Infernal Combo',
            tier: 6,
            type: 'melee',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 14, bleed: 4, extraPlays: 1, backfire: 5 }
        },
        {
            id: 60,
            name: 'Final Rampage',
            tier: 6,
            type: 'melee',
            exhaust: true,
            targetType: 'all',
            affectedTargets: 'all',
            effects: { damage: 30, bleed: 8, extraPlays: 1, backfire: 12 }
        },

        // ── NEW T1 melee ─────────────────────────────────────────────────
        {
            id: 301,
            name: 'Wild Swing',
            tier: 1,
            type: 'melee',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 4, backfire: 1 }
        },
        {
            id: 302,
            name: 'Shield Bash',
            tier: 1,
            type: 'melee',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 2, block: 3 }
        },
        {
            id: 303,
            name: 'Aggressive Stance',
            tier: 1,
            type: 'melee',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { strength: 2, backfire: 2 }
        },
        {
            id: 304,
            name: 'Lacerate',
            tier: 1,
            type: 'melee',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 2, bleed: 3 }
        },
        {
            id: 305,
            name: 'Desperation Strike',
            tier: 1,
            type: 'melee',
            exhaust: true,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 12, strength: 2 }
        },
        {
            id: 306,
            name: 'Stomp',
            tier: 1,
            type: 'melee',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 3, vulnerable: { pct: 10, turns: 1 } }
        },
        {
            id: 307,
            name: 'Chip Away',
            tier: 1,
            type: 'melee',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 1, bleed: 1, extraPlays: 1 }
        },
        {
            id: 308,
            name: 'Iron Resolve',
            tier: 1,
            type: 'melee',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { block: 4, strength: 1 }
        },
        {
            id: 309,
            name: 'Blood Offering',
            tier: 1,
            type: 'melee',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { strength: 3, backfire: 4 }
        },
        {
            id: 310,
            name: 'Fury Burst',
            tier: 1,
            type: 'melee',
            exhaust: true,
            targetType: 'random',
            affectedTargets: 3,
            effects: { damage: 4, bleed: 1 }
        },

        // ── NEW T2 melee ─────────────────────────────────────────────────
        {
            id: 311,
            name: 'Reckless Charge',
            tier: 2,
            type: 'melee',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 8, backfire: 3 }
        },
        {
            id: 312,
            name: 'Warlord Step',
            tier: 2,
            type: 'melee',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { strength: 2, extraPlays: 1, backfire: 2 }
        },
        {
            id: 313,
            name: 'Gore Wound',
            tier: 2,
            type: 'melee',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 5, bleed: 4 }
        },
        {
            id: 314,
            name: 'Lifetap',
            tier: 2,
            type: 'melee',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 6, lifesteal: { pct: 15, turns: 1 } }
        },
        {
            id: 315,
            name: 'Momentum',
            tier: 2,
            type: 'melee',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 4, strength: 1, extraPlays: 1 }
        },
        {
            id: 316,
            name: 'Hamstring',
            tier: 2,
            type: 'melee',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 5, vulnerable: { pct: 20, turns: 2 } }
        },
        {
            id: 317,
            name: 'Burning Strike',
            tier: 2,
            type: 'melee',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 5, scorch: 2 }
        },
        {
            id: 318,
            name: 'Bleed Through',
            tier: 2,
            type: 'melee',
            exhaust: true,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 7, bleed: 6 }
        },
        {
            id: 319,
            name: 'Parry and Riposte',
            tier: 2,
            type: 'melee',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { block: 5, damage: 4 }
        },
        {
            id: 320,
            name: 'Bloodlust Stance',
            tier: 2,
            type: 'melee',
            exhaust: true,
            targetType: 'self',
            affectedTargets: 1,
            effects: { strength: 4, lifesteal: { pct: 20, turns: 2 } }
        },

        // ── NEW T3 melee ─────────────────────────────────────────────────
        {
            id: 321,
            name: 'Blade Storm',
            tier: 3,
            type: 'melee',
            exhaust: false,
            targetType: 'random',
            affectedTargets: 3,
            effects: { damage: 6, bleed: 2 }
        },
        {
            id: 322,
            name: 'Wrath',
            tier: 3,
            type: 'melee',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { strength: 4, backfire: 3 }
        },
        {
            id: 323,
            name: 'Deep Cut',
            tier: 3,
            type: 'melee',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 8, bleed: 5 }
        },
        {
            id: 324,
            name: 'Siphon Strike',
            tier: 3,
            type: 'melee',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 9, lifesteal: { pct: 20, turns: 1 } }
        },
        {
            id: 325,
            name: 'Expose Weakness',
            tier: 3,
            type: 'melee',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 6, vulnerable: { pct: 25, turns: 2 } }
        },
        {
            id: 326,
            name: 'Inferno Blade',
            tier: 3,
            type: 'melee',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 8, scorch: 3 }
        },
        {
            id: 327,
            name: 'Relentless',
            tier: 3,
            type: 'melee',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 7, extraPlays: 1, backfire: 4 }
        },
        {
            id: 328,
            name: 'Flurry of Blows',
            tier: 3,
            type: 'melee',
            exhaust: true,
            targetType: 'random',
            affectedTargets: 4,
            effects: { damage: 5, bleed: 2, extraPlays: 1 }
        },
        {
            id: 329,
            name: 'Stance Break',
            tier: 3,
            type: 'melee',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 10, vulnerable: { pct: 15, turns: 3 } }
        },
        {
            id: 330,
            name: 'Vampiric Rush',
            tier: 3,
            type: 'melee',
            exhaust: true,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 10, lifesteal: { pct: 30, turns: 2 }, healing: 5 }
        },

        // ── NEW T4 melee ─────────────────────────────────────────────────
        {
            id: 331,
            name: 'Blood Frenzy',
            tier: 4,
            type: 'melee',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 10, bleed: 5, lifesteal: { pct: 15, turns: 1 } }
        },
        {
            id: 332,
            name: 'Titan Strike',
            tier: 4,
            type: 'melee',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 14, vulnerable: { pct: 20, turns: 2 }, backfire: 4 }
        },
        {
            id: 333,
            name: 'Scorched Flesh',
            tier: 4,
            type: 'melee',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 11, scorch: 4, bleed: 2 }
        },
        {
            id: 334,
            name: 'Power Surge',
            tier: 4,
            type: 'melee',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { strength: 5, extraPlays: 1, backfire: 5 }
        },
        {
            id: 335,
            name: 'Sanguine Blade',
            tier: 4,
            type: 'melee',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 12, lifesteal: { pct: 25, turns: 2 } }
        },
        {
            id: 336,
            name: 'Guillotine',
            tier: 4,
            type: 'melee',
            exhaust: true,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 22, vulnerable: { pct: 30, turns: 2 } }
        },
        {
            id: 337,
            name: 'Whirlwind',
            tier: 4,
            type: 'melee',
            exhaust: false,
            targetType: 'all',
            affectedTargets: 'all',
            effects: { damage: 8, bleed: 3 }
        },
        {
            id: 338,
            name: 'Soul Carve',
            tier: 4,
            type: 'melee',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 11, bleed: 4, extraPlays: 1, backfire: 6 }
        },
        {
            id: 339,
            name: 'Wrath of Steel',
            tier: 4,
            type: 'melee',
            exhaust: true,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 18, strength: 4, bleed: 5 }
        },
        {
            id: 340,
            name: 'Predator Lunge',
            tier: 4,
            type: 'melee',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 9, scorch: 4, extraPlays: 1 }
        },

        // ── NEW T5 melee ─────────────────────────────────────────────────
        {
            id: 341,
            name: 'Crimson Cyclone',
            tier: 5,
            type: 'melee',
            exhaust: false,
            targetType: 'all',
            affectedTargets: 'all',
            effects: { damage: 10, bleed: 4 }
        },
        {
            id: 342,
            name: 'Hemorrhage',
            tier: 5,
            type: 'melee',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 13, bleed: 7, lifesteal: { pct: 15, turns: 1 } }
        },
        {
            id: 343,
            name: 'Cursed Blade',
            tier: 5,
            type: 'melee',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 14, scorch: 5, backfire: 5 }
        },
        {
            id: 344,
            name: 'War Machine',
            tier: 5,
            type: 'melee',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { strength: 6, extraPlays: 1, backfire: 6 }
        },
        {
            id: 345,
            name: 'Executioner',
            tier: 5,
            type: 'melee',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 16, vulnerable: { pct: 30, turns: 2 }, backfire: 6 }
        },
        {
            id: 346,
            name: 'Dread Cleave',
            tier: 5,
            type: 'melee',
            exhaust: false,
            targetType: 'all',
            affectedTargets: 'all',
            effects: { damage: 11, bleed: 3, extraPlays: 1, backfire: 7 }
        },
        {
            id: 347,
            name: 'Eternal Thirst',
            tier: 5,
            type: 'melee',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 14, lifesteal: { pct: 30, turns: 2 } }
        },
        {
            id: 348,
            name: 'Magma Blade',
            tier: 5,
            type: 'melee',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 13, scorch: 6, bleed: 3 }
        },
        {
            id: 349,
            name: 'Killing Intent',
            tier: 5,
            type: 'melee',
            exhaust: true,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 20, strength: 5, vulnerable: { pct: 25, turns: 2 } }
        },
        {
            id: 350,
            name: 'Butcher',
            tier: 5,
            type: 'melee',
            exhaust: true,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 24, bleed: 8, backfire: 8 }
        },

        // ── NEW T6 melee ─────────────────────────────────────────────────
        {
            id: 351,
            name: 'Ragnarok',
            tier: 6,
            type: 'melee',
            exhaust: true,
            targetType: 'all',
            affectedTargets: 'all',
            effects: { damage: 22, bleed: 6, scorch: 4, backfire: 10 }
        },
        {
            id: 352,
            name: 'Void Cleave',
            tier: 6,
            type: 'melee',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 17, bleed: 6, extraPlays: 1, backfire: 7 }
        },
        {
            id: 353,
            name: 'Soul Harvest',
            tier: 6,
            type: 'melee',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 16, lifesteal: { pct: 30, turns: 2 }, healing: 6 }
        },
        {
            id: 354,
            name: 'Eternal Wrath',
            tier: 6,
            type: 'melee',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { strength: 7, extraPlays: 1, backfire: 8 }
        },
        {
            id: 355,
            name: 'Hell Cutter',
            tier: 6,
            type: 'melee',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 18, scorch: 6, bleed: 4 }
        },
        {
            id: 356,
            name: 'Armageddon Blade',
            tier: 6,
            type: 'melee',
            exhaust: true,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 28, strength: 6, bleed: 7, backfire: 10 }
        },
        {
            id: 357,
            name: 'Doomsday Cleave',
            tier: 6,
            type: 'melee',
            exhaust: false,
            targetType: 'all',
            affectedTargets: 'all',
            effects: { damage: 13, bleed: 5, vulnerable: { pct: 20, turns: 1 } }
        },
        {
            id: 358,
            name: 'Bloodborn Frenzy',
            tier: 6,
            type: 'melee',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 15, bleed: 5, lifesteal: { pct: 25, turns: 2 }, backfire: 5 }
        },
        {
            id: 359,
            name: 'Infernal Champion',
            tier: 6,
            type: 'melee',
            exhaust: true,
            targetType: 'self',
            affectedTargets: 1,
            effects: { strength: 8, extraPlays: 2, lifesteal: { pct: 30, turns: 3 } }
        },
        {
            id: 360,
            name: 'Carnage',
            tier: 6,
            type: 'melee',
            exhaust: true,
            targetType: 'random',
            affectedTargets: 5,
            effects: { damage: 16, bleed: 5, backfire: 12 }
        },

        // ── EXTRA: melee deflect + multi-target ─────────────────────────
        {
            id: 361,
            name: 'Blade Wall',
            tier: 2,
            type: 'melee',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { block: 5, deflect: { pct: 8, turns: 2 } }
        },
        {
            id: 362,
            name: 'Counter Cleave',
            tier: 3,
            type: 'melee',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 8, deflect: { pct: 8, turns: 1 } }
        },
        {
            id: 363,
            name: 'Savage Whirl',
            tier: 3,
            type: 'melee',
            exhaust: false,
            targetType: 'all',
            affectedTargets: 'all',
            effects: { damage: 8, bleed: 2 }
        },
        {
            id: 364,
            name: 'Stampede',
            tier: 3,
            type: 'melee',
            exhaust: false,
            targetType: 'random',
            affectedTargets: 4,
            effects: { damage: 7, backfire: 3 }
        },
        {
            id: 365,
            name: 'Iron Counter',
            tier: 4,
            type: 'melee',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { deflect: { pct: 12, turns: 2 }, block: 6 }
        },
        {
            id: 366,
            name: 'Carnage Wave',
            tier: 4,
            type: 'melee',
            exhaust: false,
            targetType: 'all',
            affectedTargets: 'all',
            effects: { damage: 10, bleed: 3, backfire: 5 }
        },
        {
            id: 367,
            name: 'Reaping Strike',
            tier: 4,
            type: 'melee',
            exhaust: false,
            targetType: 'random',
            affectedTargets: 3,
            effects: { damage: 9, lifesteal: { pct: 20, turns: 1 } }
        },
        {
            id: 368,
            name: 'Ground Slam',
            tier: 5,
            type: 'melee',
            exhaust: false,
            targetType: 'all',
            affectedTargets: 'all',
            effects: { damage: 11, vulnerable: { pct: 15, turns: 1 } }
        },
        {
            id: 369,
            name: 'Reflective Guard',
            tier: 5,
            type: 'melee',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { deflect: { pct: 15, turns: 2 }, strength: 2, block: 4 }
        },
        {
            id: 370,
            name: 'Bleed Everything',
            tier: 5,
            type: 'melee',
            exhaust: false,
            targetType: 'all',
            affectedTargets: 'all',
            effects: { bleed: 4, damage: 6 }
        },
        {
            id: 371,
            name: 'Mirror Stance',
            tier: 6,
            type: 'melee',
            exhaust: true,
            targetType: 'self',
            affectedTargets: 1,
            effects: { deflect: { pct: 25, turns: 3 }, block: 10, strength: 3 }
        },
        {
            id: 372,
            name: 'Mass Execution',
            tier: 6,
            type: 'melee',
            exhaust: false,
            targetType: 'all',
            affectedTargets: 'all',
            effects: { damage: 14, bleed: 4, backfire: 6 }
        },

        // ── T7 melee — legendary, T6 equipment only (~10% per slot) ─────
        {
            id: 701,
            name: 'God Slayer',
            tier: 7,
            type: 'melee',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 28, strength: 8, backfire: 8 }
        },
        {
            id: 702,
            name: 'Eternal Carnage',
            tier: 7,
            type: 'melee',
            exhaust: false,
            targetType: 'all',
            affectedTargets: 'all',
            effects: { damage: 18, bleed: 7, scorch: 4 }
        },
        {
            id: 703,
            name: 'Apocalyptic Blade',
            tier: 7,
            type: 'melee',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 25, bleed: 8, lifesteal: { pct: 35, turns: 2 } }
        },
        {
            id: 704,
            name: 'Void Rend',
            tier: 7,
            type: 'melee',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 22, scorch: 7, vulnerable: { pct: 35, turns: 2 } }
        },
        {
            id: 705,
            name: 'Omega Cleave',
            tier: 7,
            type: 'melee',
            exhaust: true,
            targetType: 'all',
            affectedTargets: 'all',
            effects: { damage: 30, bleed: 9, scorch: 6, backfire: 10 }
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
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 2 }
        },
        {
            id: 62,
            name: 'Pebble Toss',
            tier: 1,
            type: 'ranged',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 1, extraPlays: 1 }
        },
        {
            id: 63,
            name: 'Wobbling Arrow',
            tier: 1,
            type: 'ranged',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 3, backfire: 1 }
        },
        {
            id: 64,
            name: 'Scratch Shot',
            tier: 1,
            type: 'ranged',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 2, scorch: 1 }
        },
        {
            id: 65,
            name: 'Duck and Fire',
            tier: 1,
            type: 'ranged',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 2, block: 2 }
        },
        {
            id: 66,
            name: 'Nock and Think',
            tier: 1,
            type: 'ranged',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { extraPlays: 1 }
        },
        {
            id: 67,
            name: 'Close Quarters Shot',
            tier: 1,
            type: 'ranged',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 4, backfire: 2 }
        },
        {
            id: 68,
            name: 'Kneecap Shot',
            tier: 1,
            type: 'ranged',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 2, bleed: 1, extraPlays: 1, backfire: 1 }
        },
        {
            id: 69,
            name: 'Loose Bolt',
            tier: 1,
            type: 'ranged',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 5, backfire: 3 }
        },
        {
            id: 70,
            name: 'Opening Salvo',
            tier: 1,
            type: 'ranged',
            exhaust: true,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 7, bleed: 1, extraPlays: 1 }
        },

        // ── T2 ──────────────────────────────────────────────────────────
        {
            id: 71,
            name: 'Piercing Arrow',
            tier: 2,
            type: 'ranged',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 5 }
        },
        {
            id: 72,
            name: 'Crippling Shot',
            tier: 2,
            type: 'ranged',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 4, bleed: 2 }
        },
        {
            id: 73,
            name: 'Fan of Knives',
            tier: 2,
            type: 'ranged',
            exhaust: false,
            targetType: 'random',
            affectedTargets: 2,
            effects: { damage: 3, bleed: 1, extraPlays: 1 }
        },
        {
            id: 74,
            name: 'Calculated Aim',
            tier: 2,
            type: 'ranged',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 6, vulnerable: { pct: 15, turns: 1 }, extraPlays: 1, backfire: 1 }
        },
        {
            id: 75,
            name: 'Smoke and Shoot',
            tier: 2,
            type: 'ranged',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 4, block: 3 }
        },
        {
            id: 76,
            name: 'Scatter Shot',
            tier: 2,
            type: 'ranged',
            exhaust: false,
            targetType: 'random',
            affectedTargets: 2,
            effects: { damage: 3, bleed: 2, extraPlays: 1 }
        },
        {
            id: 77,
            name: 'Backpedal',
            tier: 2,
            type: 'ranged',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { block: 5, extraPlays: 1 }
        },
        {
            id: 78,
            name: 'Poisoned Tip',
            tier: 2,
            type: 'ranged',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 4, scorch: 3, backfire: 1 }
        },
        {
            id: 79,
            name: 'Double Tap',
            tier: 2,
            type: 'ranged',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 7, backfire: 2, extraPlays: 1 }
        },
        {
            id: 80,
            name: 'Aimed Burst',
            tier: 2,
            type: 'ranged',
            exhaust: true,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 10, bleed: 2, extraPlays: 1 }
        },

        // ── T3 ──────────────────────────────────────────────────────────
        {
            id: 81,
            name: 'Trick Shot',
            tier: 3,
            type: 'ranged',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 6, vulnerable: { pct: 20, turns: 1 } }
        },
        {
            id: 82,
            name: "Hunter's Mark",
            tier: 3,
            type: 'ranged',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 5, bleed: 3, extraPlays: 1 }
        },
        {
            id: 83,
            name: 'Evasive Shot',
            tier: 3,
            type: 'ranged',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 5, block: 4 }
        },
        {
            id: 84,
            name: 'Burst Fire',
            tier: 3,
            type: 'ranged',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 8, extraPlays: 1, backfire: 2 }
        },
        {
            id: 85,
            name: 'Bleeding Shaft',
            tier: 3,
            type: 'ranged',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 4, bleed: 4 }
        },
        {
            id: 86,
            name: 'Redirect',
            tier: 3,
            type: 'ranged',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { extraPlays: 1 }
        },
        {
            id: 87,
            name: 'Serrated Bolt',
            tier: 3,
            type: 'ranged',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 7, scorch: 3, backfire: 2 }
        },
        {
            id: 88,
            name: 'Shadow Step',
            tier: 3,
            type: 'ranged',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { block: 6, extraPlays: 1 }
        },
        {
            id: 89,
            name: 'Overcharge',
            tier: 3,
            type: 'ranged',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 9, backfire: 3 }
        },
        {
            id: 90,
            name: 'Deadeye',
            tier: 3,
            type: 'ranged',
            exhaust: true,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 14, bleed: 3, extraPlays: 1 }
        },

        // ── T4 ──────────────────────────────────────────────────────────
        {
            id: 91,
            name: 'Volley',
            tier: 4,
            type: 'ranged',
            exhaust: false,
            targetType: 'random',
            affectedTargets: 3,
            effects: { damage: 5, vulnerable: { pct: 20, turns: 2 }, extraPlays: 1 }
        },
        {
            id: 92,
            name: 'Hail Shot',
            tier: 4,
            type: 'ranged',
            exhaust: false,
            targetType: 'random',
            affectedTargets: 2,
            effects: { damage: 9, bleed: 3, backfire: 3 }
        },
        {
            id: 93,
            name: 'Ricochet',
            tier: 4,
            type: 'ranged',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 8, extraPlays: 1 }
        },
        {
            id: 94,
            name: 'Incendiary Arrow',
            tier: 4,
            type: 'ranged',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 7, scorch: 4, backfire: 2 }
        },
        {
            id: 95,
            name: 'Covering Fire',
            tier: 4,
            type: 'ranged',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 6, block: 7, extraPlays: 1 }
        },
        {
            id: 96,
            name: 'Rapid Draw',
            tier: 4,
            type: 'ranged',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { extraPlays: 1 }
        },
        {
            id: 97,
            name: 'Piercing Volley',
            tier: 4,
            type: 'ranged',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 11, bleed: 3 }
        },
        {
            id: 98,
            name: 'Disarm Shot',
            tier: 4,
            type: 'ranged',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 8, extraPlays: 1, backfire: 4 }
        },
        {
            id: 99,
            name: 'Needle Rain',
            tier: 4,
            type: 'ranged',
            exhaust: false,
            targetType: 'random',
            affectedTargets: 3,
            effects: { damage: 6, bleed: 5, backfire: 2 }
        },
        {
            id: 100,
            name: "Sniper's Gambit",
            tier: 4,
            type: 'ranged',
            exhaust: true,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 18, bleed: 4, backfire: 5 }
        },

        // ── T5 ──────────────────────────────────────────────────────────
        {
            id: 101,
            name: 'Sniper Focus',
            tier: 5,
            type: 'ranged',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 11 }
        },
        {
            id: 102,
            name: 'Heartseeker',
            tier: 5,
            type: 'ranged',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 13, scorch: 4 }
        },
        {
            id: 103,
            name: 'Arrow Storm',
            tier: 5,
            type: 'ranged',
            exhaust: false,
            targetType: 'random',
            affectedTargets: 3,
            effects: { damage: 10, bleed: 3, extraPlays: 1 }
        },
        {
            id: 104,
            name: 'Ghost Bolt',
            tier: 5,
            type: 'ranged',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 12, extraPlays: 1, backfire: 3 }
        },
        {
            id: 105,
            name: 'Barbed Salvo',
            tier: 5,
            type: 'ranged',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 9, scorch: 6, backfire: 2 }
        },
        {
            id: 106,
            name: 'Lethal Aim',
            tier: 5,
            type: 'ranged',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 15, vulnerable: { pct: 25, turns: 2 }, backfire: 5 }
        },
        {
            id: 107,
            name: 'Retreating Volley',
            tier: 5,
            type: 'ranged',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 10, block: 7, extraPlays: 1 }
        },
        {
            id: 108,
            name: 'Blinding Shot',
            tier: 5,
            type: 'ranged',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 8, bleed: 3, extraPlays: 1, backfire: 3 }
        },
        {
            id: 109,
            name: 'Phantom Arrow',
            tier: 5,
            type: 'ranged',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 12, bleed: 5, extraPlays: 1 }
        },
        {
            id: 110,
            name: 'Thousand Cuts',
            tier: 5,
            type: 'ranged',
            exhaust: true,
            targetType: 'random',
            affectedTargets: 4,
            effects: { damage: 14, bleed: 8, extraPlays: 1, backfire: 4 }
        },

        // ── T6 ──────────────────────────────────────────────────────────
        {
            id: 111,
            name: 'Rain of Arrows',
            tier: 6,
            type: 'ranged',
            exhaust: true,
            targetType: 'all',
            affectedTargets: 'all',
            effects: { damage: 14, extraPlays: 1 }
        },
        {
            id: 112,
            name: 'Godshot',
            tier: 6,
            type: 'ranged',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 16, scorch: 4, backfire: 6 }
        },
        {
            id: 113,
            name: 'Hell Volley',
            tier: 6,
            type: 'ranged',
            exhaust: false,
            targetType: 'all',
            affectedTargets: 'all',
            effects: { damage: 14, bleed: 5 }
        },
        {
            id: 114,
            name: 'Doomsday Arrow',
            tier: 6,
            type: 'ranged',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 18, bleed: 4, backfire: 8 }
        },
        {
            id: 115,
            name: 'Infinite Quiver',
            tier: 6,
            type: 'ranged',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 10, bleed: 3, extraPlays: 1, backfire: 4 }
        },
        {
            id: 116,
            name: 'Soulpiercer',
            tier: 6,
            type: 'ranged',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 15, bleed: 6, extraPlays: 1 }
        },
        {
            id: 117,
            name: 'Entropy Bolt',
            tier: 6,
            type: 'ranged',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 14, bleed: 4, extraPlays: 1, backfire: 5 }
        },
        {
            id: 118,
            name: "Marksman's Doom",
            tier: 6,
            type: 'ranged',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 19, backfire: 9 }
        },
        {
            id: 119,
            name: 'Rapid Hellfire',
            tier: 6,
            type: 'ranged',
            exhaust: false,
            targetType: 'random',
            affectedTargets: 3,
            effects: { damage: 13, scorch: 4, extraPlays: 1, backfire: 5 }
        },
        {
            id: 120,
            name: 'Oblivion Barrage',
            tier: 6,
            type: 'ranged',
            exhaust: true,
            targetType: 'all',
            affectedTargets: 'all',
            effects: { damage: 30, bleed: 9, extraPlays: 1, backfire: 12 }
        },

        // ── NEW T1 ranged ────────────────────────────────────────────────
        {
            id: 401,
            name: 'Piercing Arrow',
            tier: 1,
            type: 'ranged',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 3, bleed: 1 }
        },
        {
            id: 402,
            name: 'Steady Aim',
            tier: 1,
            type: 'ranged',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { extraPlays: 1, block: 2 }
        },
        {
            id: 403,
            name: 'Grazed Shot',
            tier: 1,
            type: 'ranged',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 2, vulnerable: { pct: 10, turns: 1 } }
        },
        {
            id: 404,
            name: 'Smoke Arrow',
            tier: 1,
            type: 'ranged',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { scorch: 2, vulnerable: { pct: 10, turns: 1 } }
        },
        {
            id: 405,
            name: 'Aimed Shot',
            tier: 1,
            type: 'ranged',
            exhaust: true,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 10, vulnerable: { pct: 15, turns: 1 } }
        },
        {
            id: 406,
            name: 'Skirmish',
            tier: 1,
            type: 'ranged',
            exhaust: false,
            targetType: 'random',
            affectedTargets: 2,
            effects: { damage: 2, bleed: 1 }
        },
        {
            id: 407,
            name: 'Flame Arrow',
            tier: 1,
            type: 'ranged',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 2, scorch: 2 }
        },
        {
            id: 408,
            name: 'Hunter Step',
            tier: 1,
            type: 'ranged',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { block: 3, extraPlays: 1 }
        },
        {
            id: 409,
            name: 'Barbed Shaft',
            tier: 1,
            type: 'ranged',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 1, bleed: 4 }
        },
        {
            id: 410,
            name: 'Surprise Volley',
            tier: 1,
            type: 'ranged',
            exhaust: true,
            targetType: 'random',
            affectedTargets: 3,
            effects: { damage: 3, bleed: 2 }
        },

        // ── NEW T2 ranged ────────────────────────────────────────────────
        {
            id: 411,
            name: 'Leg Shot',
            tier: 2,
            type: 'ranged',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 5, vulnerable: { pct: 20, turns: 2 } }
        },
        {
            id: 412,
            name: 'Incendiary Bolt',
            tier: 2,
            type: 'ranged',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 4, scorch: 3 }
        },
        {
            id: 413,
            name: 'Bleeding Flechette',
            tier: 2,
            type: 'ranged',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 3, bleed: 4 }
        },
        {
            id: 414,
            name: 'Hawk Eye',
            tier: 2,
            type: 'ranged',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { extraPlays: 1, vulnerable: { pct: 0, turns: 0 } }
        },
        {
            id: 415,
            name: 'Crippling Arrow',
            tier: 2,
            type: 'ranged',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 4, bleed: 3, vulnerable: { pct: 15, turns: 1 } }
        },
        {
            id: 416,
            name: 'Rapid Fire',
            tier: 2,
            type: 'ranged',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 7, extraPlays: 1, backfire: 2 }
        },
        {
            id: 417,
            name: 'Smoke Screen',
            tier: 2,
            type: 'ranged',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { block: 5, extraPlays: 1 }
        },
        {
            id: 418,
            name: 'Ember Bolt',
            tier: 2,
            type: 'ranged',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 4, scorch: 4 }
        },
        {
            id: 419,
            name: 'Twin Shot',
            tier: 2,
            type: 'ranged',
            exhaust: false,
            targetType: 'random',
            affectedTargets: 2,
            effects: { damage: 4, bleed: 2 }
        },
        {
            id: 420,
            name: 'Ambush',
            tier: 2,
            type: 'ranged',
            exhaust: true,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 8, bleed: 4, vulnerable: { pct: 20, turns: 2 } }
        },

        // ── NEW T3 ranged ────────────────────────────────────────────────
        {
            id: 421,
            name: 'Scorched Earth',
            tier: 3,
            type: 'ranged',
            exhaust: false,
            targetType: 'all',
            affectedTargets: 'all',
            effects: { damage: 5, scorch: 3 }
        },
        {
            id: 422,
            name: 'Blood Arrow',
            tier: 3,
            type: 'ranged',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 8, bleed: 5 }
        },
        {
            id: 423,
            name: 'Sniper Focus',
            tier: 3,
            type: 'ranged',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 11, backfire: 3 }
        },
        {
            id: 424,
            name: 'Tracking Shot',
            tier: 3,
            type: 'ranged',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 7, vulnerable: { pct: 25, turns: 2 }, extraPlays: 1 }
        },
        {
            id: 425,
            name: 'Fire Volley',
            tier: 3,
            type: 'ranged',
            exhaust: false,
            targetType: 'all',
            affectedTargets: 'all',
            effects: { scorch: 4, damage: 4 }
        },
        {
            id: 426,
            name: 'Ricochet',
            tier: 3,
            type: 'ranged',
            exhaust: false,
            targetType: 'random',
            affectedTargets: 3,
            effects: { damage: 5, bleed: 2, extraPlays: 1, backfire: 3 }
        },
        {
            id: 427,
            name: 'Debilitating Arrow',
            tier: 3,
            type: 'ranged',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 6, vulnerable: { pct: 30, turns: 1 } }
        },
        {
            id: 428,
            name: 'Hell Shot',
            tier: 3,
            type: 'ranged',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 9, scorch: 4, backfire: 3 }
        },
        {
            id: 429,
            name: 'Storm of Bolts',
            tier: 3,
            type: 'ranged',
            exhaust: true,
            targetType: 'random',
            affectedTargets: 4,
            effects: { damage: 6, bleed: 3 }
        },
        {
            id: 430,
            name: 'Viper Round',
            tier: 3,
            type: 'ranged',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 7, bleed: 4, scorch: 2 }
        },

        // ── NEW T4 ranged ────────────────────────────────────────────────
        {
            id: 431,
            name: 'Shatter Shot',
            tier: 4,
            type: 'ranged',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 11, vulnerable: { pct: 25, turns: 2 } }
        },
        {
            id: 432,
            name: 'Burning Rain',
            tier: 4,
            type: 'ranged',
            exhaust: false,
            targetType: 'all',
            affectedTargets: 'all',
            effects: { damage: 8, scorch: 4 }
        },
        {
            id: 433,
            name: 'Hemorrhage Arrow',
            tier: 4,
            type: 'ranged',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 10, bleed: 6 }
        },
        {
            id: 434,
            name: 'Death Mark',
            tier: 4,
            type: 'ranged',
            exhaust: true,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 14, vulnerable: { pct: 40, turns: 2 } }
        },
        {
            id: 435,
            name: 'Explosive Shot',
            tier: 4,
            type: 'ranged',
            exhaust: false,
            targetType: 'random',
            affectedTargets: 3,
            effects: { damage: 8, scorch: 3, backfire: 4 }
        },
        {
            id: 436,
            name: 'Predator Arrow',
            tier: 4,
            type: 'ranged',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 12, bleed: 4, extraPlays: 1, backfire: 5 }
        },
        {
            id: 437,
            name: 'Toxic Bolt',
            tier: 4,
            type: 'ranged',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 9, bleed: 5, scorch: 3 }
        },
        {
            id: 438,
            name: 'Longshot',
            tier: 4,
            type: 'ranged',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 15, backfire: 5 }
        },
        {
            id: 439,
            name: 'Feral Barrage',
            tier: 4,
            type: 'ranged',
            exhaust: true,
            targetType: 'random',
            affectedTargets: 4,
            effects: { damage: 7, bleed: 4, extraPlays: 1, backfire: 5 }
        },
        {
            id: 440,
            name: 'Wildfire Quiver',
            tier: 4,
            type: 'ranged',
            exhaust: false,
            targetType: 'all',
            affectedTargets: 'all',
            effects: { damage: 7, scorch: 4 }
        },

        // ── NEW T5 ranged ────────────────────────────────────────────────
        {
            id: 441,
            name: 'Nightmare Bolt',
            tier: 5,
            type: 'ranged',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 14, bleed: 6, scorch: 4 }
        },
        {
            id: 442,
            name: 'Inferno Hail',
            tier: 5,
            type: 'ranged',
            exhaust: false,
            targetType: 'all',
            affectedTargets: 'all',
            effects: { damage: 10, scorch: 5 }
        },
        {
            id: 443,
            name: 'Assassination',
            tier: 5,
            type: 'ranged',
            exhaust: true,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 22, bleed: 8, vulnerable: { pct: 30, turns: 2 } }
        },
        {
            id: 444,
            name: 'Bleed Storm',
            tier: 5,
            type: 'ranged',
            exhaust: false,
            targetType: 'random',
            affectedTargets: 4,
            effects: { damage: 7, bleed: 5, backfire: 5 }
        },
        {
            id: 445,
            name: 'Hellfire Quiver',
            tier: 5,
            type: 'ranged',
            exhaust: false,
            targetType: 'all',
            affectedTargets: 'all',
            effects: { damage: 9, scorch: 5, bleed: 3 }
        },
        {
            id: 446,
            name: 'Sentinel Strike',
            tier: 5,
            type: 'ranged',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 16, vulnerable: { pct: 30, turns: 2 }, backfire: 5 }
        },
        {
            id: 447,
            name: 'Scorch Barrage',
            tier: 5,
            type: 'ranged',
            exhaust: false,
            targetType: 'random',
            affectedTargets: 3,
            effects: { damage: 8, scorch: 6, backfire: 4 }
        },
        {
            id: 448,
            name: 'Venom Salvo',
            tier: 5,
            type: 'ranged',
            exhaust: false,
            targetType: 'all',
            affectedTargets: 'all',
            effects: { damage: 8, bleed: 5 }
        },
        {
            id: 449,
            name: 'Crimson Rain',
            tier: 5,
            type: 'ranged',
            exhaust: true,
            targetType: 'all',
            affectedTargets: 'all',
            effects: { damage: 14, bleed: 7, backfire: 8 }
        },
        {
            id: 450,
            name: 'Marked for Death',
            tier: 5,
            type: 'ranged',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 12, bleed: 5, extraPlays: 1, backfire: 6 }
        },

        // ── NEW T6 ranged ────────────────────────────────────────────────
        {
            id: 451,
            name: 'Omega Shot',
            tier: 6,
            type: 'ranged',
            exhaust: true,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 28, bleed: 8, scorch: 6, backfire: 10 }
        },
        {
            id: 452,
            name: 'Infernal Barrage',
            tier: 6,
            type: 'ranged',
            exhaust: false,
            targetType: 'random',
            affectedTargets: 4,
            effects: { damage: 11, scorch: 5, backfire: 6 }
        },
        {
            id: 453,
            name: 'Plague Arrow',
            tier: 6,
            type: 'ranged',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 15, bleed: 8, scorch: 4 }
        },
        {
            id: 454,
            name: 'Void Bolt',
            tier: 6,
            type: 'ranged',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 18, vulnerable: { pct: 30, turns: 2 }, backfire: 7 }
        },
        {
            id: 455,
            name: 'Slaughter Hail',
            tier: 6,
            type: 'ranged',
            exhaust: false,
            targetType: 'all',
            affectedTargets: 'all',
            effects: { damage: 13, bleed: 6 }
        },
        {
            id: 456,
            name: 'Hellstorm Arrow',
            tier: 6,
            type: 'ranged',
            exhaust: true,
            targetType: 'all',
            affectedTargets: 'all',
            effects: { damage: 18, scorch: 7, bleed: 5, backfire: 10 }
        },
        {
            id: 457,
            name: 'Death Sentence',
            tier: 6,
            type: 'ranged',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 16, bleed: 7, extraPlays: 1, backfire: 7 }
        },
        {
            id: 458,
            name: 'Apocalypse Arrow',
            tier: 6,
            type: 'ranged',
            exhaust: true,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 32, vulnerable: { pct: 40, turns: 3 }, backfire: 12 }
        },
        {
            id: 459,
            name: 'Eternal Bleed',
            tier: 6,
            type: 'ranged',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 14, bleed: 9, scorch: 3 }
        },
        {
            id: 460,
            name: 'Predator Instinct',
            tier: 6,
            type: 'ranged',
            exhaust: true,
            targetType: 'random',
            affectedTargets: 5,
            effects: { damage: 14, bleed: 6, scorch: 4, backfire: 11 }
        },

        // ── EXTRA: ranged deflect + multi-target ─────────────────────────
        {
            id: 461,
            name: 'Evasion Round',
            tier: 2,
            type: 'ranged',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { deflect: { pct: 8, turns: 2 }, block: 4 }
        },
        {
            id: 462,
            name: 'Scatter Shot',
            tier: 3,
            type: 'ranged',
            exhaust: false,
            targetType: 'all',
            affectedTargets: 'all',
            effects: { damage: 7, bleed: 2 }
        },
        {
            id: 463,
            name: 'Rain of Arrows',
            tier: 3,
            type: 'ranged',
            exhaust: false,
            targetType: 'random',
            affectedTargets: 5,
            effects: { damage: 5, bleed: 2 }
        },
        {
            id: 464,
            name: 'Counter Draw',
            tier: 3,
            type: 'ranged',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 5, deflect: { pct: 10, turns: 1 } }
        },
        {
            id: 465,
            name: 'Suppressive Fire',
            tier: 4,
            type: 'ranged',
            exhaust: false,
            targetType: 'all',
            affectedTargets: 'all',
            effects: { damage: 7, vulnerable: { pct: 15, turns: 1 } }
        },
        {
            id: 466,
            name: 'Hail of Death',
            tier: 4,
            type: 'ranged',
            exhaust: false,
            targetType: 'random',
            affectedTargets: 4,
            effects: { damage: 8, scorch: 3 }
        },
        {
            id: 467,
            name: 'Mirror Stance',
            tier: 4,
            type: 'ranged',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { deflect: { pct: 12, turns: 2 }, extraPlays: 1 }
        },
        {
            id: 468,
            name: 'Blaze Field',
            tier: 5,
            type: 'ranged',
            exhaust: false,
            targetType: 'all',
            affectedTargets: 'all',
            effects: { scorch: 5, damage: 5 }
        },
        {
            id: 469,
            name: 'Saturation Fire',
            tier: 5,
            type: 'ranged',
            exhaust: false,
            targetType: 'all',
            affectedTargets: 'all',
            effects: { damage: 9, backfire: 5 }
        },
        {
            id: 470,
            name: 'Deflection Screen',
            tier: 5,
            type: 'ranged',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { deflect: { pct: 15, turns: 2 }, block: 6 }
        },
        {
            id: 471,
            name: 'Piercing Volley',
            tier: 6,
            type: 'ranged',
            exhaust: false,
            targetType: 'random',
            affectedTargets: 5,
            effects: { damage: 8, bleed: 4 }
        },
        {
            id: 472,
            name: 'Hell Mirror',
            tier: 6,
            type: 'ranged',
            exhaust: true,
            targetType: 'self',
            affectedTargets: 1,
            effects: { deflect: { pct: 25, turns: 3 }, block: 8, extraPlays: 1 }
        },

        // ── T7 ranged — legendary, T6 equipment only (~10% per slot) ────
        {
            id: 711,
            name: 'Godshot Supremacy',
            tier: 7,
            type: 'ranged',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 25, vulnerable: { pct: 40, turns: 3 } }
        },
        {
            id: 712,
            name: 'Inferno Cascade',
            tier: 7,
            type: 'ranged',
            exhaust: false,
            targetType: 'all',
            affectedTargets: 'all',
            effects: { damage: 15, scorch: 8, bleed: 4 }
        },
        {
            id: 713,
            name: 'Death Rain',
            tier: 7,
            type: 'ranged',
            exhaust: false,
            targetType: 'random',
            affectedTargets: 5,
            effects: { damage: 12, bleed: 7 }
        },
        {
            id: 714,
            name: 'World Ender Volley',
            tier: 7,
            type: 'ranged',
            exhaust: true,
            targetType: 'all',
            affectedTargets: 'all',
            effects: { damage: 22, bleed: 8, scorch: 7, backfire: 12 }
        },
        {
            id: 715,
            name: 'Null Bolt',
            tier: 7,
            type: 'ranged',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 28, bleed: 6, scorch: 6, backfire: 9 }
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
            targetType: 'self',
            affectedTargets: 1,
            effects: { extraPlays: 1, strength: 1 }
        },
        {
            id: 122,
            name: 'Dented Think Cap',
            tier: 1,
            type: 'helmet',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { extraPlays: 1, backfire: 1 }
        },
        {
            id: 123,
            name: 'Squint',
            tier: 1,
            type: 'helmet',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { extraPlays: 1 }
        },
        {
            id: 124,
            name: 'Gut Feeling',
            tier: 1,
            type: 'helmet',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { extraPlays: 1, healing: 2 }
        },
        {
            id: 125,
            name: 'Headshake',
            tier: 1,
            type: 'helmet',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { extraPlays: 2, backfire: 5 }
        },
        {
            id: 126,
            name: 'Minor Recovery',
            tier: 1,
            type: 'helmet',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { healing: 2, regen: 1 }
        },
        {
            id: 127,
            name: 'Look Around',
            tier: 1,
            type: 'helmet',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { extraPlays: 1 }
        },
        {
            id: 128,
            name: 'Instinct',
            tier: 1,
            type: 'helmet',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { extraPlays: 1, strength: 2, backfire: 2 }
        },
        {
            id: 129,
            name: 'Foresight',
            tier: 1,
            type: 'helmet',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { extraPlays: 1, block: 2 }
        },
        {
            id: 130,
            name: 'Hyper Focus',
            tier: 1,
            type: 'helmet',
            exhaust: true,
            targetType: 'single',
            affectedTargets: 1,
            effects: { extraPlays: 1, strength: 2, vulnerable: { pct: 10, turns: 1 }, backfire: 3 }
        },

        // ── T2 ──────────────────────────────────────────────────────────
        {
            id: 131,
            name: 'Tactical Insight',
            tier: 2,
            type: 'helmet',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { extraPlays: 1 }
        },
        {
            id: 132,
            name: 'Cold Logic',
            tier: 2,
            type: 'helmet',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { extraPlays: 2, backfire: 6 }
        },
        {
            id: 133,
            name: 'Quick Thinking',
            tier: 2,
            type: 'helmet',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { extraPlays: 1 }
        },
        {
            id: 134,
            name: 'Mental Armor',
            tier: 2,
            type: 'helmet',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { block: 5, extraPlays: 1 }
        },
        {
            id: 135,
            name: 'Field Medic',
            tier: 2,
            type: 'helmet',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { healing: 4, regen: 3 }
        },
        {
            id: 136,
            name: 'Read the Room',
            tier: 2,
            type: 'helmet',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { extraPlays: 1, backfire: 2 }
        },
        {
            id: 137,
            name: 'Cool Head',
            tier: 2,
            type: 'helmet',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { extraPlays: 1, block: 3 }
        },
        {
            id: 138,
            name: 'Calculated Risk',
            tier: 2,
            type: 'helmet',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { extraPlays: 1, backfire: 2 }
        },
        {
            id: 139,
            name: 'Tactical Retreat',
            tier: 2,
            type: 'helmet',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { block: 6, extraPlays: 1 }
        },
        {
            id: 140,
            name: 'Brain Blast',
            tier: 2,
            type: 'helmet',
            exhaust: true,
            targetType: 'self',
            affectedTargets: 1,
            effects: { extraPlays: 1, strength: 3, backfire: 2 }
        },

        // ── T3 ──────────────────────────────────────────────────────────
        {
            id: 141,
            name: 'Battle Awareness',
            tier: 3,
            type: 'helmet',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { extraPlays: 1, strength: 3 }
        },
        {
            id: 142,
            name: 'Overclocked',
            tier: 3,
            type: 'helmet',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { extraPlays: 1, strength: 3, backfire: 3 }
        },
        {
            id: 143,
            name: 'Adrenaline',
            tier: 3,
            type: 'helmet',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { extraPlays: 2, backfire: 3 }
        },
        {
            id: 144,
            name: 'Meditate',
            tier: 3,
            type: 'helmet',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { healing: 4, regen: 4 }
        },
        {
            id: 145,
            name: 'Eye of the Storm',
            tier: 3,
            type: 'helmet',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { extraPlays: 1, block: 3 }
        },
        {
            id: 146,
            name: 'Think Fast',
            tier: 3,
            type: 'helmet',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { extraPlays: 1, backfire: 2 }
        },
        {
            id: 147,
            name: 'Adaptive Defense',
            tier: 3,
            type: 'helmet',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { block: 7, extraPlays: 1 }
        },
        {
            id: 148,
            name: 'Focused Healing',
            tier: 3,
            type: 'helmet',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { healing: 6, regen: 5 }
        },
        {
            id: 149,
            name: 'Cunning Plan',
            tier: 3,
            type: 'helmet',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { extraPlays: 1, healing: 6 }
        },
        {
            id: 150,
            name: 'Genius Mode',
            tier: 3,
            type: 'helmet',
            exhaust: true,
            targetType: 'self',
            affectedTargets: 1,
            effects: { extraPlays: 2, strength: 4 }
        },

        // ── T4 ──────────────────────────────────────────────────────────
        {
            id: 151,
            name: 'War Command',
            tier: 4,
            type: 'helmet',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { extraPlays: 1, strength: 1 }
        },
        {
            id: 152,
            name: 'Iron Discipline',
            tier: 4,
            type: 'helmet',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { extraPlays: 1, backfire: 2 }
        },
        {
            id: 153,
            name: 'Combat Clarity',
            tier: 4,
            type: 'helmet',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { extraPlays: 1, block: 4 }
        },
        {
            id: 154,
            name: 'Supreme Focus',
            tier: 4,
            type: 'helmet',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { extraPlays: 1, strength: 4 }
        },
        {
            id: 155,
            name: "Warlord's Mind",
            tier: 4,
            type: 'helmet',
            exhaust: true,
            targetType: 'self',
            affectedTargets: 1,
            effects: { extraPlays: 2, strength: 5 }
        },
        {
            id: 156,
            name: 'Flash of Brilliance',
            tier: 4,
            type: 'helmet',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { extraPlays: 2, backfire: 9 }
        },
        {
            id: 157,
            name: 'Steel Resolve',
            tier: 4,
            type: 'helmet',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { block: 7, extraPlays: 1 }
        },
        {
            id: 158,
            name: 'Trauma Response',
            tier: 4,
            type: 'helmet',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { healing: 8, regen: 5, extraPlays: 1 }
        },
        {
            id: 159,
            name: 'Warpath',
            tier: 4,
            type: 'helmet',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { extraPlays: 1, healing: 3, strength: 3, block: 3 }
        },
        {
            id: 160,
            name: 'Total Recall',
            tier: 4,
            type: 'helmet',
            exhaust: true,
            targetType: 'self',
            affectedTargets: 1,
            effects: { extraPlays: 1, regen: 4, block: 4 }
        },

        // ── T5 ──────────────────────────────────────────────────────────
        {
            id: 161,
            name: 'Strategist Crown',
            tier: 5,
            type: 'helmet',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { extraPlays: 1, healing: 2 }
        },
        {
            id: 162,
            name: 'Battlemind',
            tier: 5,
            type: 'helmet',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { extraPlays: 1, strength: 4 }
        },
        {
            id: 163,
            name: 'Zen State',
            tier: 5,
            type: 'helmet',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { extraPlays: 1, healing: 5, regen: 5 }
        },
        {
            id: 164,
            name: 'Legendary Grit',
            tier: 5,
            type: 'helmet',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { block: 10, extraPlays: 1, vulnerable: { pct: 20, turns: 2 } }
        },
        {
            id: 165,
            name: 'Hellbent',
            tier: 5,
            type: 'helmet',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { extraPlays: 1, strength: 3 }
        },
        {
            id: 166,
            name: 'Surge',
            tier: 5,
            type: 'helmet',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { extraPlays: 1, strength: 5, backfire: 5 }
        },
        {
            id: 167,
            name: 'Divine Clarity',
            tier: 5,
            type: 'helmet',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { extraPlays: 1, healing: 6, regen: 6 }
        },
        {
            id: 168,
            name: 'Overkill Strat',
            tier: 5,
            type: 'helmet',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { extraPlays: 1, strength: 4 }
        },
        {
            id: 169,
            name: 'Juggernaut Mind',
            tier: 5,
            type: 'helmet',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { extraPlays: 1, block: 10 }
        },
        {
            id: 170,
            name: 'Galaxy Brain',
            tier: 5,
            type: 'helmet',
            exhaust: true,
            targetType: 'self',
            affectedTargets: 1,
            effects: { extraPlays: 2, strength: 5, block: 5 }
        },

        // ── T6 ──────────────────────────────────────────────────────────
        {
            id: 171,
            name: 'Holy Trinity',
            tier: 6,
            type: 'helmet',
            exhaust: true,
            targetType: 'self',
            affectedTargets: 1,
            effects: { extraPlays: 3, healing: 3, block: 3 }
        },
        {
            id: 172,
            name: "God's Eye",
            tier: 6,
            type: 'helmet',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { extraPlays: 1, vulnerable: { pct: 15, turns: 2 } }
        },
        {
            id: 173,
            name: 'Infinite Thought',
            tier: 6,
            type: 'helmet',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { extraPlays: 1, healing: 6, regen: 6 }
        },
        {
            id: 174,
            name: 'Hell Commander',
            tier: 6,
            type: 'helmet',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { extraPlays: 1, strength: 5 }
        },
        {
            id: 175,
            name: 'Transcendence',
            tier: 6,
            type: 'helmet',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { extraPlays: 1, healing: 5, regen: 8 }
        },
        {
            id: 176,
            name: "Madman's Genius",
            tier: 6,
            type: 'helmet',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { extraPlays: 1, strength: 5, backfire: 6 }
        },
        {
            id: 177,
            name: 'Absolute Focus',
            tier: 6,
            type: 'helmet',
            exhaust: true,
            targetType: 'self',
            affectedTargets: 1,
            effects: { extraPlays: 3, strength: 6, healing: 12 }
        },
        {
            id: 178,
            name: 'Overvolt',
            tier: 6,
            type: 'helmet',
            exhaust: true,
            targetType: 'self',
            affectedTargets: 1,
            effects: { extraPlays: 4, backfire: 10 }
        },
        {
            id: 179,
            name: 'Demon Intellect',
            tier: 6,
            type: 'helmet',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { extraPlays: 1, strength: 3, healing: 5 }
        },
        {
            id: 180,
            name: 'Apocalypse Protocol',
            tier: 6,
            type: 'helmet',
            exhaust: true,
            targetType: 'single',
            affectedTargets: 1,
            effects: { extraPlays: 1, healing: 5, block: 5, bleed: 5 }
        },

        // ── NEW T1 helmet ────────────────────────────────────────────────
        {
            id: 501,
            name: 'Quick Study',
            tier: 1,
            type: 'helmet',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { extraPlays: 1 }
        },
        {
            id: 502,
            name: 'Fortify Mind',
            tier: 1,
            type: 'helmet',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { block: 3, strength: 1 }
        },
        {
            id: 503,
            name: 'Berserker Eye',
            tier: 1,
            type: 'helmet',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { strength: 2, backfire: 2 }
        },
        {
            id: 504,
            name: 'Regen Pulse',
            tier: 1,
            type: 'helmet',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { regen: 1 }
        },
        {
            id: 505,
            name: 'Keen Focus',
            tier: 1,
            type: 'helmet',
            exhaust: true,
            targetType: 'self',
            affectedTargets: 1,
            effects: { extraPlays: 2, block: 2 }
        },
        {
            id: 506,
            name: 'Headbutt',
            tier: 1,
            type: 'helmet',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 3, vulnerable: { pct: 10, turns: 1 } }
        },
        {
            id: 507,
            name: 'Battle Cry',
            tier: 1,
            type: 'helmet',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { strength: 1, extraPlays: 1, backfire: 1 }
        },
        {
            id: 508,
            name: 'Meditate',
            tier: 1,
            type: 'helmet',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { healing: 3, regen: 1 }
        },
        {
            id: 509,
            name: 'Reckless Vision',
            tier: 1,
            type: 'helmet',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { extraPlays: 1, backfire: 3 }
        },
        {
            id: 510,
            name: 'First Blood',
            tier: 1,
            type: 'helmet',
            exhaust: true,
            targetType: 'self',
            affectedTargets: 1,
            effects: { strength: 3, extraPlays: 1 }
        },

        // ── NEW T2 helmet ────────────────────────────────────────────────
        {
            id: 511,
            name: 'Tactical Mind',
            tier: 2,
            type: 'helmet',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { extraPlays: 1, strength: 2 }
        },
        {
            id: 512,
            name: 'Iron Will',
            tier: 2,
            type: 'helmet',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { block: 5, strength: 2 }
        },
        {
            id: 513,
            name: 'Blood Rage',
            tier: 2,
            type: 'helmet',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { strength: 3, backfire: 3 }
        },
        {
            id: 514,
            name: 'Vital Flow',
            tier: 2,
            type: 'helmet',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { regen: 2, healing: 3 }
        },
        {
            id: 515,
            name: 'Bleed Insight',
            tier: 2,
            type: 'helmet',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { bleed: 3, extraPlays: 1 }
        },
        {
            id: 516,
            name: 'Calculated Strike',
            tier: 2,
            type: 'helmet',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 5, vulnerable: { pct: 20, turns: 2 } }
        },
        {
            id: 517,
            name: 'Clarity',
            tier: 2,
            type: 'helmet',
            exhaust: true,
            targetType: 'self',
            affectedTargets: 1,
            effects: { extraPlays: 2, regen: 2 }
        },
        {
            id: 518,
            name: 'Phantom Steps',
            tier: 2,
            type: 'helmet',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { block: 4, extraPlays: 1 }
        },
        {
            id: 519,
            name: 'Predator Sense',
            tier: 2,
            type: 'helmet',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { strength: 2, extraPlays: 1, backfire: 2 }
        },
        {
            id: 520,
            name: 'Veteran Resolve',
            tier: 2,
            type: 'helmet',
            exhaust: true,
            targetType: 'self',
            affectedTargets: 1,
            effects: { strength: 4, healing: 5 }
        },

        // ── NEW T3 helmet ────────────────────────────────────────────────
        {
            id: 521,
            name: 'War Trance',
            tier: 3,
            type: 'helmet',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { strength: 4, extraPlays: 1, backfire: 4 }
        },
        {
            id: 522,
            name: 'Regenerative Focus',
            tier: 3,
            type: 'helmet',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { regen: 3, block: 4 }
        },
        {
            id: 523,
            name: 'Bleed Commander',
            tier: 3,
            type: 'helmet',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { bleed: 4, extraPlays: 1, damage: 4 }
        },
        {
            id: 524,
            name: 'Battle Trance',
            tier: 3,
            type: 'helmet',
            exhaust: true,
            targetType: 'self',
            affectedTargets: 1,
            effects: { extraPlays: 2, strength: 3 }
        },
        {
            id: 525,
            name: 'Expose All',
            tier: 3,
            type: 'helmet',
            exhaust: false,
            targetType: 'all',
            affectedTargets: 'all',
            effects: { vulnerable: { pct: 20, turns: 2 } }
        },
        {
            id: 526,
            name: 'Lifeflow',
            tier: 3,
            type: 'helmet',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { regen: 3, healing: 5 }
        },
        {
            id: 527,
            name: 'Mad Genius',
            tier: 3,
            type: 'helmet',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { strength: 3, extraPlays: 1, backfire: 4 }
        },
        {
            id: 528,
            name: 'Tactical Advantage',
            tier: 3,
            type: 'helmet',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { extraPlays: 1, block: 6, strength: 1 }
        },
        {
            id: 529,
            name: 'Death Focus',
            tier: 3,
            type: 'helmet',
            exhaust: true,
            targetType: 'self',
            affectedTargets: 1,
            effects: { strength: 5, extraPlays: 2, backfire: 6 }
        },
        {
            id: 530,
            name: 'Field Commander',
            tier: 3,
            type: 'helmet',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { strength: 4, regen: 2 }
        },

        // ── NEW T4 helmet ────────────────────────────────────────────────
        {
            id: 531,
            name: 'Bloodlust Vision',
            tier: 4,
            type: 'helmet',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { strength: 5, extraPlays: 1, backfire: 5 }
        },
        {
            id: 532,
            name: 'Soul Sight',
            tier: 4,
            type: 'helmet',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { vulnerable: { pct: 30, turns: 2 }, bleed: 3 }
        },
        {
            id: 533,
            name: 'Regen Mastery',
            tier: 4,
            type: 'helmet',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { regen: 4, healing: 6 }
        },
        {
            id: 534,
            name: 'Combat Surge',
            tier: 4,
            type: 'helmet',
            exhaust: true,
            targetType: 'self',
            affectedTargets: 1,
            effects: { extraPlays: 2, strength: 5, backfire: 6 }
        },
        {
            id: 535,
            name: 'Bleeding Oracle',
            tier: 4,
            type: 'helmet',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { bleed: 5, extraPlays: 1, damage: 5 }
        },
        {
            id: 536,
            name: 'Hell Trance',
            tier: 4,
            type: 'helmet',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { strength: 5, regen: 2, backfire: 5 }
        },
        {
            id: 537,
            name: 'Strategic Mind',
            tier: 4,
            type: 'helmet',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { extraPlays: 1, strength: 3, block: 5 }
        },
        {
            id: 538,
            name: 'Overwhelm',
            tier: 4,
            type: 'helmet',
            exhaust: false,
            targetType: 'all',
            affectedTargets: 'all',
            effects: { vulnerable: { pct: 25, turns: 2 }, bleed: 2 }
        },
        {
            id: 539,
            name: 'Phantom Sight',
            tier: 4,
            type: 'helmet',
            exhaust: true,
            targetType: 'self',
            affectedTargets: 1,
            effects: { extraPlays: 2, regen: 3, block: 6 }
        },
        {
            id: 540,
            name: 'Warlord Mind',
            tier: 4,
            type: 'helmet',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { strength: 5, extraPlays: 1, healing: 4, backfire: 6 }
        },

        // ── NEW T5 helmet ────────────────────────────────────────────────
        {
            id: 541,
            name: 'Infinite Rage',
            tier: 5,
            type: 'helmet',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { strength: 6, extraPlays: 1, backfire: 7 }
        },
        {
            id: 542,
            name: 'Lifestream',
            tier: 5,
            type: 'helmet',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { regen: 5, healing: 8 }
        },
        {
            id: 543,
            name: 'Bleed Frenzy Mind',
            tier: 5,
            type: 'helmet',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { bleed: 6, extraPlays: 1, damage: 6 }
        },
        {
            id: 544,
            name: 'Hellbound Focus',
            tier: 5,
            type: 'helmet',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { strength: 6, regen: 3, backfire: 6 }
        },
        {
            id: 545,
            name: 'Supreme Overload',
            tier: 5,
            type: 'helmet',
            exhaust: true,
            targetType: 'self',
            affectedTargets: 1,
            effects: { extraPlays: 3, strength: 5, backfire: 9 }
        },
        {
            id: 546,
            name: 'Predator Sight',
            tier: 5,
            type: 'helmet',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { vulnerable: { pct: 35, turns: 2 }, bleed: 4 }
        },
        {
            id: 547,
            name: 'Momentum Mind',
            tier: 5,
            type: 'helmet',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { strength: 5, extraPlays: 1, regen: 2, backfire: 6 }
        },
        {
            id: 548,
            name: 'Mass Expose',
            tier: 5,
            type: 'helmet',
            exhaust: false,
            targetType: 'all',
            affectedTargets: 'all',
            effects: { vulnerable: { pct: 30, turns: 2 } }
        },
        {
            id: 549,
            name: 'Wrath Engine',
            tier: 5,
            type: 'helmet',
            exhaust: true,
            targetType: 'self',
            affectedTargets: 1,
            effects: { strength: 7, extraPlays: 2, regen: 3 }
        },
        {
            id: 550,
            name: 'Bloodmind',
            tier: 5,
            type: 'helmet',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { strength: 6, extraPlays: 1, healing: 6, backfire: 8 }
        },

        // ── NEW T6 helmet ────────────────────────────────────────────────
        {
            id: 551,
            name: 'Godmind',
            tier: 6,
            type: 'helmet',
            exhaust: true,
            targetType: 'self',
            affectedTargets: 1,
            effects: { extraPlays: 3, strength: 7, regen: 4, backfire: 8 }
        },
        {
            id: 552,
            name: 'Undying Will',
            tier: 6,
            type: 'helmet',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { regen: 6, healing: 10, block: 5 }
        },
        {
            id: 553,
            name: 'Void Focus',
            tier: 6,
            type: 'helmet',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { strength: 7, extraPlays: 1, backfire: 8 }
        },
        {
            id: 554,
            name: 'Bleed Tyrant',
            tier: 6,
            type: 'helmet',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { bleed: 7, extraPlays: 1, damage: 7 }
        },
        {
            id: 555,
            name: 'Hellish Intellect',
            tier: 6,
            type: 'helmet',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { strength: 7, regen: 4, backfire: 7 }
        },
        {
            id: 556,
            name: 'Final Clarity',
            tier: 6,
            type: 'helmet',
            exhaust: true,
            targetType: 'self',
            affectedTargets: 1,
            effects: { extraPlays: 3, strength: 6, healing: 10 }
        },
        {
            id: 557,
            name: 'Doom Sight',
            tier: 6,
            type: 'helmet',
            exhaust: false,
            targetType: 'all',
            affectedTargets: 'all',
            effects: { vulnerable: { pct: 35, turns: 2 }, bleed: 4 }
        },
        {
            id: 558,
            name: 'Eternal Flow',
            tier: 6,
            type: 'helmet',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { regen: 6, strength: 5, extraPlays: 1, backfire: 7 }
        },
        {
            id: 559,
            name: 'Hell Emperor Mind',
            tier: 6,
            type: 'helmet',
            exhaust: true,
            targetType: 'self',
            affectedTargets: 1,
            effects: { strength: 9, extraPlays: 2, regen: 5, backfire: 10 }
        },
        {
            id: 560,
            name: 'Apocalypse Sight',
            tier: 6,
            type: 'helmet',
            exhaust: true,
            targetType: 'all',
            affectedTargets: 'all',
            effects: { vulnerable: { pct: 45, turns: 3 }, bleed: 5, extraPlays: 1 }
        },

        // ── EXTRA: helmet deflect cards ──────────────────────────────────
        {
            id: 561,
            name: 'Reactive Visor',
            tier: 2,
            type: 'helmet',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { deflect: { pct: 8, turns: 2 }, block: 4 }
        },
        {
            id: 562,
            name: 'Tactical Dodge',
            tier: 3,
            type: 'helmet',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { deflect: { pct: 10, turns: 1 }, extraPlays: 1 }
        },
        {
            id: 563,
            name: 'War Helm Aura',
            tier: 4,
            type: 'helmet',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { deflect: { pct: 12, turns: 2 }, strength: 3 }
        },
        {
            id: 564,
            name: 'Ghost Sight',
            tier: 5,
            type: 'helmet',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { deflect: { pct: 15, turns: 2 }, regen: 2 }
        },
        {
            id: 565,
            name: 'Warden Visor',
            tier: 5,
            type: 'helmet',
            exhaust: true,
            targetType: 'self',
            affectedTargets: 1,
            effects: { deflect: { pct: 22, turns: 3 }, extraPlays: 1, block: 8 }
        },
        {
            id: 566,
            name: 'Hell Sentinel Mind',
            tier: 6,
            type: 'helmet',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { deflect: { pct: 18, turns: 2 }, strength: 4, backfire: 5 }
        },
        {
            id: 567,
            name: 'Omega Visor',
            tier: 6,
            type: 'helmet',
            exhaust: true,
            targetType: 'self',
            affectedTargets: 1,
            effects: { deflect: { pct: 30, turns: 3 }, strength: 5, extraPlays: 1 }
        },

        // ── Helmet cleanse — removes bleed & scorch from the player ─────
        {
            id: 568,
            name: 'Clear Head',
            tier: 1,
            type: 'helmet',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { cleanse: true }
        },
        {
            id: 569,
            name: 'Focus',
            tier: 2,
            type: 'helmet',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { cleanse: true, extraPlays: 1 }
        },
        {
            id: 570,
            name: 'Mental Fortitude',
            tier: 3,
            type: 'helmet',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { cleanse: true, block: 6 }
        },
        {
            id: 571,
            name: 'Purge',
            tier: 4,
            type: 'helmet',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { cleanse: true, healing: 10 }
        },
        {
            id: 572,
            name: 'Transcendence',
            tier: 5,
            type: 'helmet',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { cleanse: true, block: 10, extraPlays: 1 }
        },
        {
            id: 573,
            name: 'Inner Clarity',
            tier: 6,
            type: 'helmet',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { cleanse: true, healing: 18, strength: 3 }
        },

        // ── T7 helmet — legendary, T6 equipment only (~10% per slot) ────
        {
            id: 721,
            name: 'Absolute Power',
            tier: 7,
            type: 'helmet',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { strength: 9, extraPlays: 1, backfire: 8 }
        },
        {
            id: 722,
            name: 'Eternal Mind',
            tier: 7,
            type: 'helmet',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { regen: 7, strength: 6, extraPlays: 1 }
        },
        {
            id: 723,
            name: 'Mass Doom',
            tier: 7,
            type: 'helmet',
            exhaust: false,
            targetType: 'all',
            affectedTargets: 'all',
            effects: { vulnerable: { pct: 45, turns: 3 }, bleed: 6 }
        },
        {
            id: 724,
            name: 'Apex Clarity',
            tier: 7,
            type: 'helmet',
            exhaust: true,
            targetType: 'self',
            affectedTargets: 1,
            effects: { extraPlays: 3, strength: 8, regen: 4 }
        },
        {
            id: 725,
            name: 'God Emperor Sight',
            tier: 7,
            type: 'helmet',
            exhaust: true,
            targetType: 'self',
            affectedTargets: 1,
            effects: { strength: 11, extraPlays: 2, regen: 6, backfire: 10 }
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
            targetType: 'self',
            affectedTargets: 1,
            effects: { healing: 3 }
        },
        {
            id: 182,
            name: 'Brace',
            tier: 1,
            type: 'armour',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { block: 3, healing: 1 }
        },
        {
            id: 183,
            name: 'Shrug It Off',
            tier: 1,
            type: 'armour',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { healing: 2, extraPlays: 1 }
        },
        {
            id: 184,
            name: 'Dented Shield',
            tier: 1,
            type: 'armour',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { block: 4 }
        },
        {
            id: 185,
            name: 'Grit',
            tier: 1,
            type: 'armour',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { healing: 2, block: 2 }
        },
        {
            id: 186,
            name: 'Clank',
            tier: 1,
            type: 'armour',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { block: 3, extraPlays: 1 }
        },
        {
            id: 187,
            name: 'Patch Up',
            tier: 1,
            type: 'armour',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { healing: 4 }
        },
        {
            id: 188,
            name: 'Stomp',
            tier: 1,
            type: 'armour',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 2, block: 3 }
        },
        {
            id: 189,
            name: 'Stubborn',
            tier: 1,
            type: 'armour',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { healing: 3 }
        },
        {
            id: 190,
            name: 'Emergency Patch',
            tier: 1,
            type: 'armour',
            exhaust: true,
            targetType: 'self',
            affectedTargets: 1,
            effects: { healing: 8, block: 3 }
        },

        // ── T2 ──────────────────────────────────────────────────────────
        {
            id: 191,
            name: 'Reinforced Plate',
            tier: 2,
            type: 'armour',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { block: 4, regen: 1 }
        },
        {
            id: 192,
            name: 'Iron Hide',
            tier: 2,
            type: 'armour',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { block: 6 }
        },
        {
            id: 193,
            name: 'Spiked Recoil',
            tier: 2,
            type: 'armour',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 3, block: 4 }
        },
        {
            id: 194,
            name: 'Tighten Straps',
            tier: 2,
            type: 'armour',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { healing: 4, block: 3 }
        },
        {
            id: 195,
            name: 'Endure',
            tier: 2,
            type: 'armour',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { healing: 6 }
        },
        {
            id: 196,
            name: 'Counter Brace',
            tier: 2,
            type: 'armour',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { block: 5, extraPlays: 1 }
        },
        {
            id: 197,
            name: 'Iron Mend',
            tier: 2,
            type: 'armour',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { healing: 5, damage: 2 }
        },
        {
            id: 198,
            name: 'Shell Up',
            tier: 2,
            type: 'armour',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { block: 7 }
        },
        {
            id: 199,
            name: 'Bolstered',
            tier: 2,
            type: 'armour',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { healing: 4, block: 4 }
        },
        {
            id: 200,
            name: 'Second Skin',
            tier: 2,
            type: 'armour',
            exhaust: true,
            targetType: 'self',
            affectedTargets: 1,
            effects: { healing: 10, block: 5, extraPlays: 1 }
        },

        // ── T3 ──────────────────────────────────────────────────────────
        {
            id: 201,
            name: 'Guard Stance',
            tier: 3,
            type: 'armour',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { healing: 6 }
        },
        {
            id: 202,
            name: 'Bulwark Bash',
            tier: 3,
            type: 'armour',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 5, block: 6 }
        },
        {
            id: 203,
            name: 'Pain Resistance',
            tier: 3,
            type: 'armour',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { healing: 7 }
        },
        {
            id: 204,
            name: 'Fortress',
            tier: 3,
            type: 'armour',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { block: 9, extraPlays: 1 }
        },
        {
            id: 205,
            name: 'Battle Mend',
            tier: 3,
            type: 'armour',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { healing: 6, damage: 3 }
        },
        {
            id: 206,
            name: 'Rebound',
            tier: 3,
            type: 'armour',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { block: 6, healing: 3, regen: 3 }
        },
        {
            id: 207,
            name: 'Teeth Gritted',
            tier: 3,
            type: 'armour',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { healing: 5, regen: 4 }
        },
        {
            id: 208,
            name: 'Juggernaut',
            tier: 3,
            type: 'armour',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { block: 8, damage: 4 }
        },
        {
            id: 209,
            name: 'Desperate Mend',
            tier: 3,
            type: 'armour',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { healing: 5, extraPlays: 1 }
        },
        {
            id: 210,
            name: 'Ironclad',
            tier: 3,
            type: 'armour',
            exhaust: true,
            targetType: 'single',
            affectedTargets: 1,
            effects: { healing: 12, block: 8, damage: 3 }
        },

        // ── T4 ──────────────────────────────────────────────────────────
        {
            id: 211,
            name: 'Iron Wall',
            tier: 4,
            type: 'armour',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { healing: 8 }
        },
        {
            id: 212,
            name: 'Resolute Defense',
            tier: 4,
            type: 'armour',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { block: 11, extraPlays: 1 }
        },
        {
            id: 213,
            name: 'Wrath Barrier',
            tier: 4,
            type: 'armour',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 6, block: 8 }
        },
        {
            id: 214,
            name: 'Deep Mend',
            tier: 4,
            type: 'armour',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { healing: 10, extraPlays: 1 }
        },
        {
            id: 215,
            name: 'Armor of Thorns',
            tier: 4,
            type: 'armour',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 5, block: 9, bleed: 2 }
        },
        {
            id: 216,
            name: 'Indomitable',
            tier: 4,
            type: 'armour',
            exhaust: true,
            targetType: 'self',
            affectedTargets: 1,
            effects: { healing: 6, block: 6, regen: 5 }
        },
        {
            id: 217,
            name: 'Heavy Mend',
            tier: 4,
            type: 'armour',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { healing: 11, damage: 4 }
        },
        {
            id: 218,
            name: 'Titanic Block',
            tier: 4,
            type: 'armour',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { block: 14 }
        },
        {
            id: 219,
            name: 'Undying',
            tier: 4,
            type: 'armour',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { healing: 8, extraPlays: 1 }
        },
        {
            id: 220,
            name: 'Unbreakable',
            tier: 4,
            type: 'armour',
            exhaust: true,
            targetType: 'self',
            affectedTargets: 1,
            effects: { healing: 16, block: 10, extraPlays: 1 }
        },

        // ── T5 ──────────────────────────────────────────────────────────
        {
            id: 221,
            name: 'Last Stand Armor',
            tier: 5,
            type: 'armour',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { healing: 11, damage: 3 }
        },
        {
            id: 222,
            name: 'Legendary Bulwark',
            tier: 5,
            type: 'armour',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { block: 15, extraPlays: 1 }
        },
        {
            id: 223,
            name: 'Pyrrhic Heal',
            tier: 5,
            type: 'armour',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { healing: 8, regen: 6 }
        },
        {
            id: 224,
            name: 'Demigod Skin',
            tier: 5,
            type: 'armour',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { block: 13, healing: 6 }
        },
        {
            id: 225,
            name: 'Spite Barrier',
            tier: 5,
            type: 'armour',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 8, block: 10, bleed: 3 }
        },
        {
            id: 226,
            name: 'Endurance Champion',
            tier: 5,
            type: 'armour',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { healing: 12, block: 7, extraPlays: 1 }
        },
        {
            id: 227,
            name: 'Gritted Teeth',
            tier: 5,
            type: 'armour',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { healing: 8, damage: 5, regen: 5 }
        },
        {
            id: 228,
            name: 'Siege Wall',
            tier: 5,
            type: 'armour',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { block: 16 }
        },
        {
            id: 229,
            name: 'Mending Roar',
            tier: 5,
            type: 'armour',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { healing: 10, extraPlays: 1 }
        },
        {
            id: 230,
            name: 'Defy Death',
            tier: 5,
            type: 'armour',
            exhaust: true,
            targetType: 'self',
            affectedTargets: 1,
            effects: { healing: 20, block: 12, extraPlays: 1 }
        },

        // ── T6 ──────────────────────────────────────────────────────────
        {
            id: 231,
            name: 'Immortal Bulwark',
            tier: 6,
            type: 'armour',
            exhaust: true,
            targetType: 'self',
            affectedTargets: 1,
            effects: { healing: 9, regen: 6, block: 9 }
        },
        {
            id: 232,
            name: 'Hellguard',
            tier: 6,
            type: 'armour',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { block: 16, healing: 7 }
        },
        {
            id: 233,
            name: 'Rebirth Plating',
            tier: 6,
            type: 'armour',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { healing: 14 }
        },
        {
            id: 234,
            name: 'Damnation Shell',
            tier: 6,
            type: 'armour',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 10, block: 16, bleed: 4 }
        },
        {
            id: 235,
            name: 'Unkillable',
            tier: 6,
            type: 'armour',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { healing: 12, block: 10, regen: 6 }
        },
        {
            id: 236,
            name: 'Colossus',
            tier: 6,
            type: 'armour',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { block: 17, damage: 7 }
        },
        {
            id: 237,
            name: 'Monument',
            tier: 6,
            type: 'armour',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { block: 13, healing: 9 }
        },
        {
            id: 238,
            name: 'Spite Incarnate',
            tier: 6,
            type: 'armour',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 12, block: 14, bleed: 5, healing: 6 }
        },
        {
            id: 239,
            name: 'Undying Legion',
            tier: 6,
            type: 'armour',
            exhaust: true,
            targetType: 'single',
            affectedTargets: 1,
            effects: { healing: 16, extraPlays: 1, block: 12, damage: 6 }
        },
        {
            id: 240,
            name: 'Invincible',
            tier: 6,
            type: 'armour',
            exhaust: true,
            targetType: 'self',
            affectedTargets: 1,
            effects: { block: 1000 }
        },

        // ── NEW T1 armour ────────────────────────────────────────────────
        {
            id: 601,
            name: 'Crude Plating',
            tier: 1,
            type: 'armour',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { block: 3 }
        },
        {
            id: 602,
            name: 'Thorn Shell',
            tier: 1,
            type: 'armour',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { deflect: { pct: 5, turns: 1 } }
        },
        {
            id: 603,
            name: 'First Aid',
            tier: 1,
            type: 'armour',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { healing: 4 }
        },
        {
            id: 604,
            name: 'Reactive Hide',
            tier: 1,
            type: 'armour',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { block: 2, deflect: { pct: 5, turns: 1 } }
        },
        {
            id: 605,
            name: 'Stone Skin',
            tier: 1,
            type: 'armour',
            exhaust: true,
            targetType: 'self',
            affectedTargets: 1,
            effects: { block: 10, deflect: { pct: 8, turns: 2 } }
        },
        {
            id: 606,
            name: 'Endure',
            tier: 1,
            type: 'armour',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { block: 4, healing: 2 }
        },
        {
            id: 607,
            name: 'Deflect Shard',
            tier: 1,
            type: 'armour',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { deflect: { pct: 6, turns: 2 } }
        },
        {
            id: 608,
            name: 'Regen Layer',
            tier: 1,
            type: 'armour',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { regen: 1, block: 2 }
        },
        {
            id: 609,
            name: 'Tough It Out',
            tier: 1,
            type: 'armour',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { block: 3, healing: 3 }
        },
        {
            id: 610,
            name: 'Iron Shell',
            tier: 1,
            type: 'armour',
            exhaust: true,
            targetType: 'self',
            affectedTargets: 1,
            effects: { block: 8, regen: 2 }
        },

        // ── NEW T2 armour ────────────────────────────────────────────────
        {
            id: 611,
            name: 'Bulwark',
            tier: 2,
            type: 'armour',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { block: 6, healing: 3 }
        },
        {
            id: 612,
            name: 'Mirror Plating',
            tier: 2,
            type: 'armour',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { deflect: { pct: 8, turns: 2 } }
        },
        {
            id: 613,
            name: 'Fortified Stance',
            tier: 2,
            type: 'armour',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { block: 7, deflect: { pct: 6, turns: 1 } }
        },
        {
            id: 614,
            name: 'Mending Plate',
            tier: 2,
            type: 'armour',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { healing: 7, regen: 1 }
        },
        {
            id: 615,
            name: 'Spined Armor',
            tier: 2,
            type: 'armour',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { deflect: { pct: 10, turns: 2 }, block: 3 }
        },
        {
            id: 616,
            name: 'Renewal',
            tier: 2,
            type: 'armour',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { regen: 2, healing: 4 }
        },
        {
            id: 617,
            name: 'Reactive Shell',
            tier: 2,
            type: 'armour',
            exhaust: true,
            targetType: 'self',
            affectedTargets: 1,
            effects: { block: 12, deflect: { pct: 12, turns: 2 } }
        },
        {
            id: 618,
            name: 'War Plate',
            tier: 2,
            type: 'armour',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { block: 8, strength: 1 }
        },
        {
            id: 619,
            name: 'Thorn Ward',
            tier: 2,
            type: 'armour',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { deflect: { pct: 9, turns: 2 }, healing: 3 }
        },
        {
            id: 620,
            name: 'Living Armor',
            tier: 2,
            type: 'armour',
            exhaust: true,
            targetType: 'self',
            affectedTargets: 1,
            effects: { regen: 3, block: 8, healing: 5 }
        },

        // ── NEW T3 armour ────────────────────────────────────────────────
        {
            id: 621,
            name: 'Retaliation Plate',
            tier: 3,
            type: 'armour',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { deflect: { pct: 12, turns: 2 }, block: 6 }
        },
        {
            id: 622,
            name: 'Ironclad',
            tier: 3,
            type: 'armour',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { block: 10, healing: 5 }
        },
        {
            id: 623,
            name: 'Regenerating Shell',
            tier: 3,
            type: 'armour',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { regen: 3, block: 6 }
        },
        {
            id: 624,
            name: 'Warden Stance',
            tier: 3,
            type: 'armour',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { block: 9, deflect: { pct: 10, turns: 2 } }
        },
        {
            id: 625,
            name: 'Soul Mending',
            tier: 3,
            type: 'armour',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { healing: 10, regen: 3 }
        },
        {
            id: 626,
            name: 'Thorn Fortress',
            tier: 3,
            type: 'armour',
            exhaust: true,
            targetType: 'self',
            affectedTargets: 1,
            effects: { deflect: { pct: 18, turns: 2 }, block: 12 }
        },
        {
            id: 627,
            name: 'Bastion',
            tier: 3,
            type: 'armour',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { block: 12, regen: 2 }
        },
        {
            id: 628,
            name: 'Resilience',
            tier: 3,
            type: 'armour',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { block: 8, healing: 6, deflect: { pct: 8, turns: 1 } }
        },
        {
            id: 629,
            name: 'Reactive Armor',
            tier: 3,
            type: 'armour',
            exhaust: true,
            targetType: 'self',
            affectedTargets: 1,
            effects: { block: 15, regen: 3, deflect: { pct: 12, turns: 2 } }
        },
        {
            id: 630,
            name: 'Hardened',
            tier: 3,
            type: 'armour',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { block: 11, strength: 2 }
        },

        // ── NEW T4 armour ────────────────────────────────────────────────
        {
            id: 631,
            name: 'Mirror Ward',
            tier: 4,
            type: 'armour',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { deflect: { pct: 15, turns: 2 }, block: 8 }
        },
        {
            id: 632,
            name: 'Juggernaut',
            tier: 4,
            type: 'armour',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { block: 14, healing: 7 }
        },
        {
            id: 633,
            name: 'Eternal Regen',
            tier: 4,
            type: 'armour',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { regen: 4, healing: 8 }
        },
        {
            id: 634,
            name: 'Thornmail',
            tier: 4,
            type: 'armour',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { deflect: { pct: 18, turns: 2 }, healing: 5 }
        },
        {
            id: 635,
            name: 'Unbreakable',
            tier: 4,
            type: 'armour',
            exhaust: true,
            targetType: 'self',
            affectedTargets: 1,
            effects: { block: 20, deflect: { pct: 15, turns: 2 }, regen: 3 }
        },
        {
            id: 636,
            name: 'Vital Barrier',
            tier: 4,
            type: 'armour',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { block: 12, healing: 8, deflect: { pct: 10, turns: 1 } }
        },
        {
            id: 637,
            name: 'War Fortress',
            tier: 4,
            type: 'armour',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { block: 13, strength: 3, deflect: { pct: 8, turns: 1 } }
        },
        {
            id: 638,
            name: 'Regen Fortress',
            tier: 4,
            type: 'armour',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { regen: 5, block: 9 }
        },
        {
            id: 639,
            name: 'Spiteful Armor',
            tier: 4,
            type: 'armour',
            exhaust: true,
            targetType: 'self',
            affectedTargets: 1,
            effects: { deflect: { pct: 22, turns: 3 }, block: 14 }
        },
        {
            id: 640,
            name: 'Titan Defense',
            tier: 4,
            type: 'armour',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { block: 15, regen: 3, healing: 6 }
        },

        // ── NEW T5 armour ────────────────────────────────────────────────
        {
            id: 641,
            name: 'Phantom Plate',
            tier: 5,
            type: 'armour',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { deflect: { pct: 20, turns: 2 }, block: 10 }
        },
        {
            id: 642,
            name: 'Colossus Guard',
            tier: 5,
            type: 'armour',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { block: 17, healing: 10 }
        },
        {
            id: 643,
            name: 'Vital Regen',
            tier: 5,
            type: 'armour',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { regen: 5, healing: 10 }
        },
        {
            id: 644,
            name: 'Retribution Shell',
            tier: 5,
            type: 'armour',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { deflect: { pct: 22, turns: 2 }, healing: 8 }
        },
        {
            id: 645,
            name: 'Dreadnought',
            tier: 5,
            type: 'armour',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { block: 18, deflect: { pct: 15, turns: 2 } }
        },
        {
            id: 646,
            name: 'Immortal Plate',
            tier: 5,
            type: 'armour',
            exhaust: true,
            targetType: 'self',
            affectedTargets: 1,
            effects: { block: 25, regen: 5, deflect: { pct: 20, turns: 2 } }
        },
        {
            id: 647,
            name: 'Blood Barrier',
            tier: 5,
            type: 'armour',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { block: 14, healing: 8, regen: 3 }
        },
        {
            id: 648,
            name: 'Spiked Fortress',
            tier: 5,
            type: 'armour',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { deflect: { pct: 20, turns: 3 }, block: 11 }
        },
        {
            id: 649,
            name: 'Hell Bulwark',
            tier: 5,
            type: 'armour',
            exhaust: true,
            targetType: 'self',
            affectedTargets: 1,
            effects: { block: 22, deflect: { pct: 25, turns: 2 }, healing: 10 }
        },
        {
            id: 650,
            name: 'Eternal Barrier',
            tier: 5,
            type: 'armour',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { regen: 5, block: 13, deflect: { pct: 12, turns: 2 } }
        },

        // ── NEW T6 armour ────────────────────────────────────────────────
        {
            id: 651,
            name: 'Mirror Colossus',
            tier: 6,
            type: 'armour',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { deflect: { pct: 25, turns: 2 }, block: 14 }
        },
        {
            id: 652,
            name: 'Undying Fortress',
            tier: 6,
            type: 'armour',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { block: 20, regen: 6, healing: 10 }
        },
        {
            id: 653,
            name: 'Hellfire Ward',
            tier: 6,
            type: 'armour',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { deflect: { pct: 28, turns: 2 }, healing: 10 }
        },
        {
            id: 654,
            name: 'Adamantine Shell',
            tier: 6,
            type: 'armour',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { block: 22, deflect: { pct: 18, turns: 3 } }
        },
        {
            id: 655,
            name: 'Eternal Reckoning',
            tier: 6,
            type: 'armour',
            exhaust: true,
            targetType: 'self',
            affectedTargets: 1,
            effects: { deflect: { pct: 40, turns: 3 }, block: 20, regen: 5 }
        },
        {
            id: 656,
            name: 'Godplate',
            tier: 6,
            type: 'armour',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { block: 22, healing: 12, deflect: { pct: 15, turns: 2 } }
        },
        {
            id: 657,
            name: 'Hell Retribution',
            tier: 6,
            type: 'armour',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { deflect: { pct: 30, turns: 2 }, block: 12, regen: 4 }
        },
        {
            id: 658,
            name: 'Immortal Fortress',
            tier: 6,
            type: 'armour',
            exhaust: true,
            targetType: 'self',
            affectedTargets: 1,
            effects: { block: 30, regen: 7, healing: 15 }
        },
        {
            id: 659,
            name: 'Void Plate',
            tier: 6,
            type: 'armour',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { block: 18, deflect: { pct: 25, turns: 3 }, regen: 4 }
        },
        {
            id: 660,
            name: 'Apocalypse Armor',
            tier: 6,
            type: 'armour',
            exhaust: true,
            targetType: 'self',
            affectedTargets: 1,
            effects: { block: 35, deflect: { pct: 35, turns: 3 }, regen: 6, healing: 14 }
        },

        // ── Armour cleanse — removes bleed & scorch from the player ─────
        {
            id: 661,
            name: 'Shake Off',
            tier: 1,
            type: 'armour',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { cleanse: true, block: 3 }
        },
        {
            id: 662,
            name: 'Brace',
            tier: 2,
            type: 'armour',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { cleanse: true, block: 7 }
        },
        {
            id: 663,
            name: 'Harden',
            tier: 3,
            type: 'armour',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { cleanse: true, block: 10, regen: 2 }
        },
        {
            id: 664,
            name: 'Endure',
            tier: 4,
            type: 'armour',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { cleanse: true, block: 14, healing: 8 }
        },
        {
            id: 665,
            name: 'Resilience',
            tier: 5,
            type: 'armour',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { cleanse: true, block: 18, regen: 4 }
        },
        {
            id: 666,
            name: 'Unbreakable',
            tier: 6,
            type: 'armour',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { cleanse: true, block: 24, healing: 14, regen: 6 }
        },

        // ── T7 armour — legendary, T6 equipment only (~10% per slot) ────
        {
            id: 731,
            name: 'Titan Shell',
            tier: 7,
            type: 'armour',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { block: 25, deflect: { pct: 30, turns: 3 } }
        },
        {
            id: 732,
            name: 'Undying God',
            tier: 7,
            type: 'armour',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { regen: 8, healing: 15, block: 15 }
        },
        {
            id: 733,
            name: 'Eternal Deflection',
            tier: 7,
            type: 'armour',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { deflect: { pct: 35, turns: 3 }, regen: 6, block: 12 }
        },
        {
            id: 734,
            name: 'Absolute Bulwark',
            tier: 7,
            type: 'armour',
            exhaust: true,
            targetType: 'self',
            affectedTargets: 1,
            effects: { block: 45, deflect: { pct: 45, turns: 3 }, regen: 8 }
        },
        {
            id: 735,
            name: 'Invincible Core',
            tier: 7,
            type: 'armour',
            exhaust: true,
            targetType: 'self',
            affectedTargets: 1,
            effects: { block: 40, regen: 9, healing: 20, deflect: { pct: 28, turns: 2 } }
        }
    ],

    cursed: [
        {
            id: 901,
            name: 'Hellpact',
            tier: 3,
            type: 'cursed',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 22, backfire: 15 }
        },
        {
            id: 902,
            name: 'Soul Sacrifice',
            tier: 4,
            type: 'cursed',
            exhaust: true,
            targetType: 'all',
            affectedTargets: 'all',
            effects: { damage: 25, backfire: 20 }
        },
        {
            id: 903,
            name: 'Blood Pact',
            tier: 4,
            type: 'cursed',
            exhaust: true,
            targetType: 'self',
            affectedTargets: 1,
            effects: { strength: 9, backfire: 22 }
        },
        {
            id: 904,
            name: 'Infernal Contract',
            tier: 3,
            type: 'cursed',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { extraPlays: 2, backfire: 11 }
        },
        {
            id: 905,
            name: 'Damnation Strike',
            tier: 4,
            type: 'cursed',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 20, bleed: 7, backfire: 14 }
        },
        {
            id: 906,
            name: 'Void Gamble',
            tier: 5,
            type: 'cursed',
            exhaust: true,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 35, backfire: 28 }
        },
        {
            id: 907,
            name: 'Sacrifice Play',
            tier: 5,
            type: 'cursed',
            exhaust: true,
            targetType: 'all',
            affectedTargets: 'all',
            effects: { damage: 18, strength: 4, backfire: 18 }
        },

        {
            id: 908,
            name: 'Black Mark',
            tier: 1,
            type: 'cursed',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { backfire: 10 }
        },
        {
            id: 909,
            name: 'Tainted Blow',
            tier: 1,
            type: 'cursed',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 2, backfire: 14 }
        },
        {
            id: 910,
            name: 'Cursed Reflex',
            tier: 1,
            type: 'cursed',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { backfire: 8 }
        },
        {
            id: 911,
            name: 'Hex Wound',
            tier: 2,
            type: 'cursed',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { backfire: 15 }
        },
        {
            id: 912,
            name: 'Void Drain',
            tier: 2,
            type: 'cursed',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { backfire: 12 }
        },

        {
            id: 913,
            name: 'Berserker Pact',
            tier: 5,
            type: 'cursed',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { strength: 7, extraPlays: 1, backfire: 18 }
        },
        {
            id: 914,
            name: 'Cursed Flurry',
            tier: 4,
            type: 'cursed',
            exhaust: false,
            targetType: 'random',
            affectedTargets: 4,
            effects: { damage: 12, bleed: 5, backfire: 18 }
        },
        {
            id: 915,
            name: 'Doom Volley',
            tier: 4,
            type: 'cursed',
            exhaust: true,
            targetType: 'all',
            affectedTargets: 'all',
            effects: { damage: 16, scorch: 5, backfire: 22 }
        },
        {
            id: 916,
            name: 'Forbidden Strength',
            tier: 6,
            type: 'cursed',
            exhaust: true,
            targetType: 'self',
            affectedTargets: 1,
            effects: { strength: 12, extraPlays: 2, backfire: 30 }
        },
        {
            id: 917,
            name: 'Hell Roulette',
            tier: 5,
            type: 'cursed',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 18, vulnerable: { pct: 35, turns: 2 }, backfire: 20 }
        },

        {
            id: 918,
            name: 'Ruinous Step',
            tier: 2,
            type: 'cursed',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { backfire: 14 }
        },
        {
            id: 919,
            name: 'Cursed Whisper',
            tier: 1,
            type: 'cursed',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { backfire: 9 }
        },
        {
            id: 920,
            name: 'Hollow Strike',
            tier: 1,
            type: 'cursed',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 1, backfire: 16 }
        },
        {
            id: 921,
            name: 'Marked',
            tier: 3,
            type: 'cursed',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { backfire: 17 }
        },

        {
            id: 922,
            name: 'Wretched Touch',
            tier: 1,
            type: 'cursed',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { backfire: 11 }
        },
        {
            id: 923,
            name: 'Blight Grasp',
            tier: 1,
            type: 'cursed',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { backfire: 13 }
        },
        {
            id: 924,
            name: 'Doom Brand',
            tier: 2,
            type: 'cursed',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { backfire: 16 }
        },
        {
            id: 925,
            name: 'Spectral Leech',
            tier: 1,
            type: 'cursed',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 1, backfire: 15 }
        },
        {
            id: 926,
            name: 'Cursed Burden',
            tier: 1,
            type: 'cursed',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { backfire: 12 }
        },
        {
            id: 927,
            name: 'Hex Pulse',
            tier: 1,
            type: 'cursed',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { backfire: 10 }
        },
        {
            id: 928,
            name: 'Vile Scar',
            tier: 2,
            type: 'cursed',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { backfire: 14 }
        },
        {
            id: 929,
            name: 'Rot Touch',
            tier: 2,
            type: 'cursed',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 2, backfire: 18 }
        },
        {
            id: 930,
            name: 'Tainted Pulse',
            tier: 1,
            type: 'cursed',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { backfire: 9 }
        },
        {
            id: 931,
            name: 'Forsaken Strike',
            tier: 2,
            type: 'cursed',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 3, backfire: 20 }
        },
        {
            id: 932,
            name: 'Cursed Ache',
            tier: 1,
            type: 'cursed',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { backfire: 8 }
        },
        {
            id: 933,
            name: 'Withered Blow',
            tier: 1,
            type: 'cursed',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 1, backfire: 12 }
        },
        {
            id: 934,
            name: 'Shadow Sting',
            tier: 1,
            type: 'cursed',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { backfire: 11 }
        },
        {
            id: 935,
            name: 'Foul Brand',
            tier: 2,
            type: 'cursed',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { backfire: 15 }
        },
        {
            id: 936,
            name: 'Hex Lash',
            tier: 2,
            type: 'cursed',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 2, backfire: 17 }
        },
        {
            id: 937,
            name: 'Plagued Touch',
            tier: 1,
            type: 'cursed',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { backfire: 10 }
        },
        {
            id: 938,
            name: 'Cursed Miasma',
            tier: 1,
            type: 'cursed',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { backfire: 13 }
        },
        {
            id: 939,
            name: 'Wretched Blow',
            tier: 1,
            type: 'cursed',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 1, backfire: 14 }
        },
        {
            id: 940,
            name: 'Dark Fumble',
            tier: 1,
            type: 'cursed',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { backfire: 12 }
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

    const maxTier = tier === 6 ? 7 : 6;
    const minTier = 1;

    function rollCardTier() {
        const roll = Math.random();
        // T6 equipment: 10% chance per slot to draw a legendary T7 card
        if (tier === 6) {
            if (roll < 0.1) return 7;
            if (roll < 0.25) return 5; // 15% T5
            return 6; // 75% T6
        }
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

const CARDS_PER_TURN = 5;

// Build a shuffled draw-pile from the four equipped item card arrays.
// equipmentSnapshot must have melee_cards, ranged_cards, helmet_cards, armor_cards arrays.
function buildDeckFromEquipment(equipmentSnapshot) {
    const cards = [
        ...(equipmentSnapshot.melee_cards || []),
        ...(equipmentSnapshot.ranged_cards || []),
        ...(equipmentSnapshot.helmet_cards || []),
        ...(equipmentSnapshot.armor_cards || [])
    ];
    for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    return cards;
}

module.exports = {
    CARD_POOL,
    CARDS_PER_TURN,
    getCardById,
    pickCardsForItem,
    buildDeckFromEquipment
};
