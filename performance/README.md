# Running Performance Tests

* `npm run perf` 

- Run this command to execute performance tests on configured browsers and NodeJS, after building bundles. The results will be saved to CSV files in the `performance/out` directory.

       Runs performance tests on configured browsers and NodeJS, after building bundles.

* `gulp perfBuild` 

- Use this command to build bundles for browser/device testing.

       Build bundles for browser/device testing.

Browser tests are run through Karma, which should be installed locally as an npm devDependency.

The results will be saved to CSV files in the `performance/out` directory, and they can be interpreted for performance analysis.

## Interpreting Results

To run tests using different browser configurations:

`karma start --browsers=[comma separated list of browsers]`

For example:

`karma start --browsers=Firefox, Chrome`

It's worth noting that running performance tests in parallel on multiple browsers may impact results.

# Updating Performance Tests

* `performance/browser.js`

       Defines the tests and configuration for browser performance tests. This file can be modified to add or enhance performance tests.

* `performance/node.js`

       Defines the tests and configuration for NodeJS performance tests. This file can be modified to add or enhance performance tests.

