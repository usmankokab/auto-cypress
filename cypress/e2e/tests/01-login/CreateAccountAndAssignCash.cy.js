import BasePage from "../../pages/BasePage";
import LoginPage from "../../pages/LoginPage";
import loginPage from "../../pages/loginPage1";
import { createBettorAndAssignCash, onUserAvailable } from '../../utils/userHelpers';
import { createAndAssign } from '../../utils/userHelpers';

import 'cypress-if';

Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false
  })

describe("Create Dealer Account and Assign Credit", { tags: ['@Login', '@regression'] }, () => {

    let basePage;

    before(() => {
        basePage = new BasePage();
        
    })

    //Mocha automatically shares contexts for us across all applicable hooks for each test. 
    //Additionally these aliases and properties are automatically cleaned up after each test.
    beforeEach(() => {

        //Aliasing cy.fixture() data and then using this to access it via the alias.
        //Note the use of the standard function syntax. 
        //Using arrow functions to access aliases via this won't work because of the lexical binding of this.
        
        cy.fixture('users.json').as('users')    
    })

    
    //const randomNumber = Math.floor(Math.random() * 1000) + 1;
    let credentials;
    
    // Array of usernames to validate
    const creditEndPoint = '/api/addCredit'
    const cashEndPoint = '/api/addCashDeposit'
    const dealerArray = ["figuretest_a2", "figuretest_sm2", "figuretest_m2"];
    const traderArray =   ['figuretest_a.b', 'figuretest_sm.b', "figuretest_m2_b"]
    
    
    it('Create Admin and Trader by Super Admin and assign credit/cash', { tags: '@smoke' }, function () {
        createAndAssign('qaisersa', 'qaisersa', 'Dealer', '80', creditEndPoint, 10000, dealerArray[0], dealerArray[0], 'Super Admin')
            //Trader of Super Admin and assign cash
            //createAndAssign(traderArray[0], traderArray[0], 'Trader', '90', cashEndPoint, 2000)
    })
    
    it('Create Super Master and Trader by Admin and assign credit/cash', { tags: '@smoke' }, function () {
        createAndAssign(dealerArray[0], dealerArray[0], 'Dealer', '70', creditEndPoint, 10000, dealerArray[1], dealerArray[1], 'Admin')
            //Trader of Admin and assign cash
        //cy.loginAndGetToken(dealerArray[0], dealerArray[0])    
        //createAndAssign(traderArray[0], traderArray[0], 'Trader', '80', cashEndPoint, 1000)
        //createAndAssign(traderArray[1], traderArray[1], 'Trader', '80', cashEndPoint, 1000)
    })
        
    it('Create Master and Trader by Supermaster and assign credit/cash', { tags: '@smoke' }, function () {
        createAndAssign(dealerArray[1], dealerArray[1], 'Dealer', '60', creditEndPoint,10000, dealerArray[2], dealerArray[2], 'Super Master')
            //Trader of Supermaster and assign cash
            //createAndAssign(traderArray[1], traderArray[1], 'Trader', '70', cashEndPoint, 40)
    })
    
    it('Create Master Trader by master and assign credit/cash', { tags: '@smoke' }, function () {
            cy.loginAndGetToken(dealerArray[2], dealerArray[2])
            //Trader of master and assign cash
            createAndAssign(traderArray[2], traderArray[2], 'Trader', '60', cashEndPoint, 5000)
    })    
            
})    
    //   ////////////////////////////////////////////////////////////////////////////////////////
      

