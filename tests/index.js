var fs = require('fs-extra');
var spawn = require('child_process').spawn;
var chalk = require('chalk');
var jsdiff = require('diff');

var only = process.argv[2];
var cwd = process.cwd();

// copy source
var LIBDIR = __dirname + '/.tmp';
fs.emptyDirSync(LIBDIR);
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
        if (err.message.match(/Cannot find module.*\/config/)) {
            return { tests: [{}] };
        }
        console.log(err);
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
        process.chdir(cwd);
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

    var params = testScript.params.split(' ');
    params.unshift(LIBDIR);

    console.log(chalk.green('\n' + test.name + '$ mokamok ' + testScript.params));

    process.chdir(test.path);

    var childProcess = spawn('node', params);

    childProcess._stdout = '';
    childProcess._stderr = '';

    childProcess._testSnapshot = function(name, value) {
        var oldValue;
        var fname = test.path + '/' + name + '.snap';
        try {
            oldValue = fs.readFileSync(fname, 'utf8').toString();
        } catch (err) {
            oldValue = null;
        }
        value = value.replace(/\(\d*m?s\)/g, '(0ms)');
        if (oldValue === null) {
            fs.writeFileSync(fname, value, 'utf8');
        } else if (oldValue !== value) {
            console.log(chalk.red('Snapshot test failed:'));
            var diff = jsdiff.diffLines(oldValue, value);
            diff.forEach(function (part) {
                var color = part.added ? 'red' : (part.removed ? 'green' : 'grey');
                var sign = part.added ? '\n+' : (part.removed ? '\n-' : '\n ');
                process.stdout.write(chalk[color](('\n' + part
                    .value.replace(/\n$/, '')).replace(/\n/gm, sign)));
            });
            childProcess.kill();
        }
    }

    childProcess.stdout.on('data', function (chunk) {
        chunk = chunk.toString();
        childProcess._stdout += chunk;
        process.stdout.write(chunk);
        if (chunk.trim() === 'Done') {
            childProcess.emit('done');
        }
    });

    childProcess.stderr.on('data', function (chunk) {
        chunk = chunk.toString();
        childProcess._stderr += chunk;
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
