
# Technical QA Assessment


A take-home automation testing assignment for QA interview.

## Sumary of this framework
* This is API Automation Testing using Playwright framework one of the powerfull testing framework

## Getting started

### Pre-requisites
* <a href="https://nodejs.org/it/download/current" target="_blank">Download and install Node.js</a>
* Download and install any Text Editor like <a href="https://code.visualstudio.com/download" target="_blank">Visual Code</a>

### Setup Scripts 
* Clone the repository into a folder
* Go to Project root directory and install Dependency: `npm install`
* All the dependencies from package.json would be installed in node_modules folder.

### Install Visual Code Extension (Optional)
* <a href="https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright" target="_blank">Playwright Test for VSCode</a>

## Run Test
* Go to the Project root directory and run command: `npm test`

## Run Single Spec and show the report
* Go to the Project root directory and run command: e.g:  `npx playwright test tests/api-image.spec.ts && npx playwright show-report`

## How to view default Playwright HTML report
* After runing finished one html report would be automatically gennerated and displayed if has any case failed
* You can generate the report manually by using this command: `npx playwright show-report`
* Go to the Project root directory: `./playwright-report/index.html`

### Playwright HTML Test Report
![Playwright HTML Test Report](./resources/report.png?raw=true "Playwright HTML Test Report")