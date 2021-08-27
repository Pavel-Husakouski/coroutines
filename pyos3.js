// ------------------------------------------------------------
// pyos3.py  -  The Python Operating System
//
// Step 3: Added handling for task termination
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
        this.taskmap = new Map();
    }


    new(target) {
        const newtask = new Task(target);
        this.taskmap.set(newtask.tid, newtask);
        this.schedule(newtask);
        return newtask.tid;
    }

    exit(task) {
        console.log('Task %d terminated', task.tid);
        this.taskmap.delete(task.tid);
    }

    schedule(task) {
        this.ready.push(task);
    }

    mainloop() {
        while (this.taskmap.size) {
            const task = this.ready.shift();
            const result = task.run();
            if(result.done) {
                this.exit(task);
                continue;
            }
            this.schedule(task);
        }
    }
}

// ------------------------------------------------------------
//                      === Example ===
// ------------------------------------------------------------
// ------------------------------------------------------------
//                      === Example ===
// ------------------------------------------------------------
if (require.main === module) {

    // Two tasks
    function* foo() {
        for (let i = 0; i < 5; i++) {
            console.log(`I'm foo`);
            yield;
        }
    }

    function* bar() {
        for (let i = 0; i < 10; i++) {
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
