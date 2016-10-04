module.exports = {

    onStart: function (childProcess) {
        childProcess.on('done', function () {
            childProcess._testSnapshot('stdout', childProcess._stdout);
        });
    }

}
