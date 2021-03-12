describe('App', () => {
  before(() => {
    cy.visit('/')
  })

  describe('Load App', () => {
    it('Check content', () => {
      cy.contains('#__next > h2', 'My awesome component')
    })
  })
})

export default true
