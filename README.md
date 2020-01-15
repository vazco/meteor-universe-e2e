# Vazco / Universe E2E ![vazco-package-blue.svg](https://img.shields.io/badge/vazco-package-blue.svg?logo=data%3Aimage%2Fpng%3Bbase64%2CiVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAABmJLR0QA%2FwD%2FAP%2BgvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4QMfFAIRHb8WQgAAAY1JREFUKM%2BNkLFrGgEUxr87FMnpnXdIqxi1Q3VxachgSbcOgRBCTMbgH9CCW%2BjSUminSpEmBEIpHW7rkCmQSSjEKVOGEAK5bOFyk4c5TMRTyZ1fl5aK9ai%2F8b334%2Ft4QBBmLQmz9jpoLSKYPQCfYdaezi6atTKAMoAYgK1pJ8LkQPr5JspHsbO%2BFilAEADQArCA3Ftn%2FC40KebPO4Ln37peNNxrFxPSXTaW9cPiewDbgYkkXwBYB3B5dHES3W8cpM254ctOJhr3wsKqs7Zj%2FdOZZITkMf9yT%2FKq3e18eHf47fmTT5XE1H%2BQ3GAwDyQ%2FkkxMSvLvhP%2FxZVLc42zYJBf%2FSPMkW57nsd%2Fv03VdDgYDjkajIPkryVDIdd1Xtm0%2Fdhznptvtmr7vu5IkRRRFySiKko%2FH45BlebzgJoBdodls%2FjAM49SyrIau69etVmsIIFStVnPFYvFZoVBY1jRtJZlMpjRNm5MkCaIofhfq9XrMMIyeruuc9u1KpRIulUqqqqpLqqqW0%2Bl0OZVKyb8ANqUwunhV3dcAAAAASUVORK5CYII%3D&style=flat-square)

Complete end-to-end/acceptance testing solution for Meteor based on Mocha & Puppeteer

