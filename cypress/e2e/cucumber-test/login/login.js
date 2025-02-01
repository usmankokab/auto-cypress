import { Given, When, Then, And } from "@badeball/cypress-cucumber-preprocessor"

Given('User is at the login page', () => {
    cy.visit('https://opensource-demo.orangehrmlive.com/')
})

When('User enters username as {string} and password as {string}', (username, password) => {
    cy.get('input[name="username"]').type(username)
    cy.get('input[name="password"]').type(password)
})

And('User clicks on login button', () => {
    cy.get('button[type="submit"]').click()
})

Then('User is able to successfully login to the Website', () => {
    cy.contains('h6', 'Dashboard').should('be.visible', {timeout: 10000})
})