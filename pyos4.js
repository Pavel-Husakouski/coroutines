// ------------------------------------------------------------
    // pyos4.py  -  The Python Operating System
//
// Step 4: Introduce the idea of a "System Call"
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
            const {done, value: result} = task.run();

            if(result instanceof SystemCall) {
                result.task = task;
                result.shed = this;
                result.handle();
                continue;
            }
            if(done) {
                this.exit(task);
                continue;
            }
            this.schedule(task);
        }
    }
}

/// ------------------------------------------------------------
//                   === System Calls ===
// ------------------------------------------------------------

class SystemCall {
    handle() {
    }
}

class GetTid extends SystemCall {
    handle() {
        this.task.sendval = this.task.tid;
        this.shed.schedule(this.task)
    }
}

// ------------------------------------------------------------
    //                      === Example ===
// ------------------------------------------------------------
if (require.main === module) {

// Two tasks
    function* foo() {
        for (let i = 0; i < 5; i++) {
            const mytid = yield new GetTid();
            console.log(`I'm foo`, mytid);
            yield;
        }
    }

    function* bar() {
        for (let i = 0; i < 10; i++) {
            const mytid = yield new GetTid();
            console.log(`I'm bar`, mytid);
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