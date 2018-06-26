var conf = require('../../conf.json')

var auth_options =  {
  method: 'POST',
  url: conf.url,
  auth: {
    user: conf.client,
    pass: conf.clientsecret
  },
  form: true,
  body: {
    grant_type: 'password',
    username: conf.user,
    password: conf.usersecret
  }
}

function authAndVisitUI() {
  return new Promise(() => {cy.request(auth_options).then(res => {
    var token = res.body.access_token
    cy.visit('http://localhost:2000?token=' + token)
    })
  })
}

function expand() {
  return  cy.location().then(loc => {
    var parts = loc.pathname.split('/')
    var id = parts.find(part => {return part.includes('!@!')})
    cy.get('#' + id.replace('!@!', '-')).find('button').click()
  })
}

describe('User view privileges', () => {
  beforeEach(() => {
    authAndVisitUI()
    cy.wait(3000) //Let react load all state objects
  })

  it('Add and update attribute to own user entity and delete it', () => {
    cy.get('#navigation').get('button').then(tabs => {
      var workingtab = conf.tabs.profile
      tabs[workingtab.index].click()
      cy.url().should('contain', '/entity/').and('match', /\/user/)
      expand()
      cy.get('#cypress').should('not.exist')
      cy.get('span').contains('cypress').should('not.exist')
      cy.get('span').contains('cypress.value').should('not.exist')
      cy.get('#new-attribute').type('cypress')
      cy.get('#new-attribute-value').type('cypress.value')
      cy.get('#new-attribute-submit').click()
      cy.get('#cypress').should('exist')
      cy.get('#cypress_value').should('have.value', 'cypress.value')
      cy.get('#cypress_value').clear()
      cy.get('#cypress_value').type('updated.value')
      cy.get('#navigation')
      cy.get('#cypress_value').should('have.value', 'updated.value')
      cy.get('#delete_cypress').click()
      cy.get('#cypress').should('not.exist')
    })
  })

  it('Switch to user overview tab and view first user attributes', () => {
    cy.get('#navigation').get('button').then(tabs => {
      var workingtab = conf.tabs.user
      tabs[workingtab.index].click()
      cy.location('pathname').should('have', '/list/user')
      cy.wait(1500)
      cy.get('.container--app').get('a').then(viewbuttons => {
        viewbuttons[workingtab.buttons.view].click() //First user attributes
        cy.url().should('contain', '/entity/').and('match', /\/user/)
        cy.wait(1500)
        cy.get('#new_password').should('exist')
        cy.get('#old_password').should('exist')
        expand()
        cy.get('span').contains('id').should('be.visible')
      })
    })
  })

  it('Switch to user overview tab and view second user attributes', () => {
    cy.get('#navigation').get('button').then(tabs => {
      var workingtab = conf.tabs.user
      tabs[workingtab.index].click()
      cy.location('pathname').should('have', '/list/user')
      cy.wait(1500)
      cy.get('.container--app').get('a').then(viewbuttons => {
        viewbuttons[workingtab.buttons.view + Object.keys(workingtab.buttons).length].click() //Second user attributes
        cy.url().should('contain', '/entity/').and('match', /\/user/)
        cy.wait(1500)
        cy.get('#new_password').should('exist')
        cy.get('#old_password').should('not.exist')
        expand()
        cy.get('span').contains('id').should('be.visible')
      })
    })
  })
})