module.exports = {

    tests: [
        {
            name: 'with-long-parameter',
            params: '--jsdom'
        },
        {
            name: 'with-short-parameter',
            params: '-j'
        },
        {
            name: 'with-resource-file',
            rc: {
                jsdom: true
            }
        }
    ]

}
