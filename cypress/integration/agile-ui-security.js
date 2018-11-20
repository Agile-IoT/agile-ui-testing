let conf = require('../../conf.json')

let admin_auth = {
  method: 'POST',
  url: conf.TOKEN_URL,
  auth: {
    user: conf.client,
    pass: conf.clientsecret
  },
  form: true,
  body: {
    grant_type: 'password',
    username: conf.adminuser,
    password: conf.adminusersecret
  }
}

let user_auth = {
  method: 'POST',
  url: conf.TOKEN_URL,
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

function adminAuthAndVisitUI() {
  return new Promise(() => {
    cy.request(admin_auth).then(res => {
      let token = res.body.access_token
      cy.visit(conf.UI_URL + '?token=' + token)
    })
  })
}

function userAuthAndVisitUI() {
  return new Promise(() => {
    cy.request(user_auth).then(res => {
      let token = res.body.access_token
      cy.visit(conf.UI_URL + '?token=' + token)
    })
  })
}

function expand(group) {
  return cy.location().then(loc => {
    cy.wait(1000)
    let parts = loc.pathname.split('/')

    if(!group) {
      let id = parts.find(part => {
        return part.includes('!@!')
      })
      cy.get('#' + id.replace('!@!', '-')).click('left')
    } else {
      let owner = parts.find(part => {
        return part.includes('!@!')
      })
      let id = parts[parts.length - 1]
      cy.get('#' + id + '-' + owner.replace('!@!', '-')).click('left')
    }
  })
}

describe('Security User', () => {
  beforeEach(() => {
    userAuthAndVisitUI()
    cy.wait(3000) //Let react load all state objects
  })

  it('Create, assign and delete group', () => {
    let tabs = undefined
    cy.get('#navigation').get('button').then(t => {
      tabs = t
      tabs[conf.tabs.groups.index].click()
      return cy.get('#cypress-agile-local').should('not.exist')
    }).then(( )=> {
      //Create group
      return cy.get('#navigation').get('button')
    }).then(t => {
      tabs = t
      tabs[conf.tabs.groups.index].click()
      let regex = new RegExp(conf.tabs.groups.path.replace(/:[a-zA-Z]*/, '.*'))
      cy.url().should('match', regex)
      cy.wait(500)
      cy.get('#new_entity_button').click()
      cy.get('#root_group_name').type('cypress-group')
      cy.get('button[type="submit"]').click()
      cy.wait(500)
      return cy.get('#navigation').get('button')
    }).then(t => {
      tabs = t
      //Assign group
      tabs[conf.tabs.userlist.index].click()
      cy.location('pathname').should('eq', conf.tabs.userlist.path)
      cy.get('#group_' + conf.adminuser + '-agile-local').click()
      cy.get('#root_groups').should('exist')
      cy.get('#root_groups').contains('cypress-group').find(':checkbox').should('be.not.checked')
      cy.get('#root_groups').contains('cypress-group').find(':checkbox').check()
      return cy.get('button[type="submit"]')
    }).then( (submit) => {
      cy.log('sumbit button')

        cy.log(submit)
        submit.click()
        cy.wait(3000)
        tabs[conf.tabs.groups.index].click()
        cy.get('#view_cypress-group-' + conf.user + '-agile-local').click()
        expand(true)
        cy.wait(1000)
        cy.get('#root-entities').should('contain', 'agile!@!agile-local')
        //Remove user from group
        return cy.get('#navigation').get('button')

      }).then(t => {
        tabs = t
        tabs[conf.tabs.userlist.index].click()
        cy.location('pathname').should('eq', conf.tabs.userlist.path)
        cy.get('#group_' + conf.adminuser + '-agile-local').click()
        cy.wait(1000)
        cy.get('#root_groups').should('exist')
        cy.get('#root_groups').contains('cypress-group').find(':checkbox').should('be.checked')
        cy.get('#root_groups').contains('cypress-group').find(':checkbox').uncheck()
        return cy.get('button[type="submit"]')

      }).then(submit => {
        submit.click()
        cy.wait(3000)
        tabs[conf.tabs.groups.index].click()
        cy.get('#view_cypress-group-' + conf.user + '-agile-local').click()
        expand(true)
        cy.get('#root-entities').should('not.contain', conf.adminuser + '!@!agile-local')
      }).then(() =>{
        //Delete group
        cy.get('#navigation').get('button').then(tabs => {
        tabs[conf.tabs.groups.index].click()
        cy.get('#cypress-group-' + conf.user + '-agile-local').should('exist')
        cy.get('#delete_cypress-group-' + conf.user + '-agile-local').click()
        cy.wait(1000)
        cy.get('#cypress-group-' + conf.user + '-agile-local').should('not.exist')
    })
  })
  })
})
