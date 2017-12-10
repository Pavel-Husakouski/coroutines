// bogus.js
//
// Bogus example of a generator that produces and receives values
function* countdown(n) {
    console.log("Counting down from", n);

    while (n >= 0) {
        let newvalue = (yield n);
        // If a new value got sent in, reset n with it

        if (newvalue != null) {
            n = newvalue;
        } else {
            n -= 1;
        }
    }
};

if (require.main === module) {
    // The holy grail countdown
    let c = countdown(5);
    for(let x of c) {
        console.log(x);
        if(x === 5) {
            c.next(3);
        }
    }
} else {
    module.exports = {bogus};
}
