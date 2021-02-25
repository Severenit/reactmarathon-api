import { BOARD_MIN } from '../../constants';
import { TripleTriadPlayer } from '../../solver/TripleTriadPlayer';

const randomId = () => {
    return Math.floor(Math.random() * 100);
};
// p1, p2, board, playerNames, move

// {
//     ai: false,
//     currentPlayer: playerNames,
//     hands: { p1, p2 },
//     move,
//     board,
// }

export class Game {
    constructor(userId, p1) {
        this.roomId = randomId();
        this.p1 = { [userId]: p1 };
        this.p2 = {};
        this.board = BOARD_MIN;
        this.moves = [];
    }

    createPlayer2(userId, pokemons) {
        this.p2[userId] = pokemons;
    }
}
