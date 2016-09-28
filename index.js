require('babel-register')({
    ignore: function (filename) {
        if (filename.indexOf('node_modules/mokamok') !== -1) {
            return false;
        }
        if (filename.indexOf('node_modules/') !== -1) {
            return true;
        }
        return false;
    },
    presets: [
        require.resolve('babel-preset-latest'),
    ],
});

require('./lib/start');
