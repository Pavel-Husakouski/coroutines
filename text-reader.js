const fs = require('fs');
const {Buffer} = require('buffer');

const BlockSize = 1024;

class TextReader {
    constructor(filename, origin = 0, blockSize = BlockSize) {
        this._position = origin;
        this._fd = fs.openSync(filename, 'a+');
        this._rest = '';
        this._lines = [];
        this._blockSize = blockSize;
    }

    rest() {
        return this._rest;
    }

    readline() {
        if (this._lines.length > 0) {
            return this._lines.shift();
        }

        do {
            let {text, bytesRead} = TextReader.readBlock(this._fd, this._blockSize, this._position);

            if (text === null) {
                break;
            }

            let {lines, rest} = TextReader.extractLines(this._rest + text);

            this._lines.push(...lines);
            this._position += bytesRead;
            this._rest = rest;

            if(bytesRead === this._blockSize && lines.length === 0) {
                continue;
            }
            break;
        } while (true);


        return this._lines.shift();
    }

    static filesize(filename) {
        const stats = fs.statSync(filename);
        const size = stats.size;

        return size;
    }

    static readBlock(fd, blockSize, position) {
        let readBuffer = Buffer.alloc(blockSize);
        let bytesRead = fs.readSync(fd, readBuffer, 0, blockSize, position);
        let text = bytesRead > 0 ? readBuffer.slice(0, bytesRead).toString('utf8') : null;

        return {text, bytesRead};
    }

    static extractLines(text) {
        let array = text.split(/\n|\r\n/);
        let lines = array.slice(0, -1);
        let rest = array.slice(-1)[0];

        return {lines, rest}
    }
}

if (require.main === module) {
    let file = new TextReader('access-log', 0, 5);

    for(let x = file.readline(); x!=null; x = file.readline()) {
        console.log(x);
    }
    console.log(file.rest());
} else {
    module.exports = {TextReader};
}