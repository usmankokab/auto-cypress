// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

import 'cypress-if'

import LoginPage from "../e2e/pages/LoginPage"
import RegisterPage from "../e2e/pages/RegisterPage";

Cypress.Commands.add('login', () => {

    cy.fixture('users.json').then((users) => {

        LoginPage.loginWithUI(users.validUser.user, users.validUser.password);
    })

})

Cypress.Commands.add('validateFormField', (inputField, message) => {
    return inputField.then(($input) => RegisterPage.inputValidationErr($input))
            .should('be.visible')
            .and('have.text', message)
})

Cypress.Commands.add('loginAndGetToken', (username, password) => {
    cy.intercept('POST', 'https://production.1obet.net/api/login').as('loginRequest'); // Replace '/api/login' with your actual login endpoint
  
    // Perform UI login
    cy.visit('https://1obet.com/login/'); // Replace with your login page URL
    cy.wait(3000)
    cy.get('input[placeholder="UserName').should('be.visible').type(username); // Adjust selector for username input
    cy.get('input[placeholder="Password"').should('be.visible').type(password); // Adjust selector for password input
    cy.get("button[type=submit]").click(); // Adjust selector for login button
  
    // Wait for the login API request and capture the token
    cy.wait('@loginRequest').then((interception) => {
      expect(interception.response.statusCode).to.eq(200); // Ensure login was successful
      const token = interception.response.body.token; // Adjust path based on your API response structure
      if (token) {
        Cypress.env('authToken', token); // Save token to Cypress environment
        cy.log(`Token saved: ${token}`);
      } else {
        throw new Error('Token not found in login response');
      }
    });
  });

  Cypress.Commands.add('createChildUser', (username, password, userType, shareValue) => {
      cy.wait(5000);
      cy.contains('div', 'Users').click();
      cy.contains('div', 'New User').click();
  
      cy.wait(5000);
      cy.get('.styles_customInput__PQ5kP').eq(0).should('be.visible').type(username);
      cy.get('.styles_customInput__PQ5kP').eq(1).should('be.visible').type(password);
  
      if (userType === 'Dealer') {
        cy.get('input.ant-input.styles_roundInput__VOk83[type="number"][max]')
          .if('visible')
          .then(($el) => {
            try {
              cy.get('input.ant-input.styles_roundInput__VOk83[type="number"][max]').type(shareValue);
            } catch (error) {
              cy.log('Share Value input is not available');
            }
          });
      } else {
        cy.contains('span', 'Bettor').click();
      }
  
      cy.contains('button', 'Submit').click();
  
      // Handle case where username is not available
      cy.get('div:contains("username not available")')
        .if('visible')
        .then(() => {
          cy.log('createChildUser -> username is not available');
          const newUsername = `${username}_ii`;
          const newPassword = `${password}_ii`;
          return cy.createChildUser(newUsername, newPassword, userType, shareValue); // Retry with new credentials
        });
  
      // Return created username and password
      //return [username, password];
      return cy.wrap([username, password])
    
  });



  Cypress.Commands.add('containsExact', (selector, text) => {
    cy.get(selector).filter((index, element) => {
      return Cypress.$(element).text().trim() === text;
    });
  });
  

  
