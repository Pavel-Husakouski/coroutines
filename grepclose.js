// grepclose.js
//
// A coroutine that catches the close() operation

const {coroutine} = require('./coroutine');

const grep = coroutine(function* (pattern) {
    console.log(`Looking for ${pattern}`);

    try {
        while (true) {
            let line = (yield);

            if (line.indexOf(pattern) !== -1) {
                console.log(line)
            }
        }
    } finally {
        console.log("Going away. Goodbye");
    }
});

// Example use
if (require.main === module) {
    let g = grep("python");
    g.next("Yeah, but no, but yeah, but no")
    g.next("A series of tubes")
    g.next("python generators rock!")
    g.return();
} else {
    module.exports = {grep};
}
