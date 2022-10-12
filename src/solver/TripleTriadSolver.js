import { randomInt } from './solverUtil.js';

const boardSize = 3;
// const hitSymbols = '123456789A';
const minRate = -1000000;

class TripleTriadSolver {
    constructor() {}

    randomHand(owner) {
        const pokes = [];
        for (let i = 0; i < 5; ++i) pokes.push(this.randomPoke(owner, i));

        return { owner, pokes, unused: [...pokes] };
    }

    randomPoke(owner, position) {
        const hits = [];
        for (let i = 0; i < 4; ++i) hits.push(randomInt(0, 10));

        return { owner, hits, rate: this.pokeRate(hits), position };
    }
    /*
    solve(board, hands, currentPlayer, maxDepth = 5)
    {
        const hand1 = this.normaliseHand(player, 1);
        const hand2 = this.normaliseHand(enemy, 2);
        return this.play(this.normaliseBoard(board, [hand1, hand2]), hand1, hand2, maxDepth);
    }
*/
    solve(board, hands, currentPlayer, maxDepth = 5) {
        this.count = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        let empty = this.epmtyCells(board);

        // if(empty.length >= 7)
        //     empty = shuffle(empty);

        if (empty.length > 6 && maxDepth > 5) maxDepth = 5;
        if (empty.length >= 8 && maxDepth > 4) maxDepth = 4;
        // if(empty.length <= 6 ) maxDepth = Math.min(empty.length, maxDepth);

        const enemyId = Object.keys(hands).filter((key) => key !== currentPlayer)[0];

        // console.log('TURN', board, empty, hands[currentPlayer], hands[enemyId], maxDepth);

        // return {board};

        const result = this.turn(board, empty, hands[currentPlayer].pokes, hands[enemyId].pokes, maxDepth);

        return result;
    }

    turn(board, emptyCells, playerHand, enemyHand, maxDepth = 5, depth = 0, enemyMove = false) {
        ++this.count[depth];
        let rate = minRate;
        let game = [];

        // if(depth <= 1)
        //     console.log('TURN',  depth, board, emptyCells, playerHand, enemyHand, maxDepth, enemyMove);

        const hand = enemyMove ? enemyHand : playerHand;

        // console.log('DEPTH: '+depth, 'RATE: '+rate);
        // console.log(board);
        // const step = (depth >= 4 && emptyCells.length >= 6) ? 2 : 1;
        // const step = (depth > 6) ? 2 : 1;

        if (depth < maxDepth)
            for (
                let n = 0;
                n < emptyCells.length;
                n++ // emptyCells.forEach(([i, j]) =>
            ) {
                const position = emptyCells[n];

                const newEmptyCells = emptyCells.filter((pos) => pos !== position);

                // const step1 = (depth > 6) ? 2 : 1;

                for (
                    let n1 = 0;
                    n1 < hand.length;
                    n1++ // emptyCells.forEach(([i, j]) =>
                ) {
                    const oldPoke = hand[n1];
                    const newPoke = { ...oldPoke };
                    const newHand = hand.filter((poke) => oldPoke !== poke);

                    // console.log('newHand', newHand);

                    newPoke.position = position;

                    const { board: newBoard, rate: hitRate } = this.putCard(board, newPoke, enemyMove);

                    let result = { rate: minRate, game: [] };

                    if (newEmptyCells.length && depth < maxDepth - 1) {
                        result = this.turn(
                            newBoard,
                            newEmptyCells,
                            enemyMove ? playerHand : newHand,
                            enemyMove ? newHand : enemyHand,
                            maxDepth,
                            depth + 1,
                            !enemyMove,
                        );
                    }

                    const { rate: deepRate, game: newGame } = result;

                    const newRate = (newGame.length ? deepRate : 0) + hitRate;

                    if (newRate > rate) {
                        rate = newRate;
                        game = [{ ...newPoke }].concat(newGame);
                    }
                }
            }

        return { rate, game };
    }

    putCard([...board], { ...card }, enemyMove = false) {
        const cardPos = card.position;
        const i = (cardPos / boardSize) | 0;
        const i3 = i * boardSize;

        const j = cardPos - i3;

        board[cardPos] = card;

        // let rate = card.rate;
        let rate = 0;
        const beaten = [];

        // обрабатываем бой покемонов:

        const hits = [
            { isOk: i > 0, hitOwn: 0, hitEnemy: 2, pos: cardPos - boardSize },
            { isOk: j < boardSize - 1, hitOwn: 1, hitEnemy: 3, pos: cardPos + 1 },
            { isOk: i < boardSize - 1, hitOwn: 2, hitEnemy: 0, pos: cardPos + boardSize },
            { isOk: j > 0, hitOwn: 3, hitEnemy: 1, pos: cardPos - 1 },
        ];

        for (let i = 0; i < hits.length; ++i) {
            const hit = hits[i];

            // for (let [isOk, hitOwn, hitEnemy, pos] of hits) {
            if (hit.isOk && board[hit.pos]) {
                const cardEnemy = board[hit.pos];

                if (cardEnemy.holder !== card.owner && cardEnemy.hits[hit.hitEnemy] < card.hits[hit.hitOwn]) {
                    if (this.count) ++this.count[10];
                    rate += cardEnemy.rate;
                    const cardEnemyNew = { ...cardEnemy };
                    cardEnemyNew.holder = card.owner;
                    board[hit.pos] = cardEnemyNew;
                    beaten.push(hit.pos);
                }
            }
        }

        if (enemyMove) rate = -rate;

        return { board, rate, beaten };
    }

    epmtyCells(board) {
        return board.reduce((empty, cell, idx) => (cell || empty.push(idx)) && empty, []);
    }

    pokeRate(hits) {
        return hits[0] + hits[1] + hits[2] + hits[3] + 1000;
    }
}

export default TripleTriadSolver;
