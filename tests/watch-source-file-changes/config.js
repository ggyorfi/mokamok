var fs = require('fs-extra');


var pass;
var sourceFileName = __dirname + '/test.js';
var sourceFile = fs.readFileSync(sourceFileName);


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
        pass = 1;
        childProcess.stdout.on('data', function (chunk) {
            switch (pass) {
                case 1:
                    if (chunk.trim().indexOf('1 passing') === 0) {
                        setTimeout(function () {
                            fs.writeFileSync(sourceFileName, sourceFile);
                        }, 1000);
                        pass++;
                    }
                    break;
                case 2:
                    if (chunk.trim().indexOf('1 passing') === 0) {
                        childProcess.kill();
                    }
                    break;
            }
        });
    },

}
