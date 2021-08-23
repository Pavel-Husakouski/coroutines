// follow.py
//
// A generator that follows a log file like Unix 'tail -f'.
//
// Note: To see this example work, you need to apply to
// an active server log file.  Run the program "logsim.js"
// in the background to simulate such a file.  This program
// will write entries to a file "access-log".

const time = require('./time');
const {TextReader} = require('./text-reader');

function* follow(filename) {
    const file = TextReader.open(filename, TextReader.filesize(filename));

    while (true) {
        let line = file.readline();

        if (!line) {
            time.sleep(100);    // Sleep briefly
            continue;
        }
        yield line;
    }
}

if (require.main === module) {
    const filename = "access-log";

    for (let x of follow(filename)) {
        console.log(x);
    }
} else {
    module.exports = {follow};
}

