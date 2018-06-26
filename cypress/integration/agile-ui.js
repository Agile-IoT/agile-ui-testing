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

describe('User view policies', function() {
  beforeEach(() => {
    authAndVisitUI()
    cy.wait(3000) //Let react load all state objects
  })

  it('Switch to user overview tab and view first user attributes', function() {
    cy.get('div[value="/"]').get('button').then(tabs => {
      tabs[4].click()
      cy.location('pathname').should('have', '/list/user')
      cy.wait(1500)
      cy.get('.container--app').get('a').then(viewbuttons => {
        viewbuttons[0].click() //First user attributes
        cy.url().should('contain', '/entity/').and('match', /\/user/)
        cy.wait(1500)
        cy.get('#new_password').should('exist')
        cy.get('#old_password').should('exist')
        expand()
        cy.get('span').contains('id').should('be.visible')
      })
    })
  })

  it('Switch to user overview tab and view second user attributes', function() {
    cy.get('div[value="/"]').get('button').then(tabs => {
      tabs[4].click()
      cy.location('pathname').should('have', '/list/user')
      cy.wait(1500)
      cy.get('.container--app').get('a').then(viewbuttons => {
        viewbuttons[3].click() //Second user attributes
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
