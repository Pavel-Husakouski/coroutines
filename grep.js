// grep.js
//
// A very simple coroutine

function* grep(pattern) {
    console.log(`Looking for ${pattern}`);

    while(true) {
        let line = (yield);

        if(line.indexOf(pattern) !== -1) {
            console.log(line)
        }
    }
}

// Example use
if (require.main === module) {
    let g = grep("python");
    g.next();
    g.next("Yeah, but no, but yeah, but no");
    g.next("A series of tubes");
    g.next("python generators rock!");
} else {
    module.exports = {grep}
}