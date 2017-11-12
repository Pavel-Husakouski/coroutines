// an ugly way to have blocking sleep API

function sleep(time) {
    const stop = Date.now();

    //warning! just for demo purposes
    while(Date.now() < stop + time) {
        // do nothing
    }
}

module.exports = {sleep};
