import TestFilters from '../support/filterTests.js'

TestFilters([], () => {
    describe('Example to demonstrate the use each in Cypress', function () {
        before(function () {
            cy.visit('https://opensource-demo.orangehrmlive.com/')
        })

        beforeEach(function () {
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

        it('Validate all the Quick Launch Texts', function () {
            cy.get('.orangehrm-quick-launch-heading').each(($el, index) => {
                expect($el).to.contain(this.testdata.quickLaunch[index])
            })
        })

        /*Please check the pie chart percentage values before execution.
        I realized it very late that the pie chart values changes after few days.
        Update the empDistPieChart from the testdata.json file with the latest values.*/

        it('Validate the Employee Distribution by Subunit Piechart Values and sum of percentage values', function () {
            var total = 0
            cy.contains('.test').each(($el, index) => {
                expect($el).to.contain(this.testdata.empDistPieChart[index])
                total = total + parseInt($el.text())
            }).then(() => {
                expect(total).to.equal(99)
            })
        })
    })
})