const crypto = require('crypto');
const { CARDS_PER_TURN } = require('../services/cardPool.js');

const HAND_SIZE = 5; // hand is always maintained at this size during combat

const TURN_OWNERS = {
    PLAYER: 'player',
    ENEMY: 'enemy'
};

class CombatSession {
    constructor(options = {}) {
        this.encounterId = crypto.randomUUID();
        this.startedAt = new Date().toISOString();
        this.endedAt = null;

        this.isResolved = false;
        this.isGameOver = false;
        this.dungeonType = options.dungeonType || 'unknown';
        this.dungeonLevel = Number.isInteger(options.dungeonLevel)
            ? options.dungeonLevel
            : Number(options.dungeonLevel) || 1;

        this.turnOwner = TURN_OWNERS.PLAYER;
        this.turnNumber = 1;
        this.turnRules = {
            baseCardsPerTurn: Number(options.baseCardsPerTurn || CARDS_PER_TURN),
            cardsPlayedThisTurn: 0,
            bonusCardsThisTurn: 0
        };

        const playerMaxHp = Number(options.playerMaxHp || 100);
        const playerCurrentHp = Number(options.playerCurrentHp || playerMaxHp);

        this.player = {
            playerId: Number.isInteger(options.playerId) ? options.playerId : null,
            hp: this._clamp(playerCurrentHp, 0, playerMaxHp),
            maxHp: playerMaxHp,
            block: 0,
            strength: 0,
            statuses: [],
            equipmentSnapshot: options.equipmentSnapshot || {}
        };

        this.enemy = {
            enemyId: null,
            archetype: null,
            hp: 0,
            maxHp: 0,
            block: 0,
            strength: 0,
            statuses: [],
            currentIntent: null
        };

        this.enemies = [];

        this.deck = {
            drawPile: [],
            hand: [],
            discardPile: [],
            exhaustPile: []
        };

        this.combatLog = [];
        this.reward = {
            pending: null,
            granted: false
        };

        this.flags = {
            roomCompletionApplied: false
        };

        this.rng = {
            seed: options.rngSeed || null,
            cursor: 0
        };
    }

    isActive() {
        return !this.isResolved;
    }

    resolveCombat({ gameOver = false } = {}) {
        this.isResolved = true;
        this.isGameOver = Boolean(gameOver);
        if (!this.endedAt) {
            this.endedAt = new Date().toISOString();
        }
    }

    setEnemy(enemyData = {}) {
        const maxHp = Number(enemyData.maxHp || enemyData.hp || 0);
        const hp = Number(enemyData.hp || maxHp);

        this.enemy = {
            enemyId: enemyData.enemyId || null,
            archetype: enemyData.archetype || 'unknown',
            img_path: enemyData.img_path || null,
            hp: this._clamp(hp, 0, maxHp),
            maxHp,
            block: Number(enemyData.block || 0),
            strength: Number(enemyData.strength || 0),
            statuses: Array.isArray(enemyData.statuses) ? enemyData.statuses : [],
            currentIntent: enemyData.currentIntent || null,
            cards: Array.isArray(enemyData.cards) ? enemyData.cards : [],
            cardsPerTurn: enemyData.cardsPerTurn || { min: 1, max: 2 }
        };

        // Wrap single enemy into the enemies array for multi-enemy compat
        this.enemies = [{ ...this.enemy, index: 0 }];
    }

    // Initialise the encounter with multiple enemies at once.
    // Each entry follows the same shape as generateEnemy() output.
    setEnemies(enemiesArray = []) {
        this.enemies = enemiesArray.map((e, i) => {
            const maxHp = Number(e.maxHp || e.hp || 0);
            const hp = Number(e.hp || maxHp);
            return {
                index: Number.isInteger(e.index) ? e.index : i,
                enemyId: e.enemyId || null,
                archetype: e.archetype || 'unknown',
                img_path: e.img_path || null,
                hp: this._clamp(hp, 0, maxHp),
                maxHp,
                block: Number(e.block || 0),
                strength: Number(e.strength || 0),
                statuses: Array.isArray(e.statuses) ? e.statuses : [],
                currentIntent: e.currentIntent || null,
                cards: Array.isArray(e.cards) ? e.cards : [],
                cardsPerTurn: e.cardsPerTurn || { min: 1, max: 2 }
            };
        });

        // Keep legacy this.enemy pointing at the first enemy for backward compat
        this.enemy =
            this.enemies.length > 0
                ? this.enemies[0]
                : {
                      enemyId: null,
                      archetype: null,
                      img_path: null,
                      hp: 0,
                      maxHp: 0,
                      block: 0,
                      strength: 0,
                      statuses: [],
                      currentIntent: null,
                      cards: [],
                      cardsPerTurn: { min: 1, max: 2 }
                  };
    }

    // Returns only enemies that are still alive (hp > 0).
    getAliveEnemies() {
        return this.enemies.filter((e) => e.hp > 0);
    }

