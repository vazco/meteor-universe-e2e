import Mocha from 'mocha';

// Create new Mocha instance
export const mocha = new Mocha({
    reporter: 'spec',
    timeout: 30000, // 30 sec
    useColors: true,

    // BDD is only supported mode at the moment
    ui: 'bdd'
});

// Trick to catch all Mocha "global" functions to a variable
const globals = {};
mocha.suite.emit('pre-require', globals, undefined, mocha);

// If we want to use named exports then we must list all variables
export const {
    after,
    afterEach,
    before,
    beforeEach,
    context,
    describe,
    it,
    specify,
    xcontext,
    xdescribe,
    xit,
    xspecify
} = globals;

/**
 * Used to set options on Mocha after the instance was created (but before the tests are run)
 * @param {Mocha} mocha - Mocha instance to apply options to
 * @param {String} ui - BDD is the only supported Mocha UI interface mode
 * @param {String} reporter - reporter instance, defaults to `spec`
 * @param {String} timeout - timeout in milliseconds
 * @param {String} retries - number of times to retry failed tests
 * @param {String} bail - bail on the first test failure
 * @param {String} slow - milliseconds to wait before considering a test slow
 * @param {String} ignoreLeaks - ignore global leaks
 * @param {String} fullTrace - display the full stack-trace on failing
 * @param {String} useColors - emit color output
 * @void
 */
export const setMochaOptions = (mocha, {ui, reporter, timeout, retries, bail, slow, ignoreLeaks, fullTrace, useColors} = {}) => {
    if (ui && ui !== 'bdd') {
        throw new Error('BDD is the only supported Mocha UI interface mode');
    }
    if(reporter) {
        mocha.reporter(reporter);
    }
    if(timeout) {
        mocha.timeout(timeout);
    }
    if(bail) {
        mocha.bail(bail);
    }
    if(useColors) {
        mocha.useColors(useColors);
    }
    if(retries) {
        mocha.retries(retries);
    }
    if(slow) {
        mocha.slow(slow);
    }
    if(ignoreLeaks) {
        mocha.ignoreLeaks(ignoreLeaks);
    }
    if(fullTrace) {
        mocha.fullTrace(fullTrace);
    }
};