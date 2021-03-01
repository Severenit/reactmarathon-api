export class GameView {
    constructor() {
        this.roomsView = {};
    }

    createView(roomId, userId, status) {
        this.roomsView[roomId] = { members: [userId], status: status };
    }

    updateView(roomId, userId, status) {
        this.roomsView[roomId].members.push(userId);
        this.roomsView[roomId].status = status;
    }

    deleteView(roomId) {
        delete this.roomsView[roomId];
    }
}
