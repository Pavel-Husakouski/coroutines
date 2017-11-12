// coroutine.js
//
// A decorator function that takes care of starting a coroutine
// automatically on call.

function coroutine(func) {
    function start() {
        let cr = func(...arguments);

        cr.next();

        return cr;
    }

    return start;
}

// Example use
if (require.main === module) {
    let grep = coroutine(function* (pattern) {
            console.log(`Looking for ${pattern}`);

            while (true) {
                let line = (yield);

                if (line.indexOf(pattern) !== -1) {
                    console.log(line)
                }
            }
        }
    );

    let g = grep("python");
    // Notice how you don't need an extra next() call here
    g.next("Yeah, but no, but yeah, but no")
    g.next("A series of tubes")
    g.next("python generators rock!")
} else {
    module.exports = {coroutine};
}