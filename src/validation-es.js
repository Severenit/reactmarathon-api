// import Validator from 'fastest-validator';
const Validator = require('fastest-validator');

const v = new Validator();

const everyMessageSchema = {
  type: { type: 'string' },
  data: { type: 'object', strict: false },
};

const createRoomSchema = {
  userId: { type: 'string' },
  username: { type: 'string' },
  roomId: { type: 'uuid', strict: false },
  roomname: { type: 'string', strict: false },
  pokemons: {
    type: 'array',
    items: {
      type: 'object',
      props: {
        abilities: { type: 'array', items: 'string' },
        base_experience: { type: 'number' },
        height: { type: 'number' },
        weight: { type: 'number' },
        id: { type: 'number' },
        img: { type: 'string' },
        name: { type: 'string' },
        stats: {
          type: 'object',
          props: {
            hp: { type: 'number' },
            attack: { type: 'number' },
            defense: { type: 'number' },
            'special-attack': { type: 'number' },
            'special-defense': { type: 'number' },
            speed: { type: 'number' },
          },
        },
        type: { type: 'string' },
        values: {
          type: 'object',
          props: {
            top: { type: 'number' },
            right: { type: 'number' },
            bottom: { type: 'number' },
            left: { type: 'number' },
          },
        },
        hits: { type: 'array', items: 'number' },
      },
    },
  },
};

const joinRoomSchema = {
  userId: { type: 'string' },
  username: { type: 'string' },
  roomId: { type: 'uuid' },
  roomname: { type: 'string' },
  pokemons: {
    type: 'array',
    items: {
      type: 'object',
      props: {
        abilities: { type: 'array', items: 'string' },
        base_experience: { type: 'number' },
        height: { type: 'number' },
        weight: { type: 'number' },
        id: { type: 'number' },
        img: { type: 'string' },
        name: { type: 'string' },
        stats: {
          type: 'object',
          props: {
            hp: { type: 'number' },
            attack: { type: 'number' },
            defense: { type: 'number' },
            'special-attack': { type: 'number' },
            'special-defense': { type: 'number' },
            speed: { type: 'number' },
          },
        },
        type: { type: 'string' },
        values: {
          type: 'object',
          props: {
            top: { type: 'number' },
            right: { type: 'number' },
            bottom: { type: 'number' },
            left: { type: 'number' },
          },
        },
        hits: { type: 'array', items: 'number' },
      },
    },
  },
};

const playerTurnSchema = {
  roomId: { type: 'uuid' },
  position: { type: 'number' },
  card: {
    type: 'object',
    props: {
      player: { type: 'number' },
      abilities: { type: 'array', items: 'string' },
      base_experience: { type: 'number' },
      height: { type: 'number' },
      weight: { type: 'number' },
      id: { type: 'number' },
      img: { type: 'string' },
      name: { type: 'string' },
      stats: {
        type: 'object',
        props: {
          hp: { type: 'number' },
          attack: { type: 'number' },
          defense: { type: 'number' },
          'special-attack': { type: 'number' },
          'special-defense': { type: 'number' },
          speed: { type: 'number' },
        },
      },
      type: { type: 'string' },
      values: {
        type: 'object',
        props: {
          top: { type: 'number' },
          right: { type: 'number' },
          bottom: { type: 'number' },
          left: { type: 'number' },
        },
      },
      hits: { type: 'array', items: 'number' },
      possession: { type: 'string' },
    },
  },
};

const everyMessageValidation = v.compile(everyMessageSchema);
const createRoomValidation = v.compile(createRoomSchema);
const joinRoomValidation = v.compile(joinRoomSchema);
const playerTurnValidation = v.compile(playerTurnSchema);
export {
  everyMessageValidation,
  createRoomValidation,
  joinRoomValidation,
  playerTurnValidation,
};
