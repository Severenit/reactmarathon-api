const player = { id: 1, card: ['a', 'b', 'c'] };

const req1 = { id: 1, cardIndex: 0 };
const req2 = { id: 123, cardIndex: 2 };
const req3 = { id: 1, cardIndex: 123 };

const checkPlayer = (id, index) => {
    if (id === player.id) {
        if (player.card[index]) {
            return player.id;
        }
        return new Error('Card with given index not exist');
    }
    return new Error('Player with given id not exist');
};

try {
    // const id1 = checkPlayer(req1.id, req1.cardIndex);
    // const id2 = checkPlayer(req2.id, req2.cardIndex);
    const id3 = checkPlayer(req3.id, req3.cardIndex);
    // console.log(id1);
    // console.log(id2);
    console.log(id3);
} catch (error) {
    console.log(error);
}
