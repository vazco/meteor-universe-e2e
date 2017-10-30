/*
 * Quite hacky solution but works for now
 * Require strings must be statically analyzed, so no loops or conditional checks are possible
 * Indents on error messages are on purpose this way to look better in the console
 */

const supportedVersions = {
    mocha: '4'
};

let mochaVersion;
try {
    mochaVersion = require('mocha/package.json').version;
} catch (e) {
    throw new Error(
        `[universe:e2e] Mocha must be installed to run the tests.
                      You can do it with command:
                      npm i -D mocha@${supportedVersions.mocha}
    `);
}

if (!mochaVersion.startsWith(supportedVersions.mocha)) {
    throw new Error(
        `[universe:e2e] Installed Mocha version (${mochaVersion}) is not supported at the moment.
                      You can install compatible version with:
                      npm i -D mocha@${supportedVersions.mocha}
    `);
}
