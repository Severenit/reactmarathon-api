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

const firstTurnOwner = () => {
  if (Math.random() < 0.5) {
    return 1;
  }
  return 2;
};

export class Game {
  constructor() {
    this.status = '';
    this.p1 = { owner: '', pokemons: [], userId: '' };
    this.p2 = { owner: '', pokemons: [], userId: '' };
    this.board = [];
    this.move = {};
    this.hands = { p1: {}, p2: {} };
    this.rate = 0;
    this.beaten = [];
    this.empty = [];
    this.turnOwner = firstTurnOwner();
    // this.winner = 0;
  }

  changeTurnOwner() {
    if (this.turnOwner === 1) {
      return 2;
    } else if (this.turnOwner === 2) return 1;
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

  onPlayerTurn(position, card, userId) {
    if (this.status === 'finish') {
      return;
    }
    const playerName = card.player;

    if (playerName === this.turnOwner && userId === this[playerName].userId) {
      const params = {
        ai: false,
        currentPlayer: playerName,
        hands: this.hands,
        move: { hits: card.hits, position },
        // , id: card.id

        board: this.board,
      };

      // this[playerName].pokemons.filter((item) => item.id !== move.id);

      const player = new TripleTriadPlayer();

      const turn = player.play(params);
      if (turn.empty === []) {
        this.status = 'finish';
        return true;
      }
      this.updateGameState(turn);
			return;
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

  getGameState(roomId) {
    return {
      roomId: roomId,
      hands: this.hands,
      board: this.board,
      turnOwner: this.turnOwner,
      status: this.status,
    };
  }

  onFinishGame() {
    return {
      p1: this.p1,
      p2: this.p2,
    };
  }
}
