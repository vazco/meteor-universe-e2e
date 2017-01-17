Package.describe({
    name: 'universe:e2e',
    version: '0.1.0',
    summary: 'Complete end-to-end/acceptance testing solution for Meteor: Mocha/Chai & Selenium/WebdriverIO',
    git: 'https://github.com/vazco/meteor-universe-e2e',
    documentation: 'README.md',
    testOnly: true
});

Npm.depends({
    mocha: '3.2.0',
    chai: '3.5.0',
    'chai-as-promised': '6.0.0',
    webdriverio: '4.6.1',
    'selenium-standalone': '5.10.0'
});

Package.onUse(function (api) {
    api.versionsFrom('1.4.2');

    api.use('ecmascript');
    api.use('promise', 'server');

    api.mainModule('client.js', 'client');
    api.mainModule('server.js', 'server');
});
