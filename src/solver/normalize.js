//[{"abilities":["keen-eye","tangled-feet","big-pecks"],"base_experience":122,"height":11,"id":17,"img":"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/17.png","name":"pidgeotto","stats":{"attack":60,"defense":55,"hp":63,"special-attack":50,"special-defense":50,"speed":71},"type":"normal","values":{"bottom":1,"left":2,"right":5,"top":7},"weight":300,"possession":"blue"},{"abilities":["blaze","solar-power"],"base_experience":62,"height":6,"id":4,"img":"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png","name":"charmander","stats":{"attack":52,"defense":43,"hp":39,"special-attack":60,"special-defense":50,"speed":65},"type":"fire","values":{"bottom":2,"left":1,"right":1,"top":1},"weight":85,"possession":"blue"},{"abilities":["intimidate","shed-skin","unnerve"],"base_experience":157,"height":35,"id":24,"img":"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/24.png","name":"arbok","stats":{"attack":95,"defense":69,"hp":60,"special-attack":65,"special-defense":79,"speed":80},"type":"poison","values":{"bottom":2,"left":8,"right":"A","top":6},"weight":650,"possession":"blue"},{"abilities":["static","lightning-rod"],"base_experience":112,"height":4,"id":25,"img":"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png","name":"pikachu","stats":{"attack":55,"defense":40,"hp":35,"special-attack":50,"special-defense":50,"speed":90},"type":"electric","values":{"bottom":1,"left":5,"right":5,"top":6},"weight":60,"possession":"blue"},{"abilities":["overgrow","chlorophyll"],"base_experience":64,"height":7,"id":1,"img":"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png","name":"bulbasaur","stats":{"attack":49,"defense":49,"hp":45,"special-attack":65,"special-defense":65,"speed":45},"type":"grass","values":{"bottom":1,"left":4,"right":2,"top":2},"weight":69,"possession":"blue"}]
//[{"abilities":["pure-power","telepathy"],"base_experience":144,"height":13,"weight":315,"id":308,"img":"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/308.png","name":"medicham","stats":{"hp":60,"attack":60,"defense":75,"special-attack":60,"special-defense":75,"speed":80},"type":"fighting","values":{"top":1,"right":5,"bottom":2,"left":6},"possession":"red"},{"abilities":["volt-absorb","illuminate","water-absorb"],"base_experience":66,"height":5,"weight":120,"id":170,"img":"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/170.png","name":"chinchou","stats":{"hp":75,"attack":38,"defense":38,"special-attack":56,"special-defense":56,"speed":67},"type":"water","values":{"top":1,"right":7,"bottom":1,"left":1},"possession":"red"},{"abilities":["pressure","unnerve"],"base_experience":166,"height":12,"weight":385,"id":416,"img":"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/416.png","name":"vespiquen","stats":{"hp":70,"attack":80,"defense":102,"special-attack":80,"special-defense":102,"speed":40},"type":"bug","values":{"top":5,"right":8,"bottom":8,"left":3},"possession":"red"},{"abilities":["insomnia","super-luck","moxie"],"base_experience":177,"height":9,"weight":273,"id":430,"img":"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/430.png","name":"honchkrow","stats":{"hp":100,"attack":125,"defense":52,"special-attack":105,"special-defense":52,"speed":71},"type":"dark","values":{"top":6,"right":4,"bottom":2,"left":4},"possession":"red"},{"abilities":["flower-veil","triage","natural-cure"],"base_experience":170,"height":1,"weight":3,"id":764,"img":"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/764.png","name":"comfey","stats":{"hp":51,"attack":52,"defense":90,"special-attack":82,"special-defense":110,"speed":100},"type":"fairy","values":{"top":4,"right":1,"bottom":6,"left":6},"possession":"red"}]
const normalizePlayer = (player) => {
    return player.map(item => {
        return [
            item.values.top,
            item.values.right,
            item.values.bottom,
            item.values.left,
        ];
    });
}
export const normalizeData = (payload) => {
    const {player1: initialPlayer1, player2: initialPlayer2, board: initialBoard} = payload;
    const player1 = JSON.parse(initialPlayer1);
    const player2 = JSON.parse(initialPlayer2);
    const board = JSON.parse(initialBoard);
    
    const normalizeBoard = board.reduce((acc, item, index) => {
        const row = Math.floor(index / 3);
        const column = index % 3;

        if (!acc[row]) {
            acc[row] = [];
        }

        if (item.card) {
            acc[row][column] = [item.card.player, item.position];
        } else {
            acc[row][column] = [0];
        }


        return acc;
    }, []);
    
    console.log('####: nB', normalizeBoard);

    return [normalizePlayer(player1), normalizePlayer(player2)];
};
