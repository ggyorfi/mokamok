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
            rc: {
                jsdom: true
            }
        }
    ]

}
