require('babel-register')({
    presets: [
        require.resolve('babel-preset-es2015'),
    ],
});

require('./lib/start');
