Package.describe({
    name: 'universe:e2e',
    version: '0.0.1',
    summary: 'Complete end-to-end/acceptance testing solution for Meteor: Mocha/Chai & Selenium/WebdriverIO',
    git: '',
    documentation: 'README.md',
    testOnly: true
});

Npm.depends({
    mocha: '3.1.2',
    chai: '3.5.0',
    webdriverio: '4.4.0',
    'selenium-standalone': '5.8.0'
});

Package.onUse(function (api) {
    api.versionsFrom('1.4.2');

    api.use('ecmascript');
    api.use('promise', 'server');

    api.mainModule('client.js', 'client');
    api.mainModule('server.js', 'server');
});
