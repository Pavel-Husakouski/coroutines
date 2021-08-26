// ------------------------------------------------------------
// pyos2.py  -  The Python Operating System
//
// Step 2: A Scheduler
// ------------------------------------------------------------


// ------------------------------------------------------------
//                       === Tasks ===
// ------------------------------------------------------------
const {Task} = require('./pyos1');

// ------------------------------------------------------------
//                      === Scheduler ===
// ------------------------------------------------------------
const Queue = Array;

class Scheduler {
    constructor() {
        this.ready = new Queue();
        this.taskmap = {}
    }

    new(target) {
        const newtask = new Task(target);
        this.taskmap[newtask.tid] = newtask;
        this.schedule(newtask);
        return newtask.tid;
    }

    schedule(task) {
        this.ready.push(task);
    }

    mainloop() {
        while (this.taskmap) {
            const task = this.ready.shift();
            const result = task.run();
            this.schedule(task);
        }
    }
}

// ------------------------------------------------------------
//                      === Example ===
// ------------------------------------------------------------
if (require.main === module) {

    // Two tasks
    function* foo() {
        while (true) {
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

    // Run them
    const sched = new Scheduler()
    sched.new(foo());
    sched.new(bar());
    sched.mainloop();
} else {
    module.exports = {Scheduler};
}