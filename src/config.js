import fs from 'fs';
import program from 'commander';
import defaultOptions from './default-options.json';
import pkg from '../package.json';


const availableOptions = [
    [ 'm', 'automock', 'mock every module in the project automatically' ],
    [ 'j', 'jsdom', 'use jsdom' ],
    [ 'w', 'watch', 'watch for file changes' ],
    [ 'c', 'coverage', 'generate a code coverage report' ],
    [ 'X', 'coverage-exclude <globs>', 'exclude files from the coverage report', parseList ], 
    [ 'd', 'test-directory <name>', 'test directory name' ],
    [ 'B', 'no-babel', 'disable babel support' ],
    [ 'P', 'babel-presets <presets>', 'Babel presets', parseList ],
    [ 'p', 'babel-plugins <plugins>', 'Babel plugins', parseList ],
    [ 'u', 'update-snapshots', 'Update snapshots' ],
];


function parseList(p) {
    return p.split(',');
}


program.version(pkg.version, '-v, --version');


for (let i = 0; i < availableOptions.length; i++) {
    const o = availableOptions[i];
    program.option(o[0] ? `-${o[0]}, --${o[1]}` : `--${o[1]}`, o[2], o[3]);
}


program.parse(process.argv);


const rc = {};


try {
    Object.assign(rc, JSON.parse(fs.readFileSync('./.mokamokrc', 'utf8')));
} catch(err) {
    // NOOP
}


const parsedOptions = {};


for (let i = 0; i < availableOptions.length; i++) {
    const key = availableOptions[i][1].split(' ')[0].replace(/-./, s => s[1].toUpperCase());
    if (program.hasOwnProperty(key)) {
        parsedOptions[key] = program[key];
    }
}


if (program.babel === false) {
    parsedOptions.babel = false;
}


export const options = Object.assign(defaultOptions, rc, parsedOptions);
