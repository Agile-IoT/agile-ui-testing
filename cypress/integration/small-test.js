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

function visitAndAuthUI(auth_data){
    cy.request(auth_data).then((res)=>{
      let token = res.body.access_token
      cy.visit(conf.UI_URL + '?token=' + token)
      cy.log(conf.UI_URL + '?token=' + token)
    })

}

function adminAuthAndVisitUI() {
  return visitAndAuthUI(admin_auth)
}

function userAuthAndVisitUI() {
  return visitAndAuthUI(user_auth)
}

function expand(group) {
  return cy.location().then(loc => {
    //cy.wait(1000)
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


describe('Security Admin', () => {
  beforeEach(() => {
    adminAuthAndVisitUI()
  })


  it('Add and update attribute to own user entity and delete it', () => {

    cy.get('#navigation').find('button').should('have.length', conf.tabs.length)
    cy.get('#navigation').get('button').then(tabs => {
      let workingtab = conf.tabs.profile
      tabs[workingtab.index].click()
      let regex = new RegExp(workingtab.path.replace(/:[a-zA-Z]*/, '.*'))
      cy.url().should('match', regex)
      expand()
      //cy.get('#cypress').should('not.exist')
      //cy.get('span').contains('cypress').should('not.exist')
      //cy.get('span').contains('cypress.value').should('not.exist')
      cy.wait(500)
      cy.get('#new-attribute-value').invoke('height').should('be.greaterThan', 0)
      //cy.get('#new-attribute-value').should('exist')
      //cy.get('#new-attribute-value').should('be.visible')
      cy.get('#new-attribute-value').type('cypress.value')

      cy.wait(500)
      cy.get('#new-attribute').invoke('height').should('be.greaterThan', 0)
      //cy.get('#new-attribute').should('exist')
      //cy.get('#new-attribute').should('be.visible')
      cy.get('#new-attribute').type('cypress')

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





})
