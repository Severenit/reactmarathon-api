import { TripleTriadPlayer } from '../solver/TripleTriadPlayer';

// const randomId = () => {
//     const id = Math.floor(Math.random() * 100);
//     return `${id}`;
// };

// const randomBool = () => {
//     return Math.random() < 0.5;
// };
// p1, p2, board, playerNames, move

// {
//     ai: false,
//     currentPlayer: playerNames,
//     hands: { p1, p2 },
//     move,
//     board,
// }

export class Game {
    constructor() {
        this.status = '';
        this.p1 = { owner: '', pokemons: [], userId: '' };
        this.p2 = { owner: '', pokemons: [], userId: '' };
        this.board = [];
        this.move = {};
        this.hands = {};
        this.rate = 0;
        this.beaten = [];
        this.empty = [];
        this.turnOwner = '';
    }

    firstTurnOwner() {
        if (Math.random() < 0.5) {
            this.turnOwner = 'p1';
        }
        this.turnOwner = 'p2';
    }

    changeTurnOwner() {
        if (this.turnOwner === 'p1') {
            return 'p2';
        } else if (this.turnOwner === 'p2') return 'p1';
    }

    createPlayer2(userId, pokemons) {
        // pokemons.forEach((pok) => {
        //     pok.key = randomId();
        // });
        // this.p2.owner = 'p2';
        // this.p2.userId = userId;
        // this.p2.pokemons = pokemons;
        this.p2 = { owner: 'p2', userId: userId, pokemons: pokemons };
        this.hands.p2 = pokemons;
        this.status = 'start';
    }
    createPlayer1(userId, pokemons) {
        // pokemons.forEach((pok) => {
        //     pok.key = randomId();
        // });
        // this.p1.owner = 'p2';
        // this.p1.userId = userId;
        // this.p1.pokemons = pokemons;
        this.p1 = { owner: 'p1', userId: userId, pokemons: pokemons };
        this.hands.p1 = pokemons;
        this.status = 'wait';
    }

    onPlayerTurn(move, p1, p2, playerNames) {
        if (this.status === 'finish') {
            return;
        }

        if (playerNames === this.turnOwner) {
            const params = {
                ai: false,
                currentPlayer: playerNames,
                hands: { p1, p2 },
                move,
                board: this.board,
            };

            this[playerNames].pokemons.filter((item) => item.id !== move.id);

            const player = new TripleTriadPlayer();

            const turn = player.play(params);
            if (turn.empty === []) {
                this.status = 'finish';
            }
            this.updateGameState(turn);
        } else return;
    }

    updateGameState(state) {
        this.move = state.move;
        this.board = state.board;
        this.rate = state.rate;
        this.beaten = state.beaten;
        this.empty = state.empty;
        this.hands = state.hands;
        this.turnOwner = this.changeTurnOwner();
    }

    onFinishGame() {
        return {
            p1: this.p1,
            p2: this.p2,
        };
    }
}
