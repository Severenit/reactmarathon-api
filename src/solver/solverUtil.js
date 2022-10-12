export function randomInt(from, to) {
    return ((Math.random() * (to - from)) | 0) + from;
}

function shuffle([...arr]) {
    const len = arr.length;
    for (let i = 0; i < len; i++) {
        const e = arr[i];
        const n = randomInt(i, len);
        arr[i] = arr[n];
        arr[n] = e;
    }

    return arr;
}
