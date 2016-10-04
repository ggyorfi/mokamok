module.exports = {

    tests: [
        {
            name: 'with-long-parameter',
            params: '--coverage'
        }
    ],

    onStart: function (childProcess) {
        childProcess.on('done', function () {
            childProcess._testSnapshot('out', childProcess._stdout);
        });
    },

    other: [
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
    ]

}
