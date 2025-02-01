import TestFilters from '../support/filterTests.js'

TestFilters([], () => {
    describe('Login to OrangeHRM website (E2E)', function () {
        before(function () {
            cy.visit('https://opensource-demo.orangehrmlive.com/')
            cy.fixture('testdata').then(function (testdata) {
                this.testdata = testdata
            })
        })

        it('Validate successful Login', function () {
            cy.get('input[name="username"]').type(this.testdata.username)
            cy.get('input[name="password"]').type(this.testdata.password)
            cy.get('button[type="submit"]').click()
            cy.contains('h6', this.testdata.welcomeText)
            //cy.get('#welcome').contains(this.testdata.welcomeText)
        })
    })
})
