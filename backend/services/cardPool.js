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
            effects: { damage: 22, bleed: 4, backfire: 8 }
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
            effects: { damage: 20, healing: 8, lifesteal: { pct: 25, turns: 2 } }
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
            effects: { damage: 25, vulnerable: { pct: 30, turns: 3 }, backfire: 10 }
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
            effects: { extraPlays: 2 }
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
            effects: { damage: 20, scorch: 5, backfire: 6 }
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
            effects: { damage: 17, bleed: 6, extraPlays: 1 }
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
            effects: { damage: 22, bleed: 4, backfire: 8 }
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
            effects: { damage: 18, bleed: 7, extraPlays: 1 }
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
            effects: { damage: 16, bleed: 5, extraPlays: 1, backfire: 5 }
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
            effects: { damage: 24, backfire: 10 }
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
            effects: { extraPlays: 2 }
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
            effects: { extraPlays: 2, strength: 1 }
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
            effects: { extraPlays: 2, backfire: 2 }
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
            effects: { extraPlays: 2 }
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
            effects: { extraPlays: 3, backfire: 9 }
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
            effects: { extraPlays: 2, strength: 4 }
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
            effects: { extraPlays: 2, strength: 3 }
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
            effects: { extraPlays: 2, strength: 5 }
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
            effects: { extraPlays: 2, vulnerable: { pct: 15, turns: 2 } }
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
            effects: { extraPlays: 2, strength: 6 }
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
            effects: { extraPlays: 2, strength: 6, backfire: 6 }
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
            effects: { block: 20, healing: 8 }
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
            effects: { healing: 20, extraPlays: 1 }
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
            effects: { block: 22, damage: 8 }
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
            effects: { block: 18, healing: 12, extraPlays: 1 }
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
        }
    ],

    // Cursed cards used by trap events.
    cursed: [
        {
            id: 901,
            name: 'sussy combo',
            img_path: '/textures/cards/curse_sussy_combo.png',
            tier: 1,
            type: 'cursed',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { backfire: 4 }
        },
        {
            id: 902,
            name: 'Oopsie, All Regret',
            img_path: '/textures/cards/curse_oopsie_all_regret.png',
            tier: 1,
            type: 'cursed',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { backfire: 6 }
        },
        {
            id: 903,
            name: 'Monday Simulator',
            img_path: '/textures/cards/curse_monday_simulator.png',
            tier: 1,
            type: 'cursed',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: {}
        },
        {
            id: 904,
            name: 'German Stare',
            img_path: '/textures/cards/curse_german_stare.png',
            tier: 1,
            type: 'cursed',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: {}
        },
        {
            id: 905,
            name: 'crazy hamburger',
            img_path: '/textures/cards/curse_crazy_hamburger.png',
            tier: 1,
            type: 'cursed',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: { backfire: 8 }
        },
        {
            id: 906,
            name: 'Absolutely Nothing',
            img_path: '/textures/cards/curse_absolutely_nothing.png',
            tier: 1,
            type: 'cursed',
            exhaust: false,
            targetType: 'self',
            affectedTargets: 1,
            effects: {}
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
