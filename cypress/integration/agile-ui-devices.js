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

function adminAuthAndVisitUI() {
  return new Promise(() => {
    cy.request(admin_auth).then(res => {
      let token = res.body.access_token
      cy.visit(conf.UI_URL + '?token=' + token)
    })
  })
}

function expand() {
  return cy.location().then(loc => {
    cy.wait(1000)
    let parts = loc.pathname.split('/')
    let id = parts.find(part => {
      return part.includes('!@!')
    })
    cy.get('#' + id.replace('!@!', '-')).click('left')
  })
}

describe('Devices', () => {
  beforeEach(() => {
    adminAuthAndVisitUI()
    cy.wait(3000) //Let react load all state objects
  })

  it('Register device', () => {
    cy.get('#navigation').get('button').then(tabs => {
      tabs[conf.tabs.discover.index].click()
      cy.get('#' + conf.dummy_device.id.replace(/:/g, '-')).should('exist')
      cy.get('#register_' + conf.dummy_device.id.replace(/:/g, '-')).should('exist')
      cy.get('#register_' + conf.dummy_device.id.replace(/:/g, '-')).click()
      cy.get('span[role="menuitem"]').contains(conf.dummy_device.name).click()
    })

    cy.get('#navigation').get('button').then(tabs => {
      tabs[conf.tabs.devices.index].click()
      const id = conf.dummy_device.name.toLocaleLowerCase() + conf.dummy_device.id.replace(/:/g, '')
      cy.get('#' + id).should('exist')
      cy.get('#view_' + id).click()
      cy.get('#graphdiv' + conf.dummy_device.data).should('be.visible')
    })
  })
})