// pipeline.js
//
// An example of setting up a processing pipeline with generators

function* grep(pattern, lines) {
    for (let line of lines) {
        if (line.indexOf(pattern) != -1) {
            yield line;
        }
    }
}

if (require.main === module) {
    let {follow} = require('./follow');

    // Set up a processing pipe : tail -f | grep python
    let loglines = follow('access-log');
    let lines = grep("python", loglines);

    // Pull results out of the processing pipeline
    for (let line of lines) {
        console.log(line);
    }
} else {
    module.exports = {grep};
}