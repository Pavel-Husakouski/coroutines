// cobroadcast.py
//
// An example of broadcasting a data stream onto multiple coroutine targets.

const {follow, printer} = require('./cofollow');
const {grep} = require('./copipe');
const {broadcast} = require('./cobroadcast');
const {TextReader} = require('./text-reader');

if (require.main === module) {
    const filename = 'access-log';
    const reader = TextReader.open(filename, TextReader.filesize(filename));
    const p = printer();

    follow(reader, broadcast([
        grep('python', p),
        grep('ply', p),
        grep('swig', p)
    ]));
}