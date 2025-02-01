import 'cypress-if';

Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false
  })

  
  //Login with SuperAdmin created by company account - SQaiser1.Lyt
  //Create Admin Account with SuperAdmin
  //Create Super Master account with Admin
  //Create Master account with Super Master
  //Create bettor account with Master

  const randomNumber = Math.floor(Math.random() * 1000) + 1;
  let credentials;
  
  it.only('Admin Login should work created by Super Admin', () => {
    
    //Login with Super Admin
    cy.visit('https://1obet.com/');
    cy.get('input[placeholder="UserName"]').clear().type('SQaiser1.Lyt');
    cy.get('input[placeholder="Password"]').clear().type('SQaiser1.Lyt');
    cy.get('button[type=submit]').click();
    //cy.get('button.MuiButton-containedSizeSmall.css-18qmf20').click();
    cy.get('div > h1').eq(2).should('contain', 'Super Admin');  // Assuming the user is redirected to the dashboard upon successful login

    //Create Admin Account with SuperAdmin
    
    
  //   function onUserAvailable (){
  //       let username = 'autoadmin'+randomNumber;
  //       let password = 'autoadmin'+randomNumber;
        
  //       cy.contains('div', 'Users').click();
  //       cy.contains('div', 'New User').click();
  //       //cy.visit('https://dev.bookofblack.com/#/user-bet-form');
  //       cy.get('.styles_customInput__PQ5kP').eq(0).type(username);
  //       cy.get('.styles_customInput__PQ5kP').eq(1).type(password);
  //       cy.get('.ant-radio-input[value="2"]').check();
  //       cy.get('.styles_customInput__PQ5kP').eq(2).type('94');
  //       cy.contains('button', 'Submit').click();

  //       cy.get('div:contains("username not available")').if('visible').then(($el) => {
  //         try {
  //           onUserAvailable();
  //         } catch (error) {
  //           // ignore the error and continue the test
  //         }

  //         return [username, password]
  //       });
  //       return [username, password];
  //   }

  //   const [username, password] = onUserAvailable();
  //   cy.url().should('contain', 'users');
  //   cy.get('.style_profileUserNameText__EeMIe').eq(1).click();
  //   cy.contains('span', 'Logout').click();
  //   //Check Login with Admin Account
  //   cy.visit('https://dev.bookofblack.com/');
  //   cy.get('input[placeholder="UserName"]').clear().type(username);
  //   cy.get('input[placeholder="Password"]').clear().type(password);
  //   cy.get('button[type=submit]').click();
  //   //cy.get('button.MuiButton-containedSizeSmall.css-18qmf20').click();
  //   cy.get('div > h1').eq(2).should('contain', 'Admin');  // Assuming the user is redirected to the dashboard upon successful login
  //   credentials = [username, password]
  });
    
  it('Super Master Login should work created by Admin', () => {
    
    //Login with Admin Account
    cy.visit('https://dev.bookofblack.com/');
    cy.get('input[placeholder="UserName"]').clear().type(credentials[0]);
    cy.get('input[placeholder="Password"]').clear().type(credentials[1]);
    cy.get('button[type=submit]').click();
    //cy.get('button.MuiButton-containedSizeSmall.css-18qmf20').click();
    cy.get('div > h1').eq(2).should('contain', 'Admin');  // Assuming the user is redirected to the dashboard upon successful login

    //Creating Super Master Account with Admin account
    function onUserAvailable (){
      let username = 'autoadmin'+randomNumber;
      let password = 'autoadmin'+randomNumber;

      cy.contains('div', 'Users').click();
      cy.contains('div', 'New User').click();
        
      //cy.visit('https://socket.bookofblack.com/#/user-bet-form');
      cy.get('.styles_customInput__PQ5kP').eq(0).type(username);
      cy.get('.styles_customInput__PQ5kP').eq(1).type(password);
      cy.get('.ant-radio-input[value="3"]').check();
      cy.get('.styles_customInput__PQ5kP').eq(2).type('93');
      cy.contains('button', 'Submit').click();

      cy.get('div:contains("username not available")').if('visible').then(($el) => {
        try {
          onUserAvailable();
        } catch (error) {
          // ignore the error and continue the test
        }

        return [username, password]
      });
      return [username, password];
  }

  const [username, password] = onUserAvailable();
  cy.url().should('contain', 'users');

    //Check Login with Super Master
    cy.visit('https://dev.bookofblack.com/');
    cy.get('input[placeholder="UserName"]').clear().type(username);
    cy.get('input[placeholder="Password"]').clear().type(password);
    cy.get('button[type=submit]').click();
    //cy.get('button.MuiButton-containedSizeSmall.css-18qmf20').click();
    cy.get('div > h1').eq(2).should('contain', 'Super Master');  // Assuming the user is redirected to the dashboard upon successful login
    credentials = [username, password]
  });

  it('Master Login should work created by Super Master', () => {  
    //Login with Super Master
    cy.visit('https://socket.bookofblack.com/');
    cy.get('input[placeholder="Username"]').clear().type(credentials[0]);
    cy.get('input[placeholder="Password"]').clear().type(credentials[1]);
    cy.get('button[type=submit]').click();
    //cy.get('button.MuiButton-containedSizeSmall.css-18qmf20').click();
    cy.get('div > h1').eq(2).should('contain', 'Super Master');  // Assuming the user is redirected to the dashboard upon successful login

    //Creating Master Account with Super Master account
    function onUserAvailable (){
        let username = 'autoadmin'+randomNumber;
        let password = 'autoadmin'+randomNumber;
        cy.contains('div', 'Users').click();
        cy.contains('div', 'New User').click();
        //cy.visit('https://socket.bookofblack.com/#/user-bet-form');
        cy.get('.styles_customInput__PQ5kP').eq(0).type(username);
        cy.get('.styles_customInput__PQ5kP').eq(1).type(password);
        cy.get('.ant-radio-input[value="4"]').check();
        cy.get('.styles_customInput__PQ5kP').eq(2).type('92');
        cy.contains('button', 'Submit').click();

        cy.get('div:contains("username not available")').if('visible').then(($el) => {
          try {
            onUserAvailable();
          } catch (error) {
            // ignore the error and continue the test
          }
  
          return [username, password]
        });
        return [username, password];
    }
  
    const [username, password] = onUserAvailable();
    cy.url().should('contain', 'users');

    //Check Login with  Master
    cy.visit('https://socket.bookofblack.com/');
    cy.get('input[placeholder="Username"]').clear().type(username);
    cy.get('input[placeholder="Password"]').clear().type(password);
    cy.get('button[type=submit]').click();
    //cy.get('button.MuiButton-containedSizeSmall.css-18qmf20').click();
    cy.get('div > h1').eq(2).should('contain', 'Master');  // Assuming the user is redirected to the dashboard upon successful login
    credentials = [username, password]
  });

  it('Bettor Login should work created by Master', () => {
    
    //Login with  Master
    cy.visit('https://socket.bookofblack.com/');
    cy.get('input[placeholder="Username"]').clear().type(credentials[0]);
    cy.get('input[placeholder="Password"]').clear().type(credentials[1]);
    cy.get('button[type=submit]').click();
    //cy.get('button.MuiButton-containedSizeSmall.css-18qmf20').click();
    cy.get('div > h1').eq(2).should('contain', 'Master');  // Assuming the user is redirected to the dashboard upon successful login

    //Creating Bettor Account by Master account
    
    function onUserAvailable (){
        let username = 'autoadmin'+randomNumber;
        let password = 'autoadmin'+randomNumber;
        cy.contains('div', 'Users').click();
        cy.contains('div', 'New User').click();
        
        //cy.visit('https://socket.bookofblack.com/#/user-bet-form');
        cy.get('.styles_customInput__PQ5kP').eq(0).type(username);
        cy.get('.styles_customInput__PQ5kP').eq(1).type(password);
        cy.get('.ant-radio-input[value="5"]').check();
        cy.contains('button', 'Submit').click();

        cy.get('div:contains("username not available")').if('visible').then(($el) => {
          try {
            onUserAvailable();
          } catch (error) {
            // ignore the error and continue the test
          }
  
          return [username, password]
        });
        return [username, password];
    }
  
    const [username, password] = onUserAvailable();
    cy.url().should('contain', 'users');

  //Check Login with bettor
  cy.visit('https://dev.bookofblack.com/');
  cy.get('input[placeholder="UserName"]').clear().type(username);
  cy.get('input[placeholder="Password"]').clear().type(password);
  cy.get('button[type=submit]').click();
  cy.get('button.MuiButton-containedSizeSmall.css-18qmf20').click();
  cy.get('.css-u5uxub').should('contain', 'Better');  // Assuming the user is redirected to the dashboard upon successful login
    
  });
