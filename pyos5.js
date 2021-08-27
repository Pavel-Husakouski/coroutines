// ------------------------------------------------------------
// pyos5.py  -  The Python Operating System
//
// Step 5: Added system calls for simple task management
// ------------------------------------------------------------

// ------------------------------------------------------------
//                       === Tasks ===
// ------------------------------------------------------------

const {Task} = require('./pyos1');

// ------------------------------------------------------------
//                      === Scheduler ===
// ------------------------------------------------------------

const {Scheduler, SystemCall, GetTid} = require('./pyos4');

/// ------------------------------------------------------------
//                   === System Calls ===
// ------------------------------------------------------------

// Create a new task
class NewTask extends SystemCall {
    constructor(target) {
        super();
        this.target = target
    }

    handle() {
        const tid = this.shed.new(this.target);
        this.task.sendval = tid;
        this.shed.schedule(this.task);
    }
}

// Kill a task
class KillTask extends SystemCall {
    constructor(tid) {
        super();
        this.tid = tid;
    }

    handle() {
        const task = this.shed.taskmap.get(this.tid);
        if (task) {
            task.target.return();
            this.task.sendval = true;
        } else {
            this.task.sendval = false;
        }
        this.shed.schedule(this.task);
    }
}

// ------------------------------------------------------------
//                      === Example ===
// ------------------------------------------------------------
if (require.main === module) {

// Two tasks
    function* foo() {
        while (true) {
            const mytid = yield new GetTid();
            console.log(`I'm foo`, mytid);
            yield;
        }
    }

    function* main() {
        const child = yield new NewTask(foo()); // Launch new task
        for (let i = 0; i < 1; i++) {
            yield;
        }
        yield new KillTask(child); // Kill the task
        console.log('main done');
    }

    // Run them
    const sched = new Scheduler()
    sched.new(main());
    sched.mainloop();
} else {
    module.exports = {NewTask, KillTask};
}