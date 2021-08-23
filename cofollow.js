// cofollow.py
//
// A simple example showing how to hook up a pipeline with
// coroutines.   To run this, you will need a log file.
// Run the program logsim.py in the background to get a data
// source.

const {coroutine} = require('./coroutine');
const {TextReader} = require('./text-reader');
const time = require('./time');

function follow(reader, target) {
    while (true) {
        let line = reader.readline();

        if (!line) {
            time.sleep(100);    // Sleep briefly
            continue;
        }
        target.next(line);
    }
}

const printer = coroutine(function* () {
    while (true) {
        const line = yield;

        console.log(line);
    }
});

if (require.main === module) {
    const filename = 'access-log';
    const reader = TextReader.open(filename, TextReader.filesize(filename));

    follow(reader, printer());
} else {
    module.exports = {follow, printer}
}