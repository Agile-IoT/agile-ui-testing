let conf = require('../../conf.json')

let auth_options = {
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
  return new Promise(() => {
    cy.request(auth_options).then(res => {
      let token = res.body.access_token
      cy.visit('http://localhost:2000?token=' + token)
    })
  })
}

function expand() {
  return cy.location().then(loc => {
    let parts = loc.pathname.split('/')
    let id = parts.find(part => {
      return part.includes('!@!')
    })
    cy.get('#' + id.replace('!@!', '-')).find('button').click()
  })
}

describe('User view privileges', () => {
  beforeEach(() => {
    authAndVisitUI()
    cy.wait(3000) //Let react load all state objects
  })

  it('Create, assign and delete group', () => {
    cy.get('#navigation').get('button').then(tabs => {
      tabs[conf.tabs.groups.index].click()
      cy.get('#cypress-agile-local').should('not.exist')
    })

    //Create group
    cy.get('#navigation').get('button').then(tabs => {
      tabs[conf.tabs.groups.index].click()
      let regex = new RegExp(conf.tabs.groups.path.replace(/:[a-zA-Z]*/, '.*'))
      cy.url().should('match', regex)
      cy.wait(500)
      cy.get('#new_entity_button').click()
      cy.get('#root_group_name').type('cypress-group')
      cy.get('button[type="submit"]').click()
      cy.wait(500)
    })

    //Assign group
    cy.get('#navigation').get('button').then(tabs => {
      tabs[conf.tabs.userlist.index].click()
      cy.location('pathname').should('eq', conf.tabs.userlist.path)
      cy.get('#group_agile-agile-local').click()
      cy.get('#root_groups').should('exist')
      cy.get('#root_groups').contains('cypress-group').find(':checkbox').should('be.not.checked')
      cy.get('#root_groups').contains('cypress-group').find(':checkbox').check()
      cy.get('button[type="submit"]').then(submit => {
        submit.click()
        cy.wait(500)
        tabs[conf.tabs.groups.index].click()
      })
      cy.get('#view_cypress-group').click()
      cy.wait(1000)
      cy.get('.container--app').should('contain', 'agile!@!agile-local')
    })

    //Remove user from group
    cy.get('#navigation').get('button').then(tabs => {
      tabs[conf.tabs.userlist.index].click()
      cy.location('pathname').should('eq', conf.tabs.userlist.path)
      cy.get('#group_agile-agile-local').click()
      cy.get('#root_groups').should('exist')
      cy.get('#root_groups').contains('cypress-group').find(':checkbox').should('be.checked')
      cy.get('#root_groups').contains('cypress-group').find(':checkbox').uncheck()
      cy.get('button[type="submit"]').then(submit => {
        submit.click()
        cy.wait(500)
        tabs[conf.tabs.groups.index].click()
      })
      cy.get('#view_cypress-group').click()
      cy.get('.container--app').should('not.contain', 'agile!@!agile-local')
    })

    //Delete group
    cy.get('#navigation').get('button').then(tabs => {
      tabs[conf.tabs.groups.index].click()
      cy.get('#cypress-group').should('exist')
      cy.get('#delete_cypress-group').click()
      cy.wait(1000)
      cy.get('#cypress-group').should('not.exist')
    })
  })

  it('Create and delete entities', () => {
    cy.get('#navigation').get('button').then(tabs => {
      tabs[conf.tabs.userlist.index].click()
      cy.get('#cypress-agile-local').should('not.exist')
    })

    cy.get('#navigation').get('button').then(tabs => {
      tabs[conf.tabs.userlist.index].click()
      let regex = new RegExp(conf.tabs.userlist.path.replace(/:[a-zA-Z]*/, '.*'))
      cy.url().should('match', regex)
      cy.wait(1500)
      cy.get('#new_entity_button').click()
      cy.location('pathname').should('eq', conf.views.addUser.path)
      cy.get('#root_user_name').type('cypress')
      cy.get('#root_auth_type').select('agile-local')
      cy.get('#root_password').type('secret')
      cy.get('#root_role').select('admin')
      cy.get('button[type="submit"]').click()
      cy.wait(3000)

    })

    cy.get('#navigation').get('button').then(tabs => {
      let workingtab = conf.tabs.userlist
      tabs[workingtab.index].click()
      cy.get('#cypress-agile-local').should('exist')
      cy.get('#delete_cypress-agile-local').click()
      cy.wait(3000)
      cy.get('#cypress-agile-local').should('not.exist')
    })
  })

  it('Add and update attribute to own user entity and delete it', () => {
    cy.get('#navigation').get('button').then(tabs => {
      let workingtab = conf.tabs.profile
      tabs[workingtab.index].click()
      let regex = new RegExp(workingtab.path.replace(/:[a-zA-Z]*/, '.*'))
      cy.url().should('match', regex)
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
      let workingtab = conf.tabs.userlist
      tabs[workingtab.index].click()
      cy.location('pathname').should('eq', workingtab.path)
      cy.wait(1500)
      cy.get('.container--app').get('a').then(viewbuttons => {
        viewbuttons[workingtab.buttons.view].click() //First user attributes
        let regex = new RegExp(conf.views.user.path.replace(/:[a-zA-Z]*/, '.*'))
        cy.url().should('match', regex)
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
      let workingtab = conf.tabs.userlist
      tabs[workingtab.index].click()
      cy.location('pathname').should('eq', workingtab.path)
      cy.wait(1500)
      cy.get('.container--app').get('a').then(viewbuttons => {
        viewbuttons[workingtab.buttons.view + Object.keys(workingtab.buttons).length].click() //Second user attributes
        let regex = new RegExp(conf.views.user.path.replace(/:[a-zA-Z]*/, '.*'))
        cy.url().should('match', regex)
        cy.wait(1500)
        cy.get('#new_password').should('exist')
        cy.get('#old_password').should('not.exist')
        expand()
        cy.get('span').contains('id').should('be.visible')
      })
    })
  })
})