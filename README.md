# AGILE UI Testing
This project runs UI tests for different parts of the [AGILE-UI](https://github.com/agile-iot/agile-ui) project. It uses [cypress](https://www.cypress.io/), whose documentation can be found [here](https://docs.cypress.io/api/introduction/api.html).
Before starting, run ```npm install``` to install the cypress module.
## 1. Configuration
First adjust the properties in the configuration file ```conf.json```, e. g. the URL of UI and the URL of agile-security to acquire an OAuth2 token.
Furthermore, two users (admin and a less privileged user) and a client must be defined, which need to be added in AGILE in advance.


The configuration file also contains information about the each tab in AGILE UI, e. g.:

    "profile": { // the profile of the current user
      "index": 2, // position of the tab in the menu
      "path": "/entity/:id/user" // path of the view
                                 // :id is a placeholder and will be 
                                 // replaced by the id of the current user
    },
    
## 2. Writing tests
To write tests add or modify files in the ```cypress/integration/``` directory. For this you can follow cypress' [documentation](https://www.cypress.io/) on writing tests.
 
## 3. Run tests
Run ```cypress:open``` to start the cypress framework. Chose a file in which your tests are. The tests will start automatically.


## Known issues
Cypress has an [open issue](https://github.com/cypress-io/cypress/issues/1955) that describes a bug with the memory allocation. This usually happens only if cypress is running for long time.
If the error occurs the test stops and does not recover. However, it is possible to close the current test and start it again from the beginning.