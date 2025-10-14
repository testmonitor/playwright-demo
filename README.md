# TestMonitor Playwright Reporter Demo

This demo repository showcases how to integrate the [TestMonitor Playwright Reporter](https://www.npmjs.com/package/@testmonitor/playwright-reporter) into your Playwright test suite. It contains example tests that demonstrate automated test reporting to TestMonitor.

## Table of Contents

- [About](#about)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Tests](#running-the-tests)
- [License](#license)

## About

This repository provides a working example of:

- Setting up Playwright with the TestMonitor reporter
- Configuring the reporter in `playwright.config.js`
- Sample test cases that report results to TestMonitor
- Automatic screenshot capture on test failures

## Installation

Before you start, make sure you have [Node.js](https://nodejs.org/) installed (version 18 or higher recommended).

You'll also need Playwright installed. If you don't have it yet, you can install it with:

```bash
npx playwright install
```

Clone this repository and install the dependencies:

```bash
git clone https://github.com/testmonitor/playwright-demo.git
cd playwright-demo
npm install
```

## Configuration

The reporter is already configured in [playwright.config.js](playwright.config.js). Update the configuration with your TestMonitor credentials:

```javascript
reporter: [
  [
    "@testmonitor/playwright-reporter",
    {
      domain: "example.testmonitor.com",  // Replace with your TestMonitor domain
      token: "mytoken",                   // Replace with your Playwright integration token

      // Optional parameters
      // milestoneId: 12,                 // Use this if you want to link to an existing milestone
      // milestoneName: 'Release 2025.4', // Or use this to create or match a milestone by name
      // testEnvironmentId: 3             // ID of the target test environment in TestMonitor
    }
  ]
],
```

To get started, you’ll need a token from your Playwright integration. You can find it on the Playwright integration page of your TestMonitor project settings.

**Configuration options:**

| Option | Required | Description |
|--------|----------|-------------|
| `domain` | Yes | Your TestMonitor instance domain (without https://) |
| `token` | Yes | Your TestMonitor API token |
| `milestoneId` | No | ID of an existing milestone to link test results to |
| `milestoneName` | No | Name of a milestone (will be created if it doesn't exist or matched if it does) |
| `testEnvironmentId` | No | ID of the target test environment in TestMonitor |

## Running the Tests

Run the demo tests using the Playwright CLI:

```bash
npx playwright test
```

The reporter will automatically:

- Create a test run in TestMonitor
- Submit test results (pass/fail status)
- Include screenshots for failed tests
- Report test execution times

### View results

After running the tests, check your TestMonitor instance to see the reported results.

## License

Copyright (c) TestMonitor | we are Cerios B.V. All rights reserved.
