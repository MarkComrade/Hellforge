const CARD_POOL = {
    // ═══════════════════════════════════════════════════════════════════
    // MELEE — up-close violence, bleed stacking, self-damage gambles
    // ═══════════════════════════════════════════════════════════════════
    melee: [
        // ── T1 ──────────────────────────────────────────────────────────
        {
            id: 1,
            name: 'Rusty Slash',
            img_path: '/textures/cards/rusty_slash.png',
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
            img_path: '/textures/cards/poke.png',
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
            img_path: '/textures/cards/wild_swing.png',
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
            img_path: '/textures/cards/headbutt.png',
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
            img_path: '/textures/cards/ankle_biter.png',
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
            img_path: '/textures/cards/guard.png',
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
            img_path: '/textures/cards/taunt.png',
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
            img_path: '/textures/cards/cheap_shot.png',
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
            img_path: '/textures/cards/desperate_lunge.png',
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
            img_path: '/textures/cards/trip.png',
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
            img_path: '/textures/cards/reckless_strike.png',
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
            img_path: '/textures/cards/pommel_smash.png',
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
            img_path: '/textures/cards/gut_punch.png',
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
            img_path: '/textures/cards/counter_slash.png',
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
            img_path: '/textures/cards/shoulder_charge.png',
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
            img_path: '/textures/cards/warcry.png',
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
            img_path: '/textures/cards/sweeping_blow.png',
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
            img_path: '/textures/cards/parry.png',
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
            img_path: '/textures/cards/gash.png',
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
            img_path: '/textures/cards/bloodlust.png',
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
            img_path: '/textures/cards/blood_cutter.png',
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
            img_path: '/textures/cards/hamstring.png',
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
            img_path: '/textures/cards/battle_trance.png',
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
            img_path: '/textures/cards/riposte.png',
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
            img_path: '/textures/cards/cleave.png',
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
            img_path: '/textures/cards/jugular_slice.png',
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
            img_path: '/textures/cards/second_wind.png',
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
            img_path: '/textures/cards/whirlwind.png',
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
            img_path: '/textures/cards/steel_nerve.png',
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
            img_path: '/textures/cards/feral_ambush.png',
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
            img_path: '/textures/cards/savage_combo.png',
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
            img_path: '/textures/cards/artery_burst.png',
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
            img_path: '/textures/cards/iron_rend.png',
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
            img_path: '/textures/cards/death_march.png',
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
            img_path: '/textures/cards/mamas_chili_oil.png',
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
            img_path: '/textures/cards/bonecrusher.png',
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
            img_path: '/textures/cards/rally.png',
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
            img_path: '/textures/cards/gut_rip.png',
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
            img_path: '/textures/cards/fortress_stance.png',
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
            img_path: '/textures/cards/carnage.png',
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
            img_path: '/textures/cards/executioners_rush.png',
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
            img_path: '/textures/cards/hemorrhage.png',
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
            img_path: '/textures/cards/skull_splitter.png',
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
            img_path: '/textures/cards/death_rattle.png',
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
            img_path: '/textures/cards/warlord_smash.png',
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
            img_path: '/textures/cards/crimson_dash.png',
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
            img_path: '/textures/cards/pain_is_power.png',
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
            img_path: '/textures/cards/titan_grip.png',
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
            img_path: '/textures/cards/bloodbath.png',
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
            img_path: '/textures/cards/reapers_toll.png',
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
            img_path: '/textures/cards/doom_blade_frenzy.png',
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
            img_path: '/textures/cards/obliterate.png',
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
            img_path: '/textures/cards/hell_cleave.png',
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
            img_path: '/textures/cards/demon_rend.png',
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
            img_path: '/textures/cards/undying_rage.png',
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
            img_path: '/textures/cards/soulripper.png',
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
            img_path: '/textures/cards/deaths_embrace.png',
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
            img_path: '/textures/cards/godsplitter.png',
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
            img_path: '/textures/cards/infernal_combo.png',
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
            img_path: '/textures/cards/final_rampage.png',
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
            img_path: '/textures/cards/wild_swing.png',
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
            img_path: '/textures/cards/shield_bash.png',
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
            img_path: '/textures/cards/aggressive_stance.png',
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
            img_path: '/textures/cards/lacerate.png',
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
            img_path: '/textures/cards/desperation_strike.png',
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
            img_path: '/textures/cards/stomp.png',
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
            img_path: '/textures/cards/chip_away.png',
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
            img_path: '/textures/cards/iron_resolve.png',
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
            img_path: '/textures/cards/blood_offering.png',
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
            img_path: '/textures/cards/fury_burst.png',
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
            img_path: '/textures/cards/reckless_charge.png',
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
            img_path: '/textures/cards/warlord_step.png',
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
            img_path: '/textures/cards/gore_wound.png',
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
            img_path: '/textures/cards/lifetap.png',
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
            img_path: '/textures/cards/momentum.png',
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
            img_path: '/textures/cards/hamstring.png',
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
            img_path: '/textures/cards/burning_strike.png',
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
            img_path: '/textures/cards/bleed_through.png',
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
            img_path: '/textures/cards/parry_and_riposte.png',
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
            img_path: '/textures/cards/bloodlust_stance.png',
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
            img_path: '/textures/cards/blade_storm.png',
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
            img_path: '/textures/cards/wrath.png',
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
            img_path: '/textures/cards/deep_cut.png',
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
            img_path: '/textures/cards/siphon_strike.png',
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
            img_path: '/textures/cards/expose_weakness.png',
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
            img_path: '/textures/cards/inferno_blade.png',
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
            img_path: '/textures/cards/relentless.png',
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
            img_path: '/textures/cards/flurry_of_blows.png',
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
            img_path: '/textures/cards/stance_break.png',
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
            img_path: '/textures/cards/vampiric_rush.png',
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
            img_path: '/textures/cards/blood_frenzy.png',
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
            img_path: '/textures/cards/titan_strike.png',
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
            img_path: '/textures/cards/scorched_flesh.png',
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
            img_path: '/textures/cards/power_surge.png',
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
            img_path: '/textures/cards/sanguine_blade.png',
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
            img_path: '/textures/cards/guillotine.png',
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
            img_path: '/textures/cards/whirlwind.png',
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
            img_path: '/textures/cards/soul_carve.png',
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
            img_path: '/textures/cards/wrath_of_steel.png',
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
            img_path: '/textures/cards/predator_lunge.png',
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
            img_path: '/textures/cards/crimson_cyclone.png',
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
            img_path: '/textures/cards/hemorrhage.png',
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
            img_path: '/textures/cards/cursed_blade.png',
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
            img_path: '/textures/cards/war_machine.png',
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
            img_path: '/textures/cards/executioner.png',
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
            img_path: '/textures/cards/dread_cleave.png',
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
            img_path: '/textures/cards/eternal_thirst.png',
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
            img_path: '/textures/cards/magma_blade.png',
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
            img_path: '/textures/cards/killing_intent.png',
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
            img_path: '/textures/cards/butcher.png',
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
            img_path: '/textures/cards/ragnarok.png',
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
            img_path: '/textures/cards/void_cleave.png',
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
            img_path: '/textures/cards/soul_harvest_melee.png',
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
            img_path: '/textures/cards/eternal_wrath.png',
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
            img_path: '/textures/cards/hell_cutter.png',
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
            img_path: '/textures/cards/armageddon_blade.png',
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
            img_path: '/textures/cards/doomsday_cleave.png',
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
            img_path: '/textures/cards/bloodborn_frenzy.png',
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
            img_path: '/textures/cards/infernal_champion.png',
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
            img_path: '/textures/cards/carnage.png',
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
            img_path: '/textures/cards/blade_wall.png',
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
            img_path: '/textures/cards/counter_cleave.png',
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
            img_path: '/textures/cards/savage_whirl.png',
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
            img_path: '/textures/cards/stampede.png',
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
            img_path: '/textures/cards/iron_counter.png',
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
            img_path: '/textures/cards/carnage_wave.png',
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
            img_path: '/textures/cards/reaping_strike.png',
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
            img_path: '/textures/cards/ground_slam.png',
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
            img_path: '/textures/cards/reflective_guard.png',
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
            img_path: '/textures/cards/bleed_everything.png',
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
            img_path: '/textures/cards/mirror_stance_melee.png',
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
            img_path: '/textures/cards/mass_execution.png',
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
            img_path: '/textures/cards/god_slayer.png',
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
            img_path: '/textures/cards/eternal_carnage.png',
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
            img_path: '/textures/cards/apocalyptic_blade.png',
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
            img_path: '/textures/cards/void_rend.png',
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
            img_path: '/textures/cards/omega_cleave.png',
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
            img_path: '/textures/cards/quick_shot.png',
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
            img_path: '/textures/cards/pebble_toss.png',
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
            img_path: '/textures/cards/wobbling_arrow.png',
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
            img_path: '/textures/cards/scratch_shot.png',
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
            img_path: '/textures/cards/duck_and_fire.png',
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
            img_path: '/textures/cards/nock_and_think.png',
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
            img_path: '/textures/cards/close_quarters_shot.png',
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
            img_path: '/textures/cards/kneecap_shot.png',
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
            img_path: '/textures/cards/loose_bolt.png',
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
            img_path: '/textures/cards/opening_salvo.png',
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
            img_path: '/textures/cards/piercing_arrow.png',
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
            img_path: '/textures/cards/crippling_shot.png',
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
            img_path: '/textures/cards/fan_of_knives.png',
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
            img_path: '/textures/cards/calculated_aim.png',
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
            img_path: '/textures/cards/smoke_and_shoot.png',
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
            img_path: '/textures/cards/scatter_shot.png',
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
            img_path: '/textures/cards/backpedal.png',
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
            img_path: '/textures/cards/poisoned_tip.png',
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
            img_path: '/textures/cards/double_tap.png',
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
            img_path: '/textures/cards/aimed_burst.png',
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
            img_path: '/textures/cards/trick_shot.png',
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
            img_path: '/textures/cards/hunters_mark.png',
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
            img_path: '/textures/cards/evasive_shot.png',
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
            img_path: '/textures/cards/burst_fire.png',
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
            img_path: '/textures/cards/bleeding_shaft.png',
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
            img_path: '/textures/cards/redirect.png',
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
            img_path: '/textures/cards/serrated_bolt.png',
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
            img_path: '/textures/cards/shadow_step.png',
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
            img_path: '/textures/cards/overcharge.png',
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
            img_path: '/textures/cards/deadeye.png',
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
            img_path: '/textures/cards/volley.png',
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
            img_path: '/textures/cards/hail_shot.png',
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
            img_path: '/textures/cards/ricochet.png',
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
            img_path: '/textures/cards/incendiary_arrow.png',
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
            img_path: '/textures/cards/covering_fire.png',
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
            img_path: '/textures/cards/rapid_draw.png',
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
            img_path: '/textures/cards/piercing_volley.png',
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
            img_path: '/textures/cards/disarm_shot.png',
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
            img_path: '/textures/cards/needle_rain.png',
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
            img_path: '/textures/cards/snipers_gambit.png',
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
            img_path: '/textures/cards/sniper_focus.png',
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
            img_path: '/textures/cards/heartseeker.png',
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
            img_path: '/textures/cards/arrow_storm.png',
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
            img_path: '/textures/cards/ghost_bolt.png',
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
            img_path: '/textures/cards/barbed_salvo.png',
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
            img_path: '/textures/cards/lethal_aim.png',
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
            img_path: '/textures/cards/retreating_volley.png',
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
            img_path: '/textures/cards/blinding_shot.png',
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
            img_path: '/textures/cards/phantom_arrow.png',
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
            img_path: '/textures/cards/thousand_cuts.png',
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
            img_path: '/textures/cards/rain_of_arrows.png',
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
            img_path: '/textures/cards/godshot.png',
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
            img_path: '/textures/cards/hell_volley.png',
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
            img_path: '/textures/cards/doomsday_arrow.png',
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
            img_path: '/textures/cards/infinite_quiver.png',
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
            img_path: '/textures/cards/soulpiercer.png',
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
            img_path: '/textures/cards/entropy_bolt.png',
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
            img_path: '/textures/cards/marksmans_doom.png',
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
            img_path: '/textures/cards/rapid_hellfire.png',
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
            img_path: '/textures/cards/oblivion_barrage.png',
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
            img_path: '/textures/cards/piercing_arrow.png',
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
            img_path: '/textures/cards/steady_aim.png',
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
            img_path: '/textures/cards/grazed_shot.png',
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
            img_path: '/textures/cards/smoke_arrow.png',
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
            img_path: '/textures/cards/aimed_shot.png',
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
            img_path: '/textures/cards/skirmish.png',
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
            img_path: '/textures/cards/flame_arrow.png',
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
            img_path: '/textures/cards/hunter_step.png',
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
            img_path: '/textures/cards/barbed_shaft.png',
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
            img_path: '/textures/cards/surprise_volley.png',
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
            img_path: '/textures/cards/leg_shot.png',
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
            img_path: '/textures/cards/incendiary_bolt.png',
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
            img_path: '/textures/cards/bleeding_flechette.png',
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
            img_path: '/textures/cards/hawk_eye.png',
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
            img_path: '/textures/cards/crippling_arrow.png',
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
            img_path: '/textures/cards/rapid_fire.png',
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
            img_path: '/textures/cards/smoke_screen.png',
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
            img_path: '/textures/cards/ember_bolt.png',
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
            img_path: '/textures/cards/twin_shot.png',
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
            img_path: '/textures/cards/ambush.png',
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
            img_path: '/textures/cards/scorched_earth.png',
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
            img_path: '/textures/cards/blood_arrow.png',
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
            img_path: '/textures/cards/sniper_focus.png',
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
            img_path: '/textures/cards/tracking_shot.png',
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
            img_path: '/textures/cards/fire_volley.png',
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
            img_path: '/textures/cards/ricochet.png',
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
            img_path: '/textures/cards/debilitating_arrow.png',
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
            img_path: '/textures/cards/hell_shot.png',
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
            img_path: '/textures/cards/storm_of_bolts.png',
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
            img_path: '/textures/cards/viper_round.png',
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
            img_path: '/textures/cards/shatter_shot.png',
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
            img_path: '/textures/cards/burning_rain.png',
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
            img_path: '/textures/cards/hemorrhage_arrow.png',
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
            img_path: '/textures/cards/death_mark.png',
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
            img_path: '/textures/cards/explosive_shot.png',
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
            img_path: '/textures/cards/predator_arrow.png',
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
            img_path: '/textures/cards/toxic_bolt.png',
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
            img_path: '/textures/cards/longshot.png',
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
            img_path: '/textures/cards/feral_barrage.png',
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
            img_path: '/textures/cards/wildfire_quiver.png',
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
            img_path: '/textures/cards/nightmare_bolt.png',
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
            img_path: '/textures/cards/inferno_hail.png',
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
            img_path: '/textures/cards/assassination.png',
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
            img_path: '/textures/cards/bleed_storm.png',
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
            img_path: '/textures/cards/hellfire_quiver.png',
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
            img_path: '/textures/cards/sentinel_strike.png',
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
            img_path: '/textures/cards/scorch_barrage.png',
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
            img_path: '/textures/cards/venom_salvo.png',
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
            img_path: '/textures/cards/crimson_rain.png',
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
            img_path: '/textures/cards/marked_for_death.png',
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
            img_path: '/textures/cards/omega_shot.png',
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
            img_path: '/textures/cards/infernal_barrage.png',
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
            img_path: '/textures/cards/plague_arrow.png',
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
            img_path: '/textures/cards/void_bolt.png',
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
            img_path: '/textures/cards/slaughter_hail.png',
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
            img_path: '/textures/cards/hellstorm_arrow.png',
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
            img_path: '/textures/cards/death_sentence.png',
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
            img_path: '/textures/cards/apocalypse_arrow.png',
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
            img_path: '/textures/cards/eternal_bleed.png',
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
            img_path: '/textures/cards/predator_instinct.png',
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
            img_path: '/textures/cards/evasion_round.png',
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
            img_path: '/textures/cards/scatter_shot.png',
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
            img_path: '/textures/cards/rain_of_arrows.png',
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
            img_path: '/textures/cards/counter_draw.png',
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
            img_path: '/textures/cards/suppressive_fire.png',
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
            img_path: '/textures/cards/hail_of_death.png',
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
            img_path: '/textures/cards/mirror_stance_ranged.png',
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
            img_path: '/textures/cards/blaze_field.png',
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
            img_path: '/textures/cards/saturation_fire.png',
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
            img_path: '/textures/cards/deflection_screen.png',
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
            img_path: '/textures/cards/piercing_volley.png',
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
            img_path: '/textures/cards/hell_mirror.png',
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
            img_path: '/textures/cards/godshot_supremacy.png',
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
            img_path: '/textures/cards/inferno_cascade.png',
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
            img_path: '/textures/cards/death_rain.png',
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
            img_path: '/textures/cards/world_ender_volley.png',
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
            img_path: '/textures/cards/null_bolt.png',
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
            img_path: '/textures/cards/focus_visor.png',
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
            img_path: '/textures/cards/dented_think_cap.png',
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
            img_path: '/textures/cards/squint.png',
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
            img_path: '/textures/cards/gut_feeling.png',
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
            img_path: '/textures/cards/headshake.png',
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
            img_path: '/textures/cards/minor_recovery.png',
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
            img_path: '/textures/cards/look_around.png',
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
            img_path: '/textures/cards/instinct.png',
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
            img_path: '/textures/cards/foresight.png',
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
            img_path: '/textures/cards/hyper_focus.png',
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
            img_path: '/textures/cards/tactical_insight.png',
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
            img_path: '/textures/cards/cold_logic.png',
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
            img_path: '/textures/cards/quick_thinking.png',
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
            img_path: '/textures/cards/mental_armor.png',
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
            img_path: '/textures/cards/field_medic.png',
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
            img_path: '/textures/cards/read_the_room.png',
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
            img_path: '/textures/cards/cool_head.png',
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
            img_path: '/textures/cards/calculated_risk.png',
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
            img_path: '/textures/cards/tactical_retreat.png',
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
            img_path: '/textures/cards/brain_blast.png',
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
            img_path: '/textures/cards/battle_awareness.png',
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
            img_path: '/textures/cards/overclocked.png',
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
            img_path: '/textures/cards/adrenaline.png',
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
            img_path: '/textures/cards/meditate.png',
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
            img_path: '/textures/cards/eye_of_the_storm.png',
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
            img_path: '/textures/cards/think_fast.png',
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
            img_path: '/textures/cards/adaptive_defense.png',
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
            img_path: '/textures/cards/focused_healing.png',
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
            img_path: '/textures/cards/cunning_plan.png',
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
            img_path: '/textures/cards/genius_mode.png',
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
            img_path: '/textures/cards/war_command.png',
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
            img_path: '/textures/cards/iron_discipline.png',
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
            img_path: '/textures/cards/combat_clarity.png',
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
            img_path: '/textures/cards/supreme_focus.png',
            tier: 4,
            type: 'helmet',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { extraPlays: 1 }
        },
        {
            id: 155,
            name: "Warlord's Mind",
            img_path: '/textures/cards/warlords_mind.png',
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
            img_path: '/textures/cards/flash_of_brilliance.png',
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
            img_path: '/textures/cards/steel_resolve.png',
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
            img_path: '/textures/cards/trauma_response.png',
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
            img_path: '/textures/cards/warpath.png',
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
            img_path: '/textures/cards/total_recall.png',
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
            img_path: '/textures/cards/strategist_crown.png',
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
            img_path: '/textures/cards/battlemind.png',
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
            img_path: '/textures/cards/zen_state.png',
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
            img_path: '/textures/cards/legendary_grit.png',
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
            img_path: '/textures/cards/hellbent.png',
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
            img_path: '/textures/cards/surge.png',
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
            img_path: '/textures/cards/divine_clarity.png',
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
            img_path: '/textures/cards/overkill_strat.png',
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
            img_path: '/textures/cards/juggernaut_mind.png',
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
            img_path: '/textures/cards/galaxy_brain.png',
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
            img_path: '/textures/cards/holy_trinity.png',
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
            img_path: '/textures/cards/gods_eye.png',
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
            img_path: '/textures/cards/infinite_thought.png',
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
            img_path: '/textures/cards/hell_commander.png',
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
            img_path: '/textures/cards/transcendence.png',
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
            img_path: '/textures/cards/madmans_genius.png',
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
            img_path: '/textures/cards/absolute_focus.png',
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
            img_path: '/textures/cards/overvolt.png',
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
            img_path: '/textures/cards/demon_intellect.png',
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
            img_path: '/textures/cards/apocalypse_protocol.png',
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
            img_path: '/textures/cards/quick_study.png',
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
            img_path: '/textures/cards/fortify_mind.png',
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
            img_path: '/textures/cards/berserker_eye.png',
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
            img_path: '/textures/cards/regen_pulse.png',
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
            img_path: '/textures/cards/keen_focus.png',
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
            img_path: '/textures/cards/headbutt.png',
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
            img_path: '/textures/cards/battle_cry.png',
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
            img_path: '/textures/cards/meditate.png',
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
            img_path: '/textures/cards/reckless_vision.png',
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
            img_path: '/textures/cards/first_blood.png',
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
            img_path: '/textures/cards/tactical_mind.png',
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
            img_path: '/textures/cards/iron_will.png',
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
            img_path: '/textures/cards/blood_rage.png',
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
            img_path: '/textures/cards/vital_flow.png',
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
            img_path: '/textures/cards/bleed_insight.png',
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
            img_path: '/textures/cards/calculated_strike.png',
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
            img_path: '/textures/cards/clarity.png',
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
            img_path: '/textures/cards/phantom_steps.png',
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
            img_path: '/textures/cards/predator_sense.png',
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
            img_path: '/textures/cards/veteran_resolve.png',
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
            img_path: '/textures/cards/war_trance.png',
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
            img_path: '/textures/cards/regenerative_focus.png',
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
            img_path: '/textures/cards/bleed_commander.png',
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
            img_path: '/textures/cards/battle_trance.png',
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
            img_path: '/textures/cards/expose_all.png',
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
            img_path: '/textures/cards/lifeflow.png',
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
            img_path: '/textures/cards/mad_genius.png',
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
            img_path: '/textures/cards/tactical_advantage.png',
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
            img_path: '/textures/cards/death_focus.png',
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
            img_path: '/textures/cards/field_commander.png',
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
            img_path: '/textures/cards/bloodlust_vision.png',
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
            img_path: '/textures/cards/soul_sight.png',
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
            img_path: '/textures/cards/regen_mastery.png',
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
            img_path: '/textures/cards/combat_surge.png',
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
            img_path: '/textures/cards/bleeding_oracle.png',
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
            img_path: '/textures/cards/hell_trance.png',
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
            img_path: '/textures/cards/strategic_mind.png',
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
            img_path: '/textures/cards/overwhelm.png',
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
            img_path: '/textures/cards/phantom_sight.png',
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
            img_path: '/textures/cards/warlord_mind.png',
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
            img_path: '/textures/cards/infinite_rage.png',
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
            img_path: '/textures/cards/lifestream.png',
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
            img_path: '/textures/cards/bleed_frenzy_mind.png',
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
            img_path: '/textures/cards/hellbound_focus.png',
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
            img_path: '/textures/cards/supreme_overload.png',
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
            img_path: '/textures/cards/predator_sight.png',
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
            img_path: '/textures/cards/momentum_mind.png',
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
            img_path: '/textures/cards/mass_expose.png',
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
            img_path: '/textures/cards/wrath_engine.png',
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
            img_path: '/textures/cards/bloodmind.png',
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
            img_path: '/textures/cards/godmind.png',
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
            img_path: '/textures/cards/undying_will.png',
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
            img_path: '/textures/cards/void_focus.png',
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
            img_path: '/textures/cards/bleed_tyrant.png',
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
            img_path: '/textures/cards/hellish_intellect.png',
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
            img_path: '/textures/cards/final_clarity.png',
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
            img_path: '/textures/cards/doom_sight.png',
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
            img_path: '/textures/cards/eternal_flow.png',
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
            img_path: '/textures/cards/hell_emperor_mind.png',
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
            img_path: '/textures/cards/apocalypse_sight.png',
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
            img_path: '/textures/cards/reactive_visor.png',
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
            img_path: '/textures/cards/tactical_dodge.png',
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
            img_path: '/textures/cards/war_helm_aura.png',
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
            img_path: '/textures/cards/ghost_sight.png',
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
            img_path: '/textures/cards/warden_visor.png',
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
            img_path: '/textures/cards/hell_sentinel_mind.png',
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
            img_path: '/textures/cards/omega_visor.png',
            tier: 6,
            type: 'helmet',
            exhaust: true,
            targetType: 'self',
            affectedTargets: 1,
            effects: { deflect: { pct: 30, turns: 3 }, strength: 5, extraPlays: 1 }
        },

        // ── T7 helmet — legendary, T6 equipment only (~10% per slot) ────
        {
            id: 721,
            name: 'Absolute Power',
            img_path: '/textures/cards/absolute_power.png',
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
            img_path: '/textures/cards/eternal_mind.png',
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
            img_path: '/textures/cards/mass_doom.png',
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
            img_path: '/textures/cards/apex_clarity.png',
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
            img_path: '/textures/cards/god_emperor_sight.png',
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
            img_path: '/textures/cards/worn_armor.png',
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
            img_path: '/textures/cards/brace.png',
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
            img_path: '/textures/cards/shrug_it_off.png',
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
            img_path: '/textures/cards/dented_shield.png',
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
            img_path: '/textures/cards/grit.png',
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
            img_path: '/textures/cards/clank.png',
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
            img_path: '/textures/cards/patch_up.png',
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
            img_path: '/textures/cards/stomp.png',
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
            img_path: '/textures/cards/stubborn.png',
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
            img_path: '/textures/cards/emergency_patch.png',
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
            img_path: '/textures/cards/reinforced_plate.png',
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
            img_path: '/textures/cards/iron_hide.png',
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
            img_path: '/textures/cards/spiked_recoil.png',
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
            img_path: '/textures/cards/tighten_straps.png',
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
            img_path: '/textures/cards/endure.png',
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
            img_path: '/textures/cards/counter_brace.png',
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
            img_path: '/textures/cards/iron_mend.png',
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
            img_path: '/textures/cards/shell_up.png',
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
            img_path: '/textures/cards/bolstered.png',
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
            img_path: '/textures/cards/second_skin.png',
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
            img_path: '/textures/cards/guard_stance.png',
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
            img_path: '/textures/cards/bulwark_bash.png',
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
            img_path: '/textures/cards/pain_resistance.png',
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
            img_path: '/textures/cards/fortress.png',
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
            img_path: '/textures/cards/battle_mend.png',
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
            img_path: '/textures/cards/rebound.png',
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
            img_path: '/textures/cards/teeth_gritted.png',
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
            img_path: '/textures/cards/juggernaut.png',
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
            img_path: '/textures/cards/desperate_mend.png',
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
            img_path: '/textures/cards/ironclad.png',
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
            img_path: '/textures/cards/iron_wall.png',
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
            img_path: '/textures/cards/resolute_defense.png',
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
            img_path: '/textures/cards/wrath_barrier.png',
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
            img_path: '/textures/cards/deep_mend.png',
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
            img_path: '/textures/cards/armor_of_thorns.png',
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
            img_path: '/textures/cards/indomitable.png',
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
            img_path: '/textures/cards/heavy_mend.png',
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
            img_path: '/textures/cards/titanic_block.png',
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
            img_path: '/textures/cards/undying.png',
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
            img_path: '/textures/cards/unbreakable.png',
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
            img_path: '/textures/cards/last_stand_armor.png',
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
            img_path: '/textures/cards/legendary_bulwark.png',
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
            img_path: '/textures/cards/pyrrhic_heal.png',
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
            img_path: '/textures/cards/demigod_skin.png',
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
            img_path: '/textures/cards/spite_barrier.png',
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
            img_path: '/textures/cards/endurance_champion.png',
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
            img_path: '/textures/cards/gritted_teeth.png',
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
            img_path: '/textures/cards/siege_wall.png',
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
            img_path: '/textures/cards/mending_roar.png',
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
            img_path: '/textures/cards/defy_death.png',
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
            img_path: '/textures/cards/immortal_bulwark.png',
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
            img_path: '/textures/cards/hellguard.png',
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
            img_path: '/textures/cards/rebirth_plating.png',
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
            img_path: '/textures/cards/damnation_shell.png',
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
            img_path: '/textures/cards/unkillable.png',
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
            img_path: '/textures/cards/colossus.png',
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
            img_path: '/textures/cards/monument.png',
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
            img_path: '/textures/cards/spite_incarnate.png',
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
            img_path: '/textures/cards/undying_legion.png',
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
            img_path: '/textures/cards/invincible.png',
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
            img_path: '/textures/cards/crude_plating.png',
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
            img_path: '/textures/cards/thorn_shell.png',
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
            img_path: '/textures/cards/first_aid.png',
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
            img_path: '/textures/cards/reactive_hide.png',
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
            img_path: '/textures/cards/stone_skin.png',
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
            img_path: '/textures/cards/endure.png',
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
            img_path: '/textures/cards/deflect_shard.png',
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
            img_path: '/textures/cards/regen_layer.png',
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
            img_path: '/textures/cards/tough_it_out.png',
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
            img_path: '/textures/cards/iron_shell.png',
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
            img_path: '/textures/cards/bulwark.png',
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
            img_path: '/textures/cards/mirror_plating.png',
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
            img_path: '/textures/cards/fortified_stance.png',
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
            img_path: '/textures/cards/mending_plate.png',
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
            img_path: '/textures/cards/spined_armor.png',
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
            img_path: '/textures/cards/renewal.png',
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
            img_path: '/textures/cards/reactive_shell.png',
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
            img_path: '/textures/cards/war_plate.png',
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
            img_path: '/textures/cards/thorn_ward.png',
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
            img_path: '/textures/cards/living_armor.png',
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
            img_path: '/textures/cards/retaliation_plate.png',
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
            img_path: '/textures/cards/ironclad.png',
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
            img_path: '/textures/cards/regenerating_shell.png',
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
            img_path: '/textures/cards/warden_stance.png',
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
            img_path: '/textures/cards/soul_mending.png',
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
            img_path: '/textures/cards/thorn_fortress.png',
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
            img_path: '/textures/cards/bastion.png',
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
            img_path: '/textures/cards/resilience.png',
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
            img_path: '/textures/cards/reactive_armor.png',
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
            img_path: '/textures/cards/hardened.png',
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
            img_path: '/textures/cards/mirror_ward.png',
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
            img_path: '/textures/cards/juggernaut.png',
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
            img_path: '/textures/cards/eternal_regen.png',
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
            img_path: '/textures/cards/thornmail.png',
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
            img_path: '/textures/cards/unbreakable.png',
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
            img_path: '/textures/cards/vital_barrier.png',
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
            img_path: '/textures/cards/war_fortress.png',
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
            img_path: '/textures/cards/regen_fortress.png',
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
            img_path: '/textures/cards/spiteful_armor.png',
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
            img_path: '/textures/cards/titan_defense.png',
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
            img_path: '/textures/cards/phantom_plate.png',
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
            img_path: '/textures/cards/colossus_guard.png',
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
            img_path: '/textures/cards/vital_regen.png',
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
            img_path: '/textures/cards/retribution_shell.png',
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
            img_path: '/textures/cards/dreadnought.png',
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
            img_path: '/textures/cards/immortal_plate.png',
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
            img_path: '/textures/cards/blood_barrier.png',
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
            img_path: '/textures/cards/spiked_fortress.png',
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
            img_path: '/textures/cards/hell_bulwark.png',
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
            img_path: '/textures/cards/eternal_barrier.png',
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
            img_path: '/textures/cards/mirror_colossus.png',
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
            img_path: '/textures/cards/undying_fortress.png',
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
            img_path: '/textures/cards/hellfire_ward.png',
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
            img_path: '/textures/cards/adamantine_shell.png',
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
            img_path: '/textures/cards/eternal_reckoning.png',
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
            img_path: '/textures/cards/godplate.png',
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
            img_path: '/textures/cards/hell_retribution.png',
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
            img_path: '/textures/cards/immortal_fortress.png',
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
            img_path: '/textures/cards/void_plate.png',
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
            img_path: '/textures/cards/apocalypse_armor.png',
            tier: 6,
            type: 'armour',
            exhaust: true,
            targetType: 'self',
            affectedTargets: 1,
            effects: { block: 35, deflect: { pct: 35, turns: 3 }, regen: 6, healing: 14 }
        },

        // ── T7 armour — legendary, T6 equipment only (~10% per slot) ────
        {
            id: 731,
            name: 'Titan Shell',
            img_path: '/textures/cards/titan_shell.png',
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
            img_path: '/textures/cards/undying_god.png',
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
            img_path: '/textures/cards/eternal_deflection.png',
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
            img_path: '/textures/cards/absolute_bulwark.png',
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
            img_path: '/textures/cards/invincible_core.png',
            tier: 7,
            type: 'armour',
            exhaust: true,
            targetType: 'self',
            affectedTargets: 1,
            effects: { block: 40, regen: 9, healing: 20, deflect: { pct: 28, turns: 2 } }
        }
    ],

    // Cursed cards used by trap events.
    cursed: [
        // ── Powerful but dangerous — high risk/reward ────────────────────
        {
            id: 901,
            name: 'Hellpact',
            img_path: '/textures/cards/curse_hellpact.png',
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
            img_path: '/textures/cards/curse_soul_sacrifice.png',
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
            img_path: '/textures/cards/curse_blood_pact.png',
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
            img_path: '/textures/cards/curse_infernal_contract.png',
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
            img_path: '/textures/cards/curse_damnation_strike.png',
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
            img_path: '/textures/cards/curse_void_gamble.png',
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
            img_path: '/textures/cards/curse_sacrifice_play.png',
            tier: 5,
            type: 'cursed',
            exhaust: true,
            targetType: 'all',
            affectedTargets: 'all',
            effects: { damage: 18, strength: 4, backfire: 18 }
        },

        // ── Plain bad — discourages keeping cursed equipment ─────────────
        {
            id: 908,
            name: 'Black Mark',
            img_path: '/textures/cards/curse_black_mark.png',
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
            img_path: '/textures/cards/curse_tainted_blow.png',
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
            img_path: '/textures/cards/curse_cursed_reflex.png',
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
            img_path: '/textures/cards/curse_hex_wound.png',
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
            img_path: '/textures/cards/curse_void_drain.png',
            tier: 2,
            type: 'cursed',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { backfire: 12 }
        },

        // ── More risk/reward ─────────────────────────────────────────────
        {
            id: 913,
            name: 'Berserker Pact',
            img_path: '/textures/cards/curse_berserker_pact.png',
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
            img_path: '/textures/cards/curse_cursed_flurry.png',
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
            img_path: '/textures/cards/curse_doom_volley.png',
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
            img_path: '/textures/cards/curse_forbidden_strength.png',
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
            img_path: '/textures/cards/curse_hell_roulette.png',
            tier: 5,
            type: 'cursed',
            exhaust: false,
            targetType: 'single',
            affectedTargets: 1,
            effects: { damage: 18, vulnerable: { pct: 35, turns: 2 }, backfire: 20 }
        },

        // ── More plain bad ───────────────────────────────────────────────
        {
            id: 918,
            name: 'Ruinous Step',
            img_path: '/textures/cards/curse_ruinous_step.png',
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
            img_path: '/textures/cards/curse_cursed_whisper.png',
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
            img_path: '/textures/cards/curse_hollow_strike.png',
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
            img_path: '/textures/cards/curse_marked.png',
            tier: 3,
            type: 'cursed',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { backfire: 17 }
        },

        // ── Extra plain-bad fillers — dilutes the cursed pool ────────────
        {
            id: 922,
            name: 'Wretched Touch',
            img_path: '/textures/cards/curse_wretched_touch.png',
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
            img_path: '/textures/cards/curse_blight_grasp.png',
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
            img_path: '/textures/cards/curse_doom_brand.png',
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
            img_path: '/textures/cards/curse_spectral_leech.png',
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
            img_path: '/textures/cards/curse_cursed_burden.png',
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
            img_path: '/textures/cards/curse_hex_pulse.png',
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
            img_path: '/textures/cards/curse_vile_scar.png',
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
            img_path: '/textures/cards/curse_rot_touch.png',
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
            img_path: '/textures/cards/curse_tainted_pulse.png',
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
            img_path: '/textures/cards/curse_forsaken_strike.png',
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
            img_path: '/textures/cards/curse_cursed_ache.png',
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
            img_path: '/textures/cards/curse_withered_blow.png',
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
            img_path: '/textures/cards/curse_shadow_sting.png',
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
            img_path: '/textures/cards/curse_foul_brand.png',
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
            img_path: '/textures/cards/curse_hex_lash.png',
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
            img_path: '/textures/cards/curse_plagued_touch.png',
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
            img_path: '/textures/cards/curse_cursed_miasma.png',
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
            img_path: '/textures/cards/curse_wretched_blow.png',
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
            img_path: '/textures/cards/curse_dark_fumble.png',
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