    setDeckState(deckState = {}) {
        this.deck = {
            drawPile: Array.isArray(deckState.drawPile) ? deckState.drawPile : [],
            hand: Array.isArray(deckState.hand) ? deckState.hand : [],
            discardPile: Array.isArray(deckState.discardPile) ? deckState.discardPile : [],
            exhaustPile: Array.isArray(deckState.exhaustPile) ? deckState.exhaustPile : []
        };
    }

    setTurnOwner(nextOwner) {
        if (!Object.values(TURN_OWNERS).includes(nextOwner)) {
            return false;
        }
        this.turnOwner = nextOwner;
        return true;
    }

    incrementTurn() {
        this.turnNumber += 1;
    }

    // Remove a card from hand by index, route it to discard or exhaust,
    // then immediately draw one replacement to keep the hand at HAND_SIZE.
    // Returns the removed card so the caller can apply its effects, or null if index is invalid.
    removeCardFromHand(cardIndex, exhaust = false) {
        if (cardIndex < 0 || cardIndex >= this.deck.hand.length) return null;
        const [card] = this.deck.hand.splice(cardIndex, 1);
        if (exhaust) {
            this.deck.exhaustPile.push(card);
        } else {
            this.deck.discardPile.push(card);
        }
        this.drawCard(); // immediately refill the empty slot
        return card;
    }

    // Fill hand up to HAND_SIZE by drawing cards one at a time.
    // Used at combat start to deal the opening hand.
    // During combat, drawCard() is called once per card played instead.
    refillHand() {
        while (this.deck.hand.length < HAND_SIZE) {
            if (this.drawCard() === null) break; // draw + discard both empty
        }
    }

    // Draw one card from the draw pile into hand.
    // If the draw pile is empty, shuffle the discard pile back into the draw pile first.
    // Exhausted cards are never reshuffled — they stay in exhaustPile permanently.
    drawCard() {
        if (this.deck.drawPile.length === 0) {
            if (this.deck.discardPile.length === 0) return null; // nothing left to draw
            // Fisher-Yates shuffle of the discard pile → becomes the new draw pile
            const reshuffled = [...this.deck.discardPile];
            for (let i = reshuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [reshuffled[i], reshuffled[j]] = [reshuffled[j], reshuffled[i]];
            }
            this.deck.drawPile = reshuffled;
            this.deck.discardPile = [];
        }
        const card = this.deck.drawPile.shift();
        this.deck.hand.push(card);
        return card;
    }

    // Draw n cards, stopping early if both draw and discard piles run out.
    drawCards(n) {
        const count = Math.max(0, Math.floor(Number(n) || 0));
        for (let i = 0; i < count; i++) {
            if (this.drawCard() === null) break;
        }
    }

    startPlayerTurn() {
        this.setTurnOwner(TURN_OWNERS.PLAYER);
        this.turnRules.cardsPlayedThisTurn = 0;
        this.turnRules.bonusCardsThisTurn = 0;
        // Block and strength accumulated last turn expire at the start of the next player turn
        this.player.block = 0;
        this.player.strength = 0;
        // No draw here — hand is always maintained at HAND_SIZE:
        // one card is drawn automatically every time a card is played.
    }

    startEnemyTurn() {
        this.setTurnOwner(TURN_OWNERS.ENEMY);
        // Block and strength accumulated by every enemy last turn expire now
        for (const enemy of this.enemies) {
            if (enemy.hp > 0) {
                enemy.block = 0;
                enemy.strength = 0;
            }
        }
    }

    getMaxCardsThisTurn() {
        const base = Number(this.turnRules.baseCardsPerTurn || 0);
        const bonus = Number(this.turnRules.bonusCardsThisTurn || 0);
        return Math.max(0, base + bonus);
    }

    getRemainingCardPlays() {
        const remaining =
            this.getMaxCardsThisTurn() - Number(this.turnRules.cardsPlayedThisTurn || 0);
        return Math.max(0, remaining);
    }

    canPlayCard() {
        return (
            this.isActive() &&
            this.turnOwner === TURN_OWNERS.PLAYER &&
            this.getRemainingCardPlays() > 0
        );
    }

    registerCardPlayed() {
        if (!this.canPlayCard()) {
            return false;
        }

        this.turnRules.cardsPlayedThisTurn += 1;
        return true;
    }

    addBonusCardPlays(amount = 1) {
        const parsed = Number(amount);
        if (!Number.isFinite(parsed) || parsed <= 0) {
            return false;
        }

        this.turnRules.bonusCardsThisTurn += Math.floor(parsed);
        return true;
    }

    setPlayerHp(nextHp) {
        this.player.hp = this._clamp(Number(nextHp), 0, this.player.maxHp);

        if (this.player.hp <= 0) {
            this.resolveCombat({ gameOver: true });
        }
    }

    setEnemyHp(nextHp, enemyIndex = 0) {
        const target = this.enemies[enemyIndex] || this.enemies[0];
        if (!target) return;

        target.hp = this._clamp(Number(nextHp), 0, target.maxHp);

        // Keep legacy this.enemy in sync when targeting the first enemy
        if (target === this.enemies[0]) {
            this.enemy.hp = target.hp;
        }

        // Combat is won when every enemy is dead
        if (this.enemies.length > 0 && this.enemies.every((e) => e.hp <= 0)) {
            this.resolveCombat({ gameOver: false });
        }
    }

