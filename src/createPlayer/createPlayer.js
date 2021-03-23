const pokemonsJSON = require('../constants/pokemonsUpdate.json');

const createPlayer = () => {
    const length = pokemonsJSON.length;
    const data = [];

    for (let i = 0; i < 5; i++) {
        const num = Math.floor(Math.random() * length) + 1;
        data.push(pokemonsJSON[num]);
    }

    return data;
};

module.exports = createPlayer;
