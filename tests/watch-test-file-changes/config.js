var fs = require('fs-extra');


var pass;
var testFileName = __dirname + '/__test__/spec.js';
var testFile = fs.readFileSync(testFileName);


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
                            fs.writeFileSync(testFileName, testFile);
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
