const Joi = require('joi');

const lvl1PayloadSchema = Joi.object({
  type: Joi.string().required(),
  data: Joi.object().required(),
});

const createRoomSchema = Joi.object({
  userId: Joi.string().required(),
  username: Joi.string().required(),
  roomId: Joi.string(),
  roomname: Joi.string(),
  pokemons: Joi.array().items(
    Joi.object({
      abilities: Joi.array().items(Joi.string()),
      base_experience: Joi.number(),
      height: Joi.number(),
      weight: Joi.number(),
      id: Joi.number().required(),
      img: Joi.string(),
      name: Joi.string().required(),
      stats: Joi.object({
        hp: Joi.number(),
        attack: Joi.number(),
        defense: Joi.number(),
        'special-attack': Joi.number(),
        'special-defense': Joi.number(),
        speed: Joi.number(),
      }),
      type: Joi.string(),
      values: Joi.object({
        top: Joi.number(),
        right: Joi.number(),
        bottom: Joi.number(),
        left: Joi.number(),
      }).required(),
      hits: Joi.array().items(Joi.number()).required(),
    }).required()
  ),
});

const joinRoomSchema = Joi.object({
  userId: Joi.string().required(),
  username: Joi.string().required(),
  roomId: Joi.string().required(),
  roomname: Joi.string(),
  pokemons: Joi.array().items(
    Joi.object({
      abilities: Joi.array().items(Joi.string()),
      base_experience: Joi.number(),
      height: Joi.number(),
      weight: Joi.number(),
      id: Joi.number().required(),
      img: Joi.string(),
      name: Joi.string().required(),
      stats: Joi.object({
        hp: Joi.number(),
        attack: Joi.number(),
        defense: Joi.number(),
        'special-attack': Joi.number(),
        'special-defense': Joi.number(),
        speed: Joi.number(),
      }),
      type: Joi.string(),
      values: Joi.object({
        top: Joi.number(),
        right: Joi.number(),
        bottom: Joi.number(),
        left: Joi.number(),
      }).required(),
      hits: Joi.array().items(Joi.number()).required(),
    }).required()
  ),
});

const playerTurnSchema = Joi.object({
  roomId: Joi.string().required(),
  playerNames: Joi.string().required(),
  move: Joi.object().required(),
  p1: Joi.object().required(),
  p2: Joi.object().required(),
});

const lvl1Validation = (payload) => {
  try {
    lvl1PayloadSchema.validate(payload);
    console.log('Validation success!');
    return true;
  } catch (error) {
    console.log(error);
  }
};

const createRoomValidation = (data) => {
  try {
    createRoomSchema.validate(data);
    console.log('Validation success!');
    return true;
  } catch (error) {
    console.log(error);
  }
};

const joinRoomValidation = (data) => {
  try {
    joinRoomSchema.validate(data);
    console.log('Validation success!');
    return true;
  } catch (error) {
    console.log(error);
  }
};

const playerTurnValidation = (data) => {
  try {
    playerTurnSchema.validate(data);
    console.log('Validation success!');
    return true;
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  lvl1Validation,
  createRoomValidation,
  joinRoomValidation,
  playerTurnValidation,
};
