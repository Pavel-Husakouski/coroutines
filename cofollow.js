function start(generator) {
    generator.next();

    return generator;
}

function* printer() {
    while(true) {
        let line = yield;

        console.log(line);
    }
}