    syncPlayerHpFromDungeon(currentHP) {
        this.setPlayerHp(currentHP);
    }

    appendLog(entry = {}) {
        this.combatLog.push({
            at: new Date().toISOString(),
            type: entry.type || 'info',
            message: entry.message || '',
            meta: entry.meta || null
        });
    }

    setRewardPending(rewardPayload) {
        this.reward.pending = rewardPayload || null;
    }

    markRewardGranted() {
        this.reward.granted = true;
    }

    markRoomCompletionApplied() {
        this.flags.roomCompletionApplied = true;
    }

    toJSON() {
        return {
            encounterId: this.encounterId,
            startedAt: this.startedAt,
            endedAt: this.endedAt,
            isResolved: this.isResolved,
            isGameOver: this.isGameOver,
            dungeonType: this.dungeonType,
            dungeonLevel: this.dungeonLevel,
            turnOwner: this.turnOwner,
            turnNumber: this.turnNumber,
            turnRules: this.turnRules,
            player: this.player,
            enemy: this.enemy,
            enemies: this.enemies,
            deck: this.deck,
            combatLog: this.combatLog,
            reward: this.reward,
            flags: this.flags,
            rng: this.rng
        };
    }

    static fromJSON(data) {
        const c = Object.create(CombatSession.prototype);

        c.encounterId = data.encounterId;
        c.startedAt = data.startedAt;
        c.endedAt = data.endedAt || null;
        c.isResolved = Boolean(data.isResolved);
        c.isGameOver = Boolean(data.isGameOver);
        c.dungeonType = data.dungeonType || 'unknown';
        c.dungeonLevel = Number(data.dungeonLevel) || 1;
        c.turnOwner = data.turnOwner || TURN_OWNERS.PLAYER;
        c.turnNumber = Number(data.turnNumber) || 1;
        c.turnRules = data.turnRules || {
            baseCardsPerTurn: CARDS_PER_TURN,
            cardsPlayedThisTurn: 0,
            bonusCardsThisTurn: 0
        };
        c.player = data.player || {
            playerId: null,
            hp: 100,
            maxHp: 100,
            block: 0,
            strength: 0,
            statuses: [],
            equipmentSnapshot: {}
        };
        c.enemy = data.enemy || {
            enemyId: null,
            archetype: null,
            img_path: null,
            hp: 0,
            maxHp: 0,
            block: 0,
            strength: 0,
            statuses: [],
            currentIntent: null,
            cards: [],
            cardsPerTurn: { min: 1, max: 2 }
        };
        // Restore the enemies array — fall back to wrapping legacy single enemy
        c.enemies =
            Array.isArray(data.enemies) && data.enemies.length > 0
                ? data.enemies
                : c.enemy.maxHp > 0
                  ? [{ ...c.enemy, index: 0 }]
                  : [];
        c.deck = data.deck || {
            drawPile: [],
            hand: [],
            discardPile: [],
            exhaustPile: []
        };
        c.combatLog = Array.isArray(data.combatLog) ? data.combatLog : [];
        c.reward = data.reward || { pending: null, granted: false };
        c.flags = data.flags || { roomCompletionApplied: false };
        c.rng = data.rng || { seed: null, cursor: 0 };

        return c;
    }

    getClientState() {
        return {
            encounterId: this.encounterId,
            isResolved: this.isResolved,
            isGameOver: this.isGameOver,
            turnOwner: this.turnOwner,
            turnNumber: this.turnNumber,
            cardsPlayedThisTurn: this.turnRules.cardsPlayedThisTurn,
            maxCardsThisTurn: this.getMaxCardsThisTurn(),
            player: {
                hp: this.player.hp,
                maxHp: this.player.maxHp,
                block: this.player.block,
                statuses: this.player.statuses
            },
            enemies: this.enemies.map((e) => ({
                index: e.index,
                archetype: e.archetype,
                img_path: e.img_path || null,
                hp: e.hp,
                maxHp: e.maxHp,
                block: e.block,
                statuses: e.statuses
            })),
            hand: this.deck.hand,
            drawPileCount: this.deck.drawPile.length,
            discardPileCount: this.deck.discardPile.length,
            combatLog: this.combatLog.slice(-20)
        };
    }

    getPublicState() {
        return {
            encounterId: this.encounterId,
            startedAt: this.startedAt,
            endedAt: this.endedAt,
            isResolved: this.isResolved,
            isGameOver: this.isGameOver,
            dungeonType: this.dungeonType,
            dungeonLevel: this.dungeonLevel,
            turnOwner: this.turnOwner,
            turnNumber: this.turnNumber,
            turnRules: this.turnRules,
            player: this.player,
            enemy: this.enemy,
            enemies: this.enemies,
            deck: this.deck,
            combatLog: this.combatLog,
            reward: this.reward,
            flags: this.flags
        };
    }

    _clamp(value, min, max) {
        if (!Number.isFinite(value)) {
            return min;
        }
        return Math.max(min, Math.min(max, value));
    }
}

module.exports = {
    CombatSession,
    TURN_OWNERS
};
