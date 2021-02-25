export class GameView {
    constructor() {
        this.roomsView = {};
    }

    createView(roomId, userId, status) {
        roomsView[roomId] = { members: [userId], status: status };
        return this.roomsView;
    }

    updateView(roomId, userId, status) {
        roomsView[roomId].members.push(userId);
        roomsView[roomId].status = status;
        return this.roomsView;
    }
}
