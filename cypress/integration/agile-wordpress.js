const wordpressConf = {
  "host": "localhost",
  "adminuser": "agile",
  "adminpassword": "secret"
}

describe('Simple WordPress test', () => {
  it('Login and logout', () => {
    cy.visit(wordpressConf.host)
    cy.visit(wordpressConf.host + '/wp-admin')
    cy.get('#user_login').type(wordpressConf.adminuser)
    cy.get('#user_pass').type(wordpressConf.adminpassword)
    cy.get('#wp-submit').click()
    cy.get('#wp-admin-bar-logout').children().then(elems => {
      cy.wrap(elems).click({force: true})
      cy.url().should('be', wordpressConf.host + '/wp-login.php?redirect_to=http%3A%2F%2Flocalhost%2Fwp-admin%2F&reauth=1')
    })
  })
})

describe('Heavy WordPress test', () => {
  it('Login 100 times and logout', () => {
    for (let i = 0; i < 10; i++) {
      cy.visit(wordpressConf.host)
      cy.visit(wordpressConf.host + '/wp-admin')
      cy.get('#user_login').type(wordpressConf.adminuser)
      cy.get('#user_pass').type(wordpressConf.adminpassword)
      cy.get('#wp-submit').click()
      cy.get('#wp-admin-bar-logout').children().then(elems => {
        cy.wrap(elems).click({force: true})
        cy.url().should('be', wordpressConf.host + '/wp-login.php?redirect_to=http%3A%2F%2Flocalhost%2Fwp-admin%2F&reauth=1')
      })
    }
  })
})