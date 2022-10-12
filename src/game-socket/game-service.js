import { Game } from './domains/game-entity';
import { createPlayer } from '../createPlayer/index';

export class GameService {
    constructor() {
        this.rooms = new Map();
        this.activeUsers = new Map();
    }

    checkActiveUser(userId) {
        if (this.activeUsers.has(userId)) {
            return this.activeUsers.get(userId);
        } else return;
    }

    createRoom(userId, data) {
        const game = new Game(userId, data);
        this.rooms.set(game.roomId, game);
        this.activeUsers.set(userId, game.roomId);
        return game.roomId;
    }

    joinRoom(userId, data, roomId) {
        const game = this.rooms.get(roomId);
        if (!game.player2.playerId) {
            game.createPlayer2(userId, data);
            this.activeUsers.set(userId, roomId);
            return game.roomId;
        } else return new Error('Room is actually full, try find another game');
    }

    joinAI(userId, data) {
        const game = new Game(userId, data);
        const opponentId = 'AI';
        const opponentPokemons = createPlayer();
        game.createPlayer2(opponentId, opponentPokemons);
        this.rooms.set(game.roomId, game);
        this.activeUsers.set(userId, game.roomId);
        return game.roomId;
    }
}
