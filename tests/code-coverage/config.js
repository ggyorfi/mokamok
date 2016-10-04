module.exports = {

    tests: [
        {
            name: 'with-long-parameter',
            params: '--coverage'
        },
        {
            name: 'with-short-parameter',
            params: '-c'
        },
        {
            name: 'with-resource-file',
            rc: {
                coverage: true
            }
        }
    ],

    onStart: function (childProcess) {
        childProcess.on('done', function () {
            childProcess._testSnapshot('stdout', childProcess._stdout);
        });
    }

}
