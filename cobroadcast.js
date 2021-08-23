// cobroadcast.py
//
// An example of broadcasting a data stream onto multiple coroutine targets.

const {coroutine} = require('./coroutine');
const {follow, printer} = require('./cofollow');
const {grep} = require('./copipe');
const {TextReader} = require('./text-reader');

const broadcast = coroutine(function* (targets) {
    while (true) {
        const line = yield;

        for (const target of targets) {
            target.next(line);
        }
    }
});

if (require.main === module) {
    const filename = 'access-log';
    const reader = TextReader.open(filename, TextReader.filesize(filename));

    follow(reader, broadcast([
        grep('python', printer()),
        grep('ply', printer()),
        grep('swig', printer())
    ]));
} else {
    module.exports = {broadcast};
}