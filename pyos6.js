// ------------------------------------------------------------
// pyos6.py  -  The Python Operating System
//
// Added support for task waiting
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
        this.exit_waiting = new Map();
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
        // Notify other tasks waiting for exit
        const list = this.exit_waiting.get(task.tid) || [];
        this.exit_waiting.delete(task.tid);
        for (const t of list) {
            this.schedule(t);
        }
    }

    addExitWaiting(waittid, task) {
        const list = this.exit_waiting.get(waittid) || [];

        list.push(task);
        this.exit_waiting.set(waittid, list);
    }

    waitforexit(task, waittid) {
        if (this.taskmap.get(waittid) != null) {
            this.addExitWaiting(waittid, task);
            return true;
        } else {
            return false;
        }
    }

    schedule(task) {
        this.ready.push(task);
    }

    mainloop() {
        while (this.taskmap.size) {
            const task = this.ready.shift();
            const {done, value: result} = task.run();

            if (result instanceof SystemCall) {
                result.task = task;
                result.shed = this;
                result.handle();
                continue;
            }
            if (done) {
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
const {SystemCall, GetTid} = require('./pyos4');

const {NewTask, KillTask} = require('./pyos5');

// Wait for a task to exit
class WaitTask extends SystemCall {
    constructor(tid) {
        super();
        this.tid = tid
    }

    handle() {
        const result = this.shed.waitforexit(this.task, this.tid)
        this.task.sendval = result
        // If waiting for a non - existent task,
        // return immediately without waiting
        if (!result) {
            this.shed.schedule(this.task)
        }
    }
}

// ------------------------------------------------------------
//                      === Example ===
// ------------------------------------------------------------
if (require.main === module) {

// Two tasks
    function* foo() {
        for (let i = 0; i < 8; i++) {
            console.log(`I'm foo`);
            yield;
        }
    }

    function* main() {
        const child = yield new NewTask(foo());
        yield new WaitTask(child);
        console.log('main done');
    }

    // Run them
    const sched = new Scheduler()
    sched.new(main());
    sched.mainloop();
} else {
    module.exports = {NewTask, KillTask};
}