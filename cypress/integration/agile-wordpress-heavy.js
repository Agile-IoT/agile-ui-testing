let wordpressConf = require('../../conf.json')

describe('WordPress test', () => {
  it('Login 100 times with an admin user and a normal user and logout', () => {
    for (let i = 0; i < 100; i++) {
      cy.visit(wordpressConf.host)
      cy.visit(wordpressConf.host + '/wp-admin')
      cy.get('#user_login').type(wordpressConf.adminuser)
      cy.get('#user_pass').type(wordpressConf.adminusersecret)
      cy.get('#wp-submit').click()
      cy.get('#wp-admin-bar-logout').children().then(elems => {
        cy.wrap(elems).click({force: true})
        cy.url().should('be', wordpressConf.host + '/wp-login.php?redirect_to=http%3A%2F%2Flocalhost%2Fwp-admin%2F&reauth=1')
      })
      cy.visit(wordpressConf.host)
      cy.visit(wordpressConf.host + '/wp-admin')
      cy.get('#user_login').type(wordpressConf.user)
      cy.get('#user_pass').type(wordpressConf.usersecret)
      cy.get('#wp-submit').click()
      cy.url().should('be', wordpressConf.host + '/wp-admin/profile.php')
      cy.get('body').should('contain', 'Sorry, you are not allowed to edit this user.')
      cy.visit(wordpressConf.host + '/wp-admin')
      cy.get('#wp-admin-bar-logout').children().then(elems => {
        cy.wrap(elems).click({force: true})
        cy.url().should('be', wordpressConf.host + '/wp-login.php?redirect_to=http%3A%2F%2Flocalhost%2Fwp-admin%2F&reauth=1')
      })
    }
  })
})