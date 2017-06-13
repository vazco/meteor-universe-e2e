/* global Package:false Npm:false */

Package.describe({
    name: 'universe:e2e',
    version: '0.2.0',
    summary: 'Complete end-to-end/acceptance testing solution for Meteor: Mocha/Chai & Selenium/WebdriverIO',
    git: 'https://github.com/vazco/meteor-universe-e2e',
    documentation: 'README.md',
    testOnly: true
});

Npm.depends({
    mocha: '3.4.2',
    chai: '4.0.2',
    'chai-as-promised': '6.0.0',
    webdriverio: '4.8.0',
    'selenium-standalone': '6.4.1'
});

Package.onUse(function (api) {
    api.versionsFrom('1.4.2');

    api.use('ecmascript');
    api.use('promise', 'server');

    api.mainModule('client.js', 'client');
    api.mainModule('server.js', 'server');
});
