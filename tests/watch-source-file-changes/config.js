var fs = require('fs-extra');


var pass;
var sourceFileName = __dirname + '/test.js';
var sourceFile = fs.readFileSync(sourceFileName).toString();


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
                            fs.writeFileSync(sourceFileName, sourceFile.replace('return 2;', 'return 1;'));
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
                        fs.writeFileSync(sourceFileName, sourceFile);
                        ctx.ok = true;
                        childProcess.kill();
                    }
                    if (chunk.indexOf('1 failing') !== -1) {
                        fs.writeFileSync(sourceFileName, sourceFile);
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
