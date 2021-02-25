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
    constructor(p1, p2, board, playerNames, move) {
        this.roomId = randomId();
        this.p1 = p1;
        this.p2 = p2;
        this.board = board;
        this.playerNames = playerNames;
        this.move = move;
    }

    createPlayer2(userId, pokemons) {
        this.player2 = new PlayerEntity(userId, pokemons);
    }
}
