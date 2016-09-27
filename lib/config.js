import fs from 'fs';
import program from 'commander';
import defaultOptions from './default-options.json';

const availableOptions = [
    [ 'm',  'automock', 'mock every module in the project automatically' ],
    [ 'j',  'jsdom', 'use jsdom' ],
    [ 'w',  'watch', 'watch for file changes' ],
];


program.version('0.0.1-beta', '-v, --version');


for (var i = 0; i < availableOptions.length; i++) {
    const o = availableOptions[i];
    program.option(`-${o[0]} --${o[1]}`, o[2]);
}


program.parse(process.argv);


const rc = {};


try {
    Object.assign(rc, JSON.parse(fs.readFileSync('./.mokamokrc', 'utf8')));
} catch(err) {
    // NOOP
}


const parsedOptions = {};


for (var i = 0; i < availableOptions.length; i++) {
    const key = availableOptions[i][1];
    if (program.hasOwnProperty(key)) {
        parsedOptions[key] = program[key];
    }
}


export const options = Object.assign(defaultOptions, rc, parsedOptions);

console.log(options);
