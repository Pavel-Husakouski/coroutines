//countdown.js
//
// A simple generator function

function* countdown(n) {
    console.log("Counting down from", n);

    while (n > 0) {
        yield n;
        n -= 1
    }
    console.log("Done counting down");

}

if (require.main === module) {
    // Example use
    for(let i of countdown(10)) {
        console.log(i);
    }
} else {
    module.exports = {countdown};
}