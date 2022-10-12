import { randomInt } from './solverUtil.js';
import TripleTriadSolver from './TripleTriadSolver.js';

const solver = new TripleTriadSolver();

class TripleTriadPlayer {
    constructor() {
        this.globalHandIdSuffix = 1;
    }
    /*
    {
        ai: true,
        currentPlayer: 'p1',
        hands: {
            p1: [ [1,[1,2,3,4]], [2,[1,2,3,4]], [3,[1,2,3,4]], [4,[1,2,3,4]], ],
            p2: [ [5,[5,3,2,1]], [6,[5,3,2,1]], [7,[5,3,2,1]], [8,[5,3,2,1]], [9,[5,3,2,1]], ]
        },
        move: {id: 10, hits: [1,2,3,4], position: 5},
        board: [0, 0, 0,  0, 0, 0,  0, 0, 0],
    }
    */

    play({ ai, currentPlayer, hands, move, board }) {
        hands = this.normaliseHands(hands);

        board = board ? this.normaliseBoard(board) : [0, 0, 0, 0, 0, 0, 0, 0, 0];

        let result = ai
            ? this.aiMove({ currentPlayer, hands, board })
            : this.playerMove({ currentPlayer, move, board });

        if (result.move) {
            hands = { ...hands };
            const hits = result.move.hits;

            // console.log('FILTER', result.move.hits, hands[currentPlayer].pokes);
            hands[currentPlayer] = { ...hands[currentPlayer] };

            hands[currentPlayer].pokes = hands[currentPlayer].pokes.filter((p) => p.id !== result.move.id);
            // console.log('FILTERED', hands[currentPlayer].pokes);
        }

        return { move, ...result, hands };
    }

    aiMove({ currentPlayer, hands, board }) {
        let { rate, game } = solver.solve(board, hands, currentPlayer);

        // console.log(rate, game);

        return this.playerMove({ currentPlayer, board, move: game.length ? game[0] : null });
    }

    playerMove({ currentPlayer, move, board }) {
        let result = { board };

        if (!move || move.position === undefined || board[move.position] || (!move.owner && !currentPlayer)) {
            move = null;
        } else {
            if (move.owner !== undefined) currentPlayer = move.owner;
            else move.owner = currentPlayer;

            move.holder = move.owner;
            if (!move.rate) move.rate = solver.pokeRate(move.hits);

            result = solver.putCard(board, move);
        }

        return { move, ...result, empty: solver.epmtyCells(board) };
    }

    normaliseHands(hands) {
        for (let owner in hands) hands[owner] = this.normaliseHand(hands[owner], owner);
        return hands;
    }

    normaliseHand(hand, owner) {
        const pokes =
            hand.pokes ||
            hand.map(({ id, hits, poke }) => ({ id, hits, owner, holder: owner, rate: solver.pokeRate(hits), poke }));
        return { owner, pokes };
    }

    normaliseBoard(board) {
        const normBoard = board.map((poke, idx) => {
            if (poke) {
                if (poke.holder === undefined) poke.holder = poke.owner;
                if (poke.position === undefined) poke.position = idx;
                if (poke.rate === undefined) poke.rate = solver.pokeRate(poke.hits);
            }

            return poke;
        });

        return normBoard;
    }

    deckRate(deck) {
        const topSize = 9;
        const topRates = deck
            .map((p) => p.attacks[0])
            .sort()
            .slice(-topSize);
        return (topRates.reduce((sum, rate) => sum + rate, 0) / topRates.length) | 0;
    }

    generateAiHand(opponentDeck, allPokes) {
        const rate = this.deckRate(opponentDeck);
        const range = 5;
        const from = rate - range,
            to = rate + range;

        const candidates = allPokes.filter((p) => p.attacks[0] >= from && p.attacks[0] <= to);

        const hand = [];
        for (let i = 0; i < 5; ++i) hand.push(candidates[randomInt(0, candidates.length)]);

        return hand;
    }

    pokesToHandCfg(pokes) {
        const suff = ++this.globalHandIdSuffix * 10;
        // шоб максимально уникальные айдишники давало
        const idHead = '' + Date.now() + randomInt(1000, 10000) + pokes[0].attacks[0] + randomInt(suff, suff * 10);
        return pokes.map((p, idx) => ({ id: idHead + '_' + idx, hits: p.attacks[1], poke: p }));
    }
}

export default TripleTriadPlayer;
