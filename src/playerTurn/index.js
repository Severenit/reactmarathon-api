import {BOARD} from '../constants';

export const playerTurn = (payload) => {
    const {position: initialPosition, card: initialCard, board: initialBoard} = payload;

    const card = initialCard;
    const position = Number(initialPosition);
    let cardPlayer = {};
    const board = initialBoard.map((item, index) => {
        let result = {
            ...BOARD[index],
            ...item
        };

        if (item.position === position) {
            result = {
                ...result,
                card: card,
            };
            cardPlayer = result;
        }

        return result;
    });

    const cards = board;

    cardPlayer.side.forEach(item => {
        let cardOnBoard;
        let player2Board;

        const fieldCard = cards.find(field => {
            if (field.position === item.pos && field.card !== null) {
                cardOnBoard = item.weak;
                return true;
            }
            return false;
        });

        if (fieldCard) {
            fieldCard.side.forEach(a => {
                if (a.pos === position) {
                    player2Board = a.weak;
                }
            });

            const fightSide2Card = cardPlayer.card.values[player2Board] === 'A' ? 10 : cardPlayer.card.values[player2Board];
            const cardOnBoardCard = fieldCard.card.values[cardOnBoard] === 'A' ? 10 : fieldCard.card.values[cardOnBoard];

            if (fightSide2Card > cardOnBoardCard) {
                cards.find(c => c.position === fieldCard.position).card.possession = cardPlayer.card.possession;
            }
        }
    });

    return cards.map(item => {
        delete item.side;
        return item;
    });
};
