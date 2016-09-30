var fs = require('fs-extra');


var pass;
var testFileName = __dirname + '/--tests--/spec.js';
var testFile = fs.readFileSync(testFileName).toString();


module.exports = {

    tests: [
        {
            name: 'with-long-parameter',
            params: '--watch'
        },
        {
            name: 'with-short-parameter',
            params: '-w'
        }
    ],

    onStart: function (childProcess) {
        var ctx = { ok: false };
        pass = 1;
        childProcess.stdout.on('data', function (chunk) {
            switch (pass) {
                case 1:
                    if (chunk.indexOf('1 failing') !== -1) {
                        setTimeout(function () {
                            fs.writeFileSync(testFileName, testFile.replace('expect(1).to.equal(2);', 'expect(3).to.equal(3);'));
                            pass++;
                        }, 1000);
                    }
                    if (chunk.indexOf('1 passing') !== -1) {
                        setTimeout(function () {
                            childProcess.kill();
                        }, 1000);
                    }
                    break;
                case 2:
                    if (chunk.indexOf('1 passing') !== -1) {
                        fs.writeFileSync(testFileName, testFile);
                        ctx.ok = true;
                        childProcess.kill();
                    }
                    if (chunk.indexOf('1 failing') !== -1) {
                        fs.writeFileSync(testFileName, testFile);
                        setTimeout(function () {
                            childProcess.kill();
                        }, 1000);
                    }
                    break;
            }
        });
        return ctx;
    },

}
