let wordpressConf = require('../../conf.json')
let path = 'results.json'


describe('WordPress test', () => {

	it('Login 100 times with an admin user and a normal user and logout', () => {
		cy.readFile(path).then((results) => {
			//cy.log(results)
                        cy.log('starting from iteration'+results.admin.logout.length)
			for (let i = results.admin.logout.length; i < 100; i++) {
				//ADMIN USER
				let start = Date.now()
				cy.visit(wordpressConf.host).then(() => {
					results.visit.push(Date.now() - start)
					start = Date.now()
					return cy.visit(wordpressConf.host + '/wp-admin') 
				})
				.then(() => {
					results.login_page.push(Date.now() - start)
					cy.wait(3000);				
					return cy.get('#user_login').should('be.empty')
				}).then(() => {
					return cy.get('#user_pass').should('be.empty')
				}).then(() => {
					return cy.get('#user_login').type(wordpressConf.adminuser)
				}).then(() => {
					return cy.get('#user_pass').type(wordpressConf.adminusersecret)
				}).then(() => {
					start = Date.now()
					return cy.get('#wp-submit').click()
				}).then(() => {
					results.admin.profile.push(Date.now() - start)
					start = Date.now()
					return cy.visit(wordpressConf.host + '/wp-admin')
				}).then(() => {
					results.admin.dashboard.push(Date.now() - start)
					cy.wait(3000);
					start = Date.now()
					return cy.get('#wp-admin-bar-logout').children()
				}).then(elems => {
					start = Date.now()
					cy.wrap(elems).click({force: true}).then(() => {
						cy.url().should('be', wordpressConf.host + '/wp-login.php?redirect_to=http%3A%2F%2Flocalhost%2Fwp-admin%2F&reauth=1')
						results.admin.logout.push(Date.now() - start)
						start = Date.now()
						cy.log('Done with iteration ' + i)
						cy.writeFile("results.json", JSON.stringify(results));
					})
				})


			}
                })
	
	})
})
