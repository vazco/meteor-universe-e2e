/* global Package:false Npm:false */

Package.describe({
    name: 'universe:e2e',
    version: '0.3.0',
    summary: 'Complete end-to-end/acceptance testing solution for Meteor, based on Mocha & Puppeteer',
    git: 'https://github.com/vazco/meteor-universe-e2e',
    documentation: 'README.md',
    testOnly: true
});

Package.onUse(api => {
    api.versionsFrom('1.6');

    api.use('ecmascript');
    api.use('promise', 'server');
    api.use('universe:test-hooks@1.0.0-rc.1');

    api.mainModule('check-dependencies.js', 'server');
    api.mainModule('server.js', 'server');
    api.mainModule('client.js', 'client');
});