*This package is currently in public beta, but we use it in production at [Vazco.eu](http://vazco.eu) with success so far.*

<!-- toc -->

- [Why?](#why)
- [Installation](#installation)
- [Usage](#usage)
  * [Setting up the project](#setting-up-the-project)
  * [Running tests in watch mode](#running-tests-in-watch-mode)
  * [Running tests in Continuous Integration mode](#running-tests-in-continuous-integration-mode)
    + [Usage with Bitbucket Pipelines](#usage-with-bitbucket-pipelines)
  * [Meteor "full application test mode" caveats](#meteor-full-application-test-mode-caveats)
- [Writing tests](#writing-tests)
  * [Example test suites](#example-test-suites)
- [Exported variables](#exported-variables)
- [Configuration](#configuration)
- [Batteries included](#batteries-included)
  * [Mocha](#mocha)
  * [Puppeteer](#puppeteer)
- [Changelog](#changelog)
- [License](#license)

<!-- tocstop -->

### Why?

From [Wikipedia](https://en.wikipedia.org/wiki/End-to-end_testing):

> End-to-end Testing (E2E) is type of software testing used to validate different integrated components of an application by testing the flow from start to end. It also tests the behavior according to the user requirements.

From [Meteor guide](https://guide.meteor.com/testing.html#acceptance-testing):

> Acceptance testing is the process of taking an unmodified version of our application and testing it from the “outside” to make sure it behaves in a way we expect. Typically if an app passes acceptance tests, we have done our job properly from a product perspective.

There is other software that would allow you to perform E2E/acceptance tests of your Meteor app (e.g. Chimp, Nightwatch, Starrynight) but we found them really cumbersome.

This package is using test drivers introduced with Meteor 1.3 and integrates more seamlessly with the whole Meteor stack.

Everything is managed inside your Meteor app, so when writing test specs you can use everything you would normally use in your app.

### Installation

`universe:e2e` is a [test driver package](https://guide.meteor.com/testing.html#driver-packages) for Meteor.

You need to `meteor add` it to your app, but it does nothing unless you specify it while starting Meteor in test mode.

Additionally, you'll need to have [Mocha](https://mochajs.org/) and [Puppeteer](https://github.com/GoogleChrome/puppeteer) installed using npm (probably in `devDependencies`):

```
meteor add universe:e2e
meteor npm install --save-dev mocha puppeteer
```

This package won't be bundled with your production build, nor loaded during normal development (it has a `testOnly` flag).

### Usage

#### Setting up the project

Once the test driver and npm dependencies are installed, you need to add some setup code and write first tests.

We recommend a structure where all acceptance tests are stored inside a directory that is not loaded by default (e.g inside `imports/e2e-tests`) and only a single entry point with all imports in order is available to the app (e.g. a `main.app-tests.js` file, see caveats for more info).

Inside this file, you need to call a setup function as early as possible in the app lifecycle

```javascript
import {setup} from 'meteor/universe:e2e';

setup(/** extra options go here **/)
  .then(() => {/** test environment is ready **/})
  .catch(() => {/** something went wrong **/});
```

For available options check [Configuration](#configuration) section below.

Complete setup for a working application can be found in the example project - [E2E Simple Todos](https://github.com/vazco/meteor-e2e-simple-todos).

#### Running tests in watch mode

To run tests you need to start Meteor in [full app test mode](https://guide.meteor.com/testing.html#test-modes).

Example command could look like this (you probably want to add this in [`npm scripts`](https://docs.npmjs.com/cli/run-script)):

```
meteor test --full-app --driver-package universe:e2e --raw-logs
```

Raw logs flag is optional, but it helps with displaying test results.

In watch mode app will start and reload on any file change (either in app code or in tests).
You need to stop it as you would normally stop Meteor in development mode.

If you want your tests running at the same time you work on your app, you can start them on a different port (e.g. using `--port 4000` flag).
Or work on the same instance, if dropping database data after you stop the test runner (not between Meteor restarts) is ok for you.

#### Running tests in Continuous Integration mode

This package is developed to use with CI servers in mind.

In this scenario, you probably want to run the tests once and exit with code depending on tests results.
This could be achieved with:

```
CI=1 meteor test --full-app --driver-package universe:e2e --once --raw-logs
```

Note `--once` flag and the `CI` environment variable - it must be set to a truthy value (but it usually already is by CI providers).

Otherwise, app won't stop with correct exit code when tests end.

##### Usage with Bitbucket Pipelines

Example of a `bitbucket-pipelines.yml` file that could be used to automate testing on the Pipelines CI.

```yml
image: vazco/meteor-pipelines

pipelines:
  default:
    - step:
        script:
          - meteor npm install
          - meteor test --full-app --driver-package universe:e2e --once --raw-logs

```

`vazco/meteor-pipelines` is a Docker image optimized for Meteor and E2E testing, and can be used on other Continuous Integration systems, if you don't mind the name :)

#### Meteor "full application test mode" caveats

Meteor in this mode will start your application as it normally would (but with empty DB after each start, it keeps DB data during restarts in watch mode).

It will also load files matching `*.app-test[s].*` and `*.app-spec[s].*`, e.g. `my-test.app-tests.js`, so we will put our testing code over there.

`Meteor.isE2E` flag is set to `true` (useful if you want to distinguish between tests made for this package and for some other test driver)

### Writing tests

Tests can be written like regular Mocha test suites, the only difference is that API like `describe` or `it` must be imported from `meteor/universe:e2e` atmosphere package.

Inside the test cases, you can use Puppeteer API (with exported `browser` and `page` objects) to manipulate the browser and simulate user behavior.
You can spawn new browser instances and pages (tabs) if test cases require such action.

At any point, you can use extra libraries like `chai`, `faker` or even any function from your codebase - the tests are running INSIDE the Meteor app (server side) so you can do anything you are able to do inside Meteor project. One example could be database reset or fixtures right inside Mocha's `before` callback. Possibilities are limitless.

#### Example test suites

```javascript
import {describe, it, page, setValue} from 'meteor/universe:e2e';
import {expect} from 'chai';
import faker from 'faker';

describe('Registration', () => {
    /* ... */
    it('should fill and send register form', async () => {
        // Generate random username and password
        const password = faker.internet.password();
        const username = faker.internet.userName();

        // Fill form and submit using Puppeteer API
        await page.type('#login-username', username);
        await page.type('#login-password', password);
        await page.type('#login-password-again', password);
        await page.click('#login-buttons-password');
    });

    it('should be logged in after registration', async () => {
        // Execute function in the browser context
        await page.waitFor(() => Meteor.user() !== null, {timeout: 2000});
    });
    /* ... */
});

describe('Tasks', () => {
    it('should have new task input', async () => {
        await page.waitFor('form.new-task input', {timeout: 1000});
    });

    it('should be possible to add new task', async () => {
        const text = faker.lorem.sentence();

        // Insert text into form and submit it
        await setValue({page}, 'form.new-task input', text);
        await page.keyboard.press('Enter');

        // Check (using XPath as an example) if a new task with this text will show up
        await page.waitForXPath(`//span[@data-test='task-text'][contains(.,'${text}')]`, {timeout: 1000});
    });

    it('should be marked as private', async () => {
        // Get first task handle
        const task = await page.$('[data-test="task-item"]:nth-child(1)');

        // There should not be a class name
        expect(await page.evaluate(task => task.className, task)).to.equal('');

        // Click button and mark as private
        await task.$('button.toggle-private').then(el => el.click());

        // There should be a private class right now
        expect(await page.evaluate(task => task.className, task)).to.equal('private');

        // Cleanup task reference
        await task.dispose();
    });
});
```

More use cases like this can be found in the example project - [E2E Simple Todos](https://github.com/vazco/meteor-e2e-simple-todos) (based on the Meteor/React tutorial)

### Exported variables

A complete list of public API available as functions exported **on the server side**:

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

- Utilities
    - `createBrowser` (documentation can be found at `lib/puppeteer.js`)
    - `onTest`
    - `onInterrupt`

- Puppeteer helpers (new helpers will be added over time, PR are welcome)
    - `resizeWindow`
    - `setValue`

Helpers' code and documentation can be found inside `helpers/` directory.

### Configuration

Some parts could be configured to better suit your needs.

Your custom configuration can be provided to the `setup` method.

Example config could look like this:

```js
import {setup} from 'meteor/universe:e2e';

setup({
    mocha: { // example customization of Mocha settings
        reporter: 'spec',
        timeout: 30000,
        // ... other Mocha options, full list can be found at lib/mocha.js
    },
    browser: { // options passed to `createBrowser`
        isCI: false, // force environment default, leave this out for auto-detection
        createDefaultBrowser: true, // set to false to prevent browser creation and call `createBrowser` on your own
        launchOptions: { // options passed to Puppeteer launch settings
            slowMo: 50
            // ... full list can be found at https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#puppeteerlaunchoptions
        }
    }
});
```

All keys are optional, you can just call `setup()` and use sane defaults.

### Batteries included

This package intention is to give everything required to write acceptance tests from within the Meteor app.

Below you find quick info about the software we use to make this package work for you out of the box.

If you need any extra libs/helpers (`chai`, `faker` etc.) you can import them from npm as you would normally do in a Meteor app.

#### Mocha

> Mocha is a feature-rich JavaScript test framework, making asynchronous testing simple and fun. Mocha tests run serially, allowing for flexible and accurate reporting, while mapping uncaught exceptions to the correct test cases.

Mocha is used to run all test suites in `universe:e2e`.

If you want some test to be executed, you better have it inside `describe`/`it` block.

Docs can be found at [mochajs.org](https://mochajs.org/)

If you want to set custom reporter etc. you can provide options under the `mocha` section of our config.
List of available options can be found in [Mocha Wiki](https://github.com/mochajs/mocha/wiki/Using-mocha-programmatically#set-options).
Please note that only `ui` supported at the moment is `tdd`. If you want to use `bdd` please let us know with your use case.

#### Puppeteer

> Puppeteer is a library which provides a high-level API to control headless Chrome. It can also be configured to use full (non-headless) Chrome. Most things that you can do manually in the browser can be done using Puppeteer.

Puppeteer is used for browser automation, unlike most E2E test runners, which are based on Selenium.
Our solution is more powerful but limited to only one browser family (Chromium and Chrome).
Depending on your case this may or may not be an issue for you.

Puppeteer API should be familiar to people using other browser testing frameworks.
Universe E2E creates an instance of Puppeteer's `browser` an `page` for you, so you can them to manipulate spawned browser with Puppeteer's API.

Universe E2E v0.2 and earlier was based on Selenium and WebDriverIO, so [you can check it out](https://github.com/vazco/meteor-universe-e2e/tree/v0.2.0) if your looking for such solution, but we're not providing support for it anymore.

### Changelog

Version history can be found at [releases page](https://github.com/vazco/meteor-universe-e2e/releases).

### License

<img src="https://vazco.eu/banner.png" align="right">

**Like every package maintained by [Vazco](https://vazco.eu/), Universe E2E is [MIT licensed](https://github.com/vazco/uniforms/blob/master/LICENSE).**
