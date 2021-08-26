// ------------------------------------------------------------
// pyos1.py  -  The Python Operating System
//
// Step 1: Tasks
// ------------------------------------------------------------

// This object encapsulates a running task.

class Task {
    static taskid = 0

    constructor(target) {
        Task.taskid += 1;
        this.tid = Task.taskid; // Task ID
        this.target = target; // Target coroutine
        this.sendval = null; // Value to send
    }

    // Run a task until it hits the next yield statement
    run() {
        return this.target.next(this.sendval)
    }
}

// ------------------------------------------------------------
//                       == Example ==
// ------------------------------------------------------------
if (require.main === module) {
    // A simple generator/coroutine function

    function* foo() {
        console.log('Part 1');
        yield;
        console.log('Part 2');
        yield;
    }

    const t1 = new Task(foo());
    console.log('Running foo()');
    t1.run();
    console.log('Resuming foo()');
    t1.run();
} else {
    module.exports = {Task};
}