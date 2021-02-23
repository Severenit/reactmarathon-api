import STARTER from './startPack.json';

export const BOARD_MIN = [
    {
        position: 1,
        card: null,
    },
    {
        position: 2,
        card: null,
    },
    {
        position: 3,
        card: null,
    },
    {
        position: 4,
        card: null,
    },
    {
        position: 5,
        card: null,
    },
    {
        position: 6,
        card: null,
    },
    {
        position: 7,
        card: null,
    },
    {
        position: 8,
        card: null,
    },
    {
        position: 9,
        card: null,
    }
];

export const BOARD = [
    {
        position: 1,
        card: null,
        side: [
            {
                pos: 2,
                weak: 'left'
            },
            {
                pos: 4,
                weak: 'top'
            }
        ]
    },
    {
        position: 2,
        card: null,
        side: [
            {
                pos: 1,
                weak: 'right'
            },
            {
                pos: 3,
                weak: 'left'
            },
            {
                pos: 5,
                weak: 'top'
            },
        ]
    },
    {
        position: 3,
        card: null,
        side: [
            {
                pos: 2,
                weak: 'right'
            },
            {
                pos: 6,
                weak: 'top'
            },
        ]
    },
    {
        position: 4,
        card: null,
        side: [
            {
                pos: 1,
                weak: 'bottom'
            },
            {
                pos: 5,
                weak: 'left'
            },
            {
                pos: 7,
                weak: 'top'
            },
        ]
    },
    {
        position: 5,
        card: null,
        side: [
            {
                pos: 2,
                weak: 'bottom'
            },
            {
                pos: 4,
                weak: 'right'
            },
            {
                pos: 6,
                weak: 'left'
            },
            {
                pos: 8,
                weak: 'top'
            },
        ]
    },
    {
        position: 6,
        card: null,
        side: [
            {
                pos: 3,
                weak: 'bottom'
            },
            {
                pos: 5,
                weak: 'right'
            },
            {
                pos: 9,
                weak: 'top'
            },
        ]
    },
    {
        position: 7,
        card: null,
        side: [
            {
                pos: 4,
                weak: 'bottom'
            },
            {
                pos: 8,
                weak: 'left'
            },
        ]
    },
    {
        position: 8,
        card: null,
        side: [
            {
                pos: 5,
                weak: 'bottom'
            },
            {
                pos: 7,
                weak: 'right'
            },
            {
                pos: 9,
                weak: 'left'
            },
        ]
    },
    {
        position: 9,
        card: null,
        side: [
            {
                pos: 6,
                weak: 'bottom'
            },
            {
                pos: 8,
                weak: 'right'
            },
        ]
    }
];

export {
    STARTER
};
