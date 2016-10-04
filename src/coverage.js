export default function ceoverage(callback) {
    const istanbul = require('istanbul');
    const collector = new istanbul.Collector();
    const reporter = new istanbul.Reporter();
    collector.add(__coverage__);
    reporter.addAll([ 'text', 'lcov', 'clover', 'html' ]);
    reporter.write(collector, false, callback);
}
