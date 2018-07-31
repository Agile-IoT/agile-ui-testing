let wordpressConf = require('../../conf.json')
let results = {
	visit: [],
	login_page: [],
	admin: {
		login: [],
		dashboard: [],
		profile: [],
		edit_user: [],
		logout: [],
	},
	user: {
		login: [],
		dashboard: [],
		profile: [],
		edit_user: [],
		logout: []
	}
}
describe('WordPress test', () => {
	it('Login 100 times with an admin user and a normal user and logout', () => {
		for (let i = 0; i < 100; i++) {
			//ADMIN USER
			let start = Date.now()
			cy.visit(wordpressConf.host).then(() => {
				results.visit.push(Date.now() - start)
				start = Date.now()
			})
			cy.visit(wordpressConf.host + '/wp-admin').then(() => {
				results.login_page.push(Date.now() - start)
			})
			cy.get('#user_login').type(wordpressConf.adminuser)
			cy.get('#user_pass').type(wordpressConf.adminusersecret).then(() => {
				start = Date.now()
			})
			cy.get('#wp-submit').click().then(() => {
				results.admin.login.push(Date.now() - start)
				start = Date.now()
			})
			cy.visit(wordpressConf.host + '/wp-admin/profile.php' , {failOnStatusCode: false}).then(() => {
				results.admin.profile.push(Date.now() - start)
				start = Date.now()
			}) // profile
			cy.visit(wordpressConf.host + '/wp-admin/user-edit.php?user_id=2&wp_http_referer=%2Fwp-admin%2Fusers.php', {failOnStatusCode: false}).then(() => {
				results.admin.edit_user.push(Date.now() - start)
				start = Date.now()
			})  // edit_user #2
			cy.visit(wordpressConf.host + '/wp-admin').then(() => {
				results.admin.dashboard.push(Date.now() - start)
				start = Date.now()
			})  // dashboard
			cy.get('#wp-admin-bar-logout').children().then(elems => {
				start = Date.now()
				cy.wrap(elems).click({force: true}).then(() => {
					cy.url().should('be', wordpressConf.host + '/wp-login.php?redirect_to=http%3A%2F%2Flocalhost%2Fwp-admin%2F&reauth=1')
					results.admin.logout.push(Date.now() - start)
					start = Date.now()
				})
			})


			//NORMAL USER
			cy.visit(wordpressConf.host).then(() => {
				results.visit.push(Date.now() - start)
				start = Date.now()
			})
			cy.visit(wordpressConf.host + '/wp-admin').then(() => {
				results.login_page.push(Date.now() - start)
			})
			cy.get('#user_login').type(wordpressConf.user)
			cy.get('#user_pass').type(wordpressConf.usersecret).then(() => {
				start = Date.now()
			})
			cy.get('#wp-submit').click().then(() => {
				results.user.login.push(Date.now() - start)
				start = Date.now()
			})
			cy.visit(wordpressConf.host + '/wp-admin/profile.php' , {failOnStatusCode: false}).then(() => {
				results.user.profile.push(Date.now() - start)
				start = Date.now()
			}) // profile
			cy.visit(wordpressConf.host + '/wp-admin/user-edit.php?user_id=2&wp_http_referer=%2Fwp-admin%2Fusers.php', {failOnStatusCode: false}).then(() => {
				results.user.edit_user.push(Date.now() - start)
				start = Date.now()
			})  // edit_user #2
			cy.visit(wordpressConf.host + '/wp-admin').then(() => {
				results.user.dashboard.push(Date.now() - start)
			})  // dashboard
			cy.get('#wp-admin-bar-logout').children().then(elems => {
				start = Date.now()
				cy.wrap(elems).click({force: true}).then(() => {
					cy.url().should('be', wordpressConf.host + '/wp-login.php?redirect_to=http%3A%2F%2Flocalhost%2Fwp-admin%2F&reauth=1')
					results.user.logout.push(Date.now() - start)
					cy.log(JSON.stringify(results.user))
					cy.writeFile("results.json", JSON.stringify(results));
				})
			})
		}
	})
})