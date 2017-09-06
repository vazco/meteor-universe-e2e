/* global Package:false Npm:false */

Package.describe({
    name: 'universe:e2e',
    version: '1.0.0-beta.1',
    summary: 'Complete end-to-end/acceptance testing solution for Meteor: Mocha/Chai & Chrome Puppeteer',
    git: 'https://github.com/vazco/meteor-universe-e2e',
    documentation: 'README.md',
    testOnly: true
});

Npm.depends({
    mocha: '3.5.0',
    chai: '4.1.2',
    'chai-as-promised': '7.1.1',
    puppeteer: '0.10.2'
});

Package.onUse(api => {
    api.versionsFrom('1.6-beta.25');

    api.use('ecmascript');
    api.use('promise', 'server');

    api.mainModule('client.js', 'client');
    api.mainModule('server.js', 'server');
});
