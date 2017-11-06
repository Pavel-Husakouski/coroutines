function random() {
    return Math.random();
}

function randint(from, to) {
    return from + 0|random()*to;
}

module.exports = {random, randint};