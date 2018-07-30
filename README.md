# AGILE UI Testing
This project runs UI tests for different parts of the [AGILE-UI](https://github.com/agile-iot/agile-ui) project. It uses [cypress](https://www.cypress.io/), whose documentation can be found [here](https://docs.cypress.io/api/introduction/api.html).
Before starting, run ```npm install``` to install the cypress module.
## 1. Configuration
First adjust the properties in the configuration file ```conf.json```, e. g. the URL of UI and the URL of agile-security to acquire an OAuth2 token.
Furthermore, two users (admin and a less privileged user) and a client must be defined, which need to be added in AGILE in advance.

## 1. Writing tests
To write tests add or modify files in the ```cypress/integration/``` directory. For this you can follow cypress' [documentation](https://www.cypress.io/) on writing tests.
 
## 2. Run tests
Run ```cypress:open``` to start the cypress framework. Chose a file in which your tests are. The tests will start automatically.
