/* global Package:false Npm:false */

Package.describe({
    name: 'universe:e2e',
    version: '0.3.0-rc.1',
    summary: 'Complete end-to-end/acceptance testing solution for Meteor based on Mocha & Puppeteer',
    git: 'https://github.com/vazco/meteor-universe-e2e',
    documentation: 'README.md',
    testOnly: true
});

Package.onUse(api => {
    api.versionsFrom('1.6-rc.5');

    api.use('ecmascript');
    api.use('promise', 'server');
    api.use('universe:test-hooks');

    api.mainModule('check-dependencies.js', 'server');
    api.mainModule('server.js', 'server');
    api.mainModule('client.js', 'client');
});
