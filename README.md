# Universe:E2E

Complete end-to-end/acceptance testing solution for Meteor based on Mocha & Puppeteer

*This package is currently in public beta, but we use it in [Vazco.eu](http://vazco.eu) projects with success so far.*

<!-- toc -->

<!-- tocstop -->

### Why?

From [Wikipedia](https://en.wikipedia.org/wiki/End-to-end_testing):

> End-to-end Testing (E2E) is type of software testing used to validate different integrated components of an application by testing the flow from start to end. It also tests the behavior according to the user requirements.

From [Meteor guide](https://guide.meteor.com/testing.html#acceptance-testing):

> Acceptance testing is the process of taking an unmodified version of our application and testing it from the “outside” to make sure it behaves in a way we expect. Typically if an app passes acceptance tests, we have done our job properly from a product perspective.

There are other software that would allow you to perform E2E/acceptance tests of your Meteor app (e.g. Chimp, Nightwatch, Starrynight) but we found them really cumbersome.

This package is using test drivers introduced with Meteor 1.3 and integrates more seamlessly with the whole Meteor stack.

Everything is managed inside your Meteor app, so when writing test specs you can use everything you would normally use in your app.

### Installation

`universe:e2e` is a [test driver package](https://guide.meteor.com/testing.html#driver-packages) for Meteor.

You need to `meteor add` it to your app, but it does nothing unless you specify it while starting Meteor in test mode.

Additionally you'll need to have [mocha](https://mochajs.org/) and [puppeteer](https://github.com/GoogleChrome/puppeteer) installed using npm (probably in `devDependencies`):

```
meteor add universe:e2e
meteor npm install --save-dev mocha puppeteer
```

This package won't be bundled with your production build, nor loaded during normal development (it has a `testOnly` flag).

### Usage

#### Setting up the project

> Introduction coming soon...

#### Running tests in watch mode

To run tests you need to start Meteor in [full app test mode](https://guide.meteor.com/testing.html#test-modes).

Example command could look like this (you probably want to add this in [`npm scripts`](https://docs.npmjs.com/cli/run-script)):

```
meteor test --full-app --driver-package universe:e2e --raw-logs
```

Raw logs flag is optional, but it helps with displaying test results.

In watch mode app will start and reload on any file change (either in app code or in tests).
You need to stop it as you would normally stop Meteor in development mode.

If you want your tests running at the same time you work on your app, you can start them on different port (e.g. using `--port 4000` flag).

#### Running tests in Continuous Integration mode

This package is developed to use with CI servers in mind.

In this scenario you probably want to run the tests once and exit with code depending on tests results.
This could be achieved with:

```
CI=1 meteor test --full-app --driver-package universe:e2e --once --raw-logs
```

Note `--once` flag and the `CI` environment variable - it must be set to truthy value (but it usually already is by CI providers).

Otherwise app won't stop with correct exit code when tests end.

##### Usage with Bitbucket Pipelines

> Introduction coming soon...

#### Meteor "full application test mode" caveats

Meteor in this mode will start your application as it normally would (but with empty DB after each start, it keeps DB data during restarts in watch mode).

It will also load files matching `*.app-test[s].*` and `*.app-spec[s].*`, e.g. `my-test.app-tests.js`, so we will put our testing code over there.

`Meteor.isE2E` flag is set to `true` (useful if you want to distinguish between tests made for this package and for some other test driver)

### Writing tests

> Examples coming soon...

### Exported variables

Complete list of available exported variables **on the server side**:

- Mocha API
    - `after`
    - `afterEach`
    - `before`
    - `beforeEach`
    - `context`
    - `describe`
    - `it`
    - `specify`
    - `xcontext`
    - `xdescribe`
    - `xit`
    - `xspecify`

- Helpers
    - `createBrowser`
    - `onTest`
    - `onInterrupt`

### Configuration

Some parts could be configured to better suite your needs.

Configuration is done via [Meteor settings](https://docs.meteor.com/api/core.html#Meteor-settings) under `universe:e2e` section.

Example config could look like this:

```json
{
  "universe:e2e": {
    "mocha": {
      "reporter": "nyan"
    }
  }
}
```

More information about configuration options in next section.

### Batteries included

This package intention is to give everything required to write acceptance tests from within the Meteor app.

Below you find quick info about software we use to make this package work for you out of the box.

If you need any extra libs/helpers (`chai`, `faker` etc.) you can import them from npm as you would normally do in a Meteor app.

#### Mocha

> Mocha is a feature-rich JavaScript test framework, making asynchronous testing simple and fun. Mocha tests run serially, allowing for flexible and accurate reporting, while mapping uncaught exceptions to the correct test cases.

Mocha is used to run all test suites in `universe:e2e`.

If you want some test to be executed you better have it inside `describe`/`it` block.

Docs can be found at [mochajs.org](https://mochajs.org/)

If you want to set custom reporter etc. you can provide options under `mocha` section of our config.
List of available options can be found in [Mocha Wiki](https://github.com/mochajs/mocha/wiki/Using-mocha-programmatically#set-options).  
Please not that only `ui` supported at the moment is `tdd`. If you want to use `bdd` please let us know.

#### Puppeteer

> Puppeteer is a library which provides a high-level API to control headless Chrome. It can also be configured to use full (non-headless) Chrome.

Introduction coming soon...

### Changelog and roadmap

For planed roadmap and changes introduced in each version please check [the Github Project](https://github.com/vazco/meteor-universe-e2e/projects/1)

