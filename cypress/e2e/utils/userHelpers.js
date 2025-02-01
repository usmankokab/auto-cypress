// utils/userHelpers.js
import BasePage from "./../pages/BasePage";
import 'cypress-if';

let basePage = new BasePage()


export function createAndAssign(userParent, passParent, userType, shareValue, endPoint, assignedAmount, childUser, childPass, textRole) {
  if (userType === 'Dealer') {
    return cy.loginAndGetToken(userParent, passParent).then(() => {
      // Verify successful login
      cy.get('div > h1').eq(2).should('contain', textRole);
  
      // Ensure the token exists in the Cypress environment
      const token = Cypress.env('authToken');
      expect(token).to.exist;
  
      // Create child account
      return cy.createChildUser(childUser, childPass, userType, shareValue).then(([userChild, passChild]) => {
        cy.log('Child User Created:', userChild);
        cy.log('Child User Password:', passChild);
  
          
        // Wait before assigning credit
        cy.wait(5000);
        // Find trader and assign credit
        findAndAssign(assignedAmount, userChild, endPoint)
        // Return the child credentials as a Cypress chain
        return cy.wrap([userChild, passChild]);
      });
    });
  }
  if (userType === 'Trader') {
      //create Bettor
      const traderUser = userParent
      const traderPass = passParent
      cy.createChildUser(traderUser, traderPass, userType).then(([userTrader, passTrader]) => {
        cy.log('Trader User:', userTrader);
        cy.log('Trader Password:', passTrader);

        cy.wait(5000);
        //find bettor and assign cash
        findAndAssign(assignedAmount, userTrader, endPoint)
        return cy.wrap([userTrader, passTrader]);
      })
      
  }

}

export function findAndAssign(assignedAmount, userChild, endPoint){
  return cy
        .request({
          method: 'GET',
          url: 'https://production.1obet.net/api/getAllUsers?numRecords=10000',
          failOnStatusCode: false,
          headers: {
            Authorization: `Bearer ${Cypress.env('authToken')}`,
          },
        })
        .then((response) => {
          cy.log('Status Code:', response.status);
          cy.log('Response Body:', JSON.stringify(response.body));
          cy.log('Response Message:', response.body.message || 'No message provided');
          expect(response.status).to.eq(200);

          // Find the specific user by username
          const userNameToFind = userChild;
          const user = response.body.results.docs.find((doc) => doc.userName === userNameToFind);

          if (user) {
            const userId = user.userId;
            cy.log(`Found user: ${userNameToFind}, User ID: ${userId}`);

            // Assign credit to the found user
            const depositPayload = {
              userId: userId,
              amount: assignedAmount,
            };

            return cy
              .request({
                method: 'POST',
                url: `https://production.1obet.net${endPoint}`,
                failOnStatusCode: false,
                headers: {
                  Authorization: `Bearer ${Cypress.env('authToken')}`,
                },
                body: depositPayload,
              })
              .then((depositResponse) => {
                cy.log('Deposit Status Code:', depositResponse.status);
                cy.log('Deposit Response Body:', JSON.stringify(depositResponse.body));
                cy.log('Deposit Response Message:', depositResponse.body.message || 'No message provided');
                expect(depositResponse.status).to.eq(200);

              });
          } else {
            // User not found, throw error
            const allUserNames = response.body.results.docs.map((doc) => doc.userName) || [];
            cy.log('All Usernames:', JSON.stringify(allUserNames));
            throw new Error(`User with username "${userNameToFind}" not found.`);
          }
        });
        
}




// cy.request({
//   method: 'POST',
//   url: 'https://production.1obet.net/api/checkValidation',
//   body: payload,
//   failOnStatusCode: false, // Avoid test failure for invalid responses
//   headers: {
//     Authorization: `Bearer ${token}`,
//   },
// }).then((response) => {
//   // Log response for each user
//   cy.log(`Checking user: ${userName}`);
//   cy.log(`Response Status: ${response.status}`);
//   cy.log('Response:', JSON.stringify(response.body));

//   // Check for "user already exists" in the response
// if (response.body.errors && response.body.errors.length > 0) {
//   const error = response.body.errors.find(
//     (err) => err.msg.message === "user already exists"
//   );

//   if (error) {
//     cy.log(`User "${userName}" already exists: ${error.msg.message}`);
//     existingUsers.push(userName); // Add to existing users array
//   } else {
//     cy.log(`User "${userName}" no expected error message on user already exits`);
//   }
// } else {
//   cy.log(`No errors for user "${userName}".`);
//   }
  
// }).then(() => {
// // Log all existing users to a file after the loop is complete
// if (existingUsers.length > 0) {
// const message = `Existing users: ${existingUsers.join(", ")}`;
// cy.log(message);
// throw new Error(`Test failed: The following users already exist: ${existingUsers.join(", ")}`);
// } else {
// const message = "All users are available.";
// cy.log(message);
// }
// })