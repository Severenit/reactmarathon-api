import { BOARD, BOARD_MIN } from '../../constants/index';

const randomId = () => {
    return Math.floor(Math.random() * 100);
};

class PlayerEntity {
    constructor(playerId, playerPokemons) {
        this.playerId = playerId;
        this.playerPokemons = playerPokemons;
    }
}

export class Game {
    constructor(userId, pokemons) {
        this.player1 = new PlayerEntity(userId, pokemons);
        this.roomId = randomId();
        this.player2;
        this.board = BOARD_MIN;
    }

    createPlayer2(userId, pokemons) {
        this.player2 = new PlayerEntity(userId, pokemons);
    }
}
