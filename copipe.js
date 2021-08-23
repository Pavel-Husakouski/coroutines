// copipe.py
//
// A simple example showing how to hook up a pipeline with
// coroutines.   To run this, you will need a log file.
// Run the program logsim.py in the background to get a data
// source.

const {coroutine} = require('./coroutine');
const {follow, printer} = require('./cofollow');
const {TextReader} = require('./text-reader');

const grep = coroutine(function *(pattern, target) {
    while (true) {
        const line = yield;

        if(line.indexOf(pattern) !== -1) {
            target.next(line);
        }
    }
})

if (require.main === module) {
    const filename = 'access-log';
    const reader = TextReader.open(filename, TextReader.filesize(filename));

    follow(reader, grep('python', printer()));
} else {
    module.exports = {grep}
}