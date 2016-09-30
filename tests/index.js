var fs = require('fs-extra');
var exec = require('child_process').exec;
var chalk = require('chalk');

var only = process.argv[2];

// copy source
var LIBDIR = __dirname + '/.tmp';
fs.emptyDirSync(LIBDIR);
fs.copySync(__dirname + '/../index.js', LIBDIR + '/index.js');
fs.copySync(__dirname + '/../package.json', LIBDIR + '/package.json');
fs.copySync(__dirname + '/../lib', LIBDIR + '/lib');

var tests = [];

fs.readdir(__dirname, function (err, files) {
    if (err) {
        console.log(err);
        process.exit(1);
    }
    files.forEach(function (name) {
        var path = __dirname + '/' + name;
        if (fs.statSync(path).isDirectory()) {
            if (name !== '.tmp' && (!only || name === only)) {
                var config = readConfig(path + '/config');
                config.tests.forEach(function (test) {
                    tests.push({
                        name: (name + (test.name ? '-' + test.name : '')).trim(),
                        path: path,
                        config: Object.assign({
                            params: '',
                            onStart: function () {}
                        }, config, test)
                    });
                });

            }
        }
    });
    next(0);
});

function readConfig(file) {
    try {
        var config = require(file);
        if (!Array.isArray(config.tests)) {
            config.tests = [config];
        }
        return config;
    } catch (err) {
        console.log(err);
        return { tests: [{}] };
    }
}

function next(idx) {
    if (idx >= tests.length) {
        console.log(chalk.green('\nAll done.'));
        try {
            fs.removeSync(LIBDIR);
        } catch (err) {
            // NOOP
        }
        return;
    }

    var test = tests[idx];
    var testScript = test.config;

    if (testScript.rc) {
        fs.writeFile(test.path + '/.mokamokrc', JSON.stringify(testScript.rc));
    } else {
        try {
            fs.unlinkSync(test.path + '/.mokamokrc');
        } catch (err) {
            // NOOP
        }
    }

    var cmd = 'node ' + LIBDIR + ' ' + testScript.params;

    console.log(chalk.green('\n' + test.name + '$ mokamok ' + testScript.params));

    var childProcess = exec(cmd, {
        cwd: test.path,
    });

    childProcess.stdout.on('data', function (chunk) {
        process.stdout.write(chunk);
    });

    childProcess.stderr.on('data', function (chunk) {
        process.stderr.write(chalk.red(chunk));
    });

    var ctx = testScript.onStart(childProcess);

    childProcess.on('exit', function(code, signal) {
        if (ctx ? !ctx.ok : code !== 0) {
            console.log(chalk.red('\nFailed.'));
            try {
                fs.removeSync(LIBDIR);
            } catch (err) {
                // NOOP
            }
            process.exit(code);
        }
        try {
            fs.unlinkSync(test.path + '/.mokamokrc');
        } catch (err) {
            // NOOP
        }
        next(idx + 1);
    });

}
