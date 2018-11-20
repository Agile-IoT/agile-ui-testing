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
      return tabs[conf.tabs.groups.index].click()
    }).then(()=>{
      return cy.get('#cypress-agile-local').should('not.exist')
    }).then(( )=> {
      //Create group
      return cy.get('#navigation').get('button')
    }).then(t => {
      tabs = t
      return tabs[conf.tabs.groups.index].click()
    }).then( ()=>{
      let regex = new RegExp(conf.tabs.groups.path.replace(/:[a-zA-Z]*/, '.*'))
      return cy.url().should('match', regex)
    }).then(()=>{
      return cy.get('#new_entity_button').click()
    }).then(()=>{
      cy.get('#root_group_name').type('cypress-group')
      return cy.get('button[type="submit"]').click()
    }).then(()=>{
      return cy.get('#navigation').get('button')
    }).then(t => {
      tabs = t
      //Assign group
      return tabs[conf.tabs.userlist.index].click()
    }).then(()=>{
      return cy.location('pathname').should('eq', conf.tabs.userlist.path)
    }).then(()=>{
      return cy.get('#group_' + conf.adminuser + '-agile-local').click()
    }).then(()=>{
      return cy.get('#root_groups').should('exist')
    }).then(()=>{
      return cy.get('#root_groups').contains('cypress-group').find(':checkbox').should('be.not.checked')
    }).then(()=>{
      return cy.get('#root_groups').contains('cypress-group').find(':checkbox').check()
    }).then(()=>{
      return cy.get('button[type="submit"]').click()
    }).then(()=>{
        return tabs[conf.tabs.groups.index].click()
    }).then(()=>{
        return cy.get('#view_cypress-group-' + conf.user + '-agile-local').click()
      }).then(()=>{
        expand(true)
        cy.wait(4000)
        return cy.get('#root-entities').should('contain', 'agile!@!agile-local')
      }).then(()=>{
        //Remove user from group
        return cy.get('#navigation').get('button')
      }).then(t => {
        tabs = t
        tabs[conf.tabs.userlist.index].click()
        return cy.location('pathname').should('eq', conf.tabs.userlist.path)
      }).then(()=>{
        return cy.get('#group_' + conf.adminuser + '-agile-local').click()
      }).then(()=>{
        return cy.get('#root_groups').should('exist')
      }).then(()=>{
        return cy.get('#root_groups').contains('cypress-group').find(':checkbox').should('be.checked')
      }).then(()=>{
        return cy.get('#root_groups').contains('cypress-group').find(':checkbox').uncheck()
      }).then(()=>{
        return cy.get('button[type="submit"]')

      }).then(submit => {
        return submit.click()
      }).then(()=>{
        tabs[conf.tabs.groups.index].click()
        return cy.get('#view_cypress-group-' + conf.user + '-agile-local').click()
      }).then(()=>{
        expand(true)
        cy.get('#root-entities').should('not.contain', conf.adminuser + '!@!agile-local')
      }).then(() =>{
        //Delete group
        cy.get('#navigation').get('button').then(tabs => {
        tabs[conf.tabs.groups.index].click()
        cy.get('#cypress-group-' + conf.user + '-agile-local').should('exist')
        return cy.get('#delete_cypress-group-' + conf.user + '-agile-local').click()
      }).then(()=>{
        cy.get('#cypress-group-' + conf.user + '-agile-local').should('not.exist')
    })
  })
  })
  it('Create and delete entities', () => {
    let workingtab = undefined
    cy.get('#navigation').get('button').then(tabs => {
      return tabs[conf.tabs.userlist.index].click()
    }).then(()=>{
      return cy.get('#cypress-agile-local').should('not.exist')
    }).then(()=>{
          return cy.get('#navigation').get('button')
    }).then(tabs => {
      tabs[conf.tabs.userlist.index].click()
      let regex = new RegExp(conf.tabs.userlist.path.replace(/:[a-zA-Z]*/, '.*'))
      return cy.url().should('match', regex)
    }).then(()=>{
      return cy.get('#new_entity_button').click()
    }).then(()=>{
      return cy.location('pathname').should('eq', conf.views.addUser.path)
    }).then(()=>{
      return cy.get('#root_user_name').type('cypress')
    }).then(()=>{

      return cy.get('#root_auth_type').select('agile-local')
    }).then(()=>{

      return cy.get('#root_password').type('secret')
    }).then(()=>{

      return cy.get('#root_role').select('admin')
    }).then(()=>{

      return cy.get('button[type="submit"]').click()
    }).then(()=>{
      return cy.get('#navigation').get('button')
    }).then(tabs => {
       workingtab = conf.tabs.userlist
      return tabs[workingtab.index].click()
    }).then(()=>{
      cy.get('#cypress-agile-local').should('not.exist')
    })
  })

  it('Add and update attribute to own user entity and delete it', () => {
    let workingtab = undefined
    cy.get('#navigation').get('button').then(tabs => {
      workingtab = conf.tabs.profile
      tabs[workingtab.index].click()
      let regex = new RegExp(workingtab.path.replace(/:[a-zA-Z]*/, '.*'))
      cy.url().should('match', regex)
      expand()
      cy.wait(4000)
      return cy.get('#cypress').should('not.exist')
    }).then(()=>{
      return cy.get('span').contains('cypress').should('not.exist')
    }).then(()=>{
      return cy.get('span').contains('cypress.value').should('not.exist')
    }).then(()=>{
      return cy.get('#new-attribute').type('cypress')
    }).then(()=>{
      return cy.get('#new-attribute-value').type('cypress.value')
    }).then(()=>{
      return cy.get('#new-attribute-submit').click()
    }).then(()=>{
      return cy.get('#cypress').should('exist')
    }).then(()=>{
      return cy.get('#cypress_value').should('have.value', 'cypress.value')
    }).then(()=>{
      return cy.get('#cypress_value').clear()
    }).then(()=>{
      return cy.get('#cypress_value').type('updated.value')
    }).then(()=>{
      return cy.get('#navigation')
    }).then(()=>{
      return cy.get('#cypress_value').should('have.value', 'updated.value')
    }).then(()=>{
      return cy.get('#delete_cypress').click()
    }).then(()=>{
      cy.get('#cypress').should('not.exist')
    })
  })
  it('Switch to user overview tab and view first user attributes', () => {
   let workingtab = undefined
   cy.get('#navigation').get('button').then(tabs => {
     workingtab = conf.tabs.userlist
     return tabs[workingtab.index].click()
   }).then(()=>{
     return cy.location('pathname').should('eq', workingtab.path)
   }).then(()=>{
    return cy.get('#view_' + conf.adminuser + '-agile-local').click() //First user attributes
  }).then(()=>{
     let regex = new RegExp(conf.views.user.path.replace(/:[a-zA-Z]*/, '.*'))
     return cy.url().should('match', regex)
    }).then(()=>{
     return cy.get('#' + conf.adminuser + '-agile-local')
    }).then(()=>{
     return cy.get('#new_password').should('exist')
   }).then(()=>{
     return cy.get('#old_password').should('not.exist')
    }).then(()=>{
     expand()
     cy.wait(4000)
     cy.get('span').contains('id').should('be.visible')
   })
 })

 it('Switch to user overview tab and view second user attributes', () => {
   let workingtab = undefined
   cy.get('#navigation').get('button').then(tabs => {
     workingtab = conf.tabs.userlist
     return tabs[workingtab.index].click()
   }).then(()=>{
     return cy.location('pathname').should('eq', workingtab.path)
   }).then(()=>{
     return cy.get('#view_' + conf.user + '-agile-local').click() //First user attributes
   }).then(()=>{
      let regex = new RegExp(conf.views.user.path.replace(/:[a-zA-Z]*/, '.*'))
     return cy.url().should('match', regex)
   }).then(()=>{
     return cy.get('#new_password').should('exist')
     }).then(()=>{
     return cy.get('#old_password').should('exist')
   }).then(()=>{
      expand()
     cy.get('span').contains('id').should('be.visible')
   })
 })

})
