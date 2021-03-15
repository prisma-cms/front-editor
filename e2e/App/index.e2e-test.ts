import { expect } from 'chai'

describe('App', () => {
  before(() => {
    cy.visit('/')
  })

  describe('Load App', () => {
    it('Check content', () => {
      cy.contains('#__next > h2', 'My awesome component')

      cy.get('#__next > h2').then((node) => {
        expect(node).not.null
      })
    })
  })
})

export default true
