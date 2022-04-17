const filescan = require('./filescan').getInstance()
const fileToScan = process.argv.slice(1)[0];
const assert = require('assert').strict;

describe("Basic file scan test", () => {
    it("should be able to do a quickscan successfully", () => {
        return filescan.isClean(fileToScan).then(res => {
            assert.notEqual(res, false);
        })
    })
});
