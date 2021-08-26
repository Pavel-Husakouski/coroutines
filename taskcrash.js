// taskcrash.py
//
// An example that shows how the initial scheduler doesn't handle
// task termination correctly.

const {Scheduler} = require('./pyos2');

function *foo() {
    for (let i = 0; i < 5; i++) {
        console.log(`I'm foo`);
        yield;
    }
}

function* bar() {
    while (true) {
        console.log(`I'm bar`);
        yield;
    }
}

sched = new Scheduler();
sched.new(foo());
sched.new(bar());
sched.mainloop(); // no crash in JavaScript