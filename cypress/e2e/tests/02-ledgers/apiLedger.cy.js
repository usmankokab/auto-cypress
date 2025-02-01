import HeaderComponent from "../../components/HeaderComponent";
import BasePage from "../../pages/BasePage";
import LoginPage from "../../pages/LoginPage";
import UsersPage from "../../pages/UsersPage";
import { verifyBalanceEachRow, calculateAndverifyLedger_WinLoss_EndBalance_deposits_Api, exploreLedgerOf_Api } from '../../utils/ledgerHelper';
import { exploreLedgerOf } from '../../utils/ledgerHelper'
import { pickDate } from '../../utils/ledgerHelper'

import 'cypress-if';

Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false
  })

describe("Verify trader ledgers", { tags: ['@Login', '@regression'] }, () => {

    let basePage, headerComponent, usersPage
    let envSummary
    let trader =  'perizad'

    before(() => {
        basePage = new BasePage();
        headerComponent = new HeaderComponent()
        usersPage = new UsersPage() 
    })

    //Mocha automatically shares contexts for us across all applicable hooks for each test. 
    //Additionally these aliases and properties are automatically cleaned up after each test.
    beforeEach(() => {

        //Aliasing cy.fixture() data and then using this to access it via the alias.
        //Note the use of the standard function syntax. 
        //Using arrow functions to access aliases via this won't work because of the lexical binding of this.
        
        //Login with dealer and get token
        cy.loginAndGetToken('theluckyspot', '6theluckyspot7')
        const token = Cypress.env('authToken');
        
        cy.fixture('users.json').as('users')    
    })

    it.only('Verify Trader Win/Loss | Compare Real Calculation with end balance', { tags: '@smoke' }, function () {
   
      
      calculateAndverifyLedger_WinLoss_EndBalance_deposits_Api(45317).then((results) => {
        // Log and assert results for each user
        results.forEach((result) => {
            cy.log(`User: ${result.user}, Role: ${result.role}, Status: ${result.status}`);
            if (result.status === "Failed") {
                cy.log(`Reason: ${result.reason}`);
            }
        });

        // Optionally, fail the test if any user failed
        const failedUsers = results.filter((r) => r.status === "Failed");
        if (failedUsers.length) {
            throw new Error(`Some users failed: ${JSON.stringify(failedUsers, null, 2)}`);
        }
    });
      
      
      //calculateAndverifyLedger_WinLoss_EndBalance_deposits_Api()
      //exploreLedgerOf_Api('11032', '2024-12-10', '2024-12-11')
      //headerComponent.exploreUsers()
      //cy.get('button.ant-btn.css-98ntnt.ant-btn-default.style_filledCommonButton__YaLqK.style_buttonText__GrJBx > div').eq(1).click()
      //pickDate()        
      //calculate ledger Win/Loss and end balance
      //cy.wait(5000)
      //const summary = calculateAndverifyLedger_WinLoss_EndBalance_deposits()
      //cy.log('Summary:', JSON.stringify(summary));
      //envSummary = Cypress.env(summary)
    })

    
    it('Verify Trader balance of each row', { tags: '@smoke' }, function () {
   
      
      exploreLedgerOf(trader)
      //headerComponent.exploreUsers()
      //cy.get('button.ant-btn.css-98ntnt.ant-btn-default.style_filledCommonButton__YaLqK.style_buttonText__GrJBx > div').eq(1).click()
      pickDate()        
      //Calculate amount sum upto the current row and compare with balance of each row
      verifyBalanceEachRow()

    })

  
  it('compare end balance with user balance | Verify Exposure is not positive | compare balance and available balance | Verify Trader Win/Loss in Reports', { tags: '@smoke' }, function () {
   
    headerComponent.exploreUsers()
    cy.contains('tr', trader).within(($row) => {
      // Getting balance of the same user and compare with ledger end-balance
      
      const userBalance = parseFloat($row.find('td').eq(3).text().trim());
      cy.log(userBalance)
      if(envSummary.endBalance==userBalance){
        cy.log(`Ledger end balance ${envSummary.endBalance} is equal to userBalance ${userBalance}`)
      }else{
        cy.fail('Ledger end balance is not equal to userBalance')
      }
      
      const exposure = parseFloat($row.find('td').eq(6).text().trim());
      if(exposure > 0){
        cy.fail('Dangerous - Positive Exposure')
      }else{
        cy.log('Exposure is not positive')
      }
      
      const availableBalance = parseFloat($row.find('td').eq(7).text().trim());
      if(userBalance==(availableBalance-exposure)){
        cy.log('User balance is equal to available balance')  
      } else {
        cy.fail('User balance is not equal to available balance')
      }
  })
  })
                
})    
    //   ////////////////////////////////////////////////////////////////////////////////////////
      

