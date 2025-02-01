import HeaderComponent from "../components/HeaderComponent";


  
export function calculateAndverifyLedger_WinLoss_EndBalance_deposits(trader) {

  let summary = {
    totalAmountSum: 0,
    totalCashDeposits: 0,
    countCashDeposits: 0,
    totalCreditDeposits: 0,
    countCreditDeposits: 0,
    totalCashWithdrawals: 0,
    countCashWithdrawals: 0,
    totalCreditWithdrawals: 0,
    countCreditWithdrawals: 0,
    winningAmount: 0,
    remainingBalance: 0,
    endBalance: 0,
    username: '',  
  };
    cy.get('table tbody tr').each(($row) => {
      
      // Extract the description, amount and balance value of the current row and remove commas
      const description = $row.find('td').eq(2).text().trim();
      const amountText = $row.find('td').eq(5).text().trim();
      const amount = parseFloat(amountText.replace(/,/g, '')) || 0;
      const balanceText = $row.find('td').eq(-1).text().trim(); // Assuming balance is in the last column
      const balance = parseFloat(balanceText.replace(/,/g, '')) || 0;
  
      // Add amount to the total sum
      summary.totalAmountSum += amount;
  
      // Categorize deposits and withdrawals
      if (description.includes('Cash deposit')) {
        summary.totalCashDeposits += amount;
        summary.countCashDeposits++;
      } else if (description.includes('Credit deposit')) {
        summary.totalCreditDeposits += amount;
        summary.countCreditDeposits++;
      } else if (description.includes('Cash withdra')) {
        summary.totalCashWithdrawals += amount;
        summary.countCashWithdrawals++;
      } else if (description.includes('Credit withdra')) {
        summary.totalCreditWithdrawals += amount;
        summary.countCreditWithdrawals++;
      }
    }).then(() => {
      // Check if there's a next page
      cy.get('.ant-pagination-next > .ant-pagination-item-link')
        .scrollIntoView()
        .then(($nextButton) => {
          if ($nextButton.is(':visible') && !$nextButton.is(':disabled')) {
            // Click the "Next" button and process the next page
            cy.log('Next button is visible and enabled.');
            cy.wrap($nextButton).click({ force: true });
            cy.wait(5000); // Wait for the next page to load
            calculateAndverifyLedger_WinLoss_EndBalance_deposits(); // Recursive call for the next page
          } else {
            cy.log('Reached the last page.');
            // Once on the last page, find the last row in the table
            cy.get('table tbody tr').last().then(($lastRow) => {
              const balanceText = $lastRow.find('td').eq(-1).text().trim(); // Adjust index for balance column
              const endBalance = parseFloat(balanceText.replace(/,/g, '')) || 0;
              summary.endBalance = endBalance; // Assign to summary object
              cy.log('Balance in the last row (endBalance):', endBalance);
            }).then(() => {
              // Finalize summary once all pages are processed
              summary.remainingBalance = summary.totalAmountSum; // Use totalAmountSum for remaining balance
  
              // Calculate winning or losing amount
              summary.winningAmount =
                summary.totalAmountSum -
                summary.totalCashDeposits -
                summary.totalCreditDeposits -
                summary.totalCashWithdrawals -
                summary.totalCreditWithdrawals;
  
              // Output results
              cy.log('Summary:', JSON.stringify(summary, null, 2));
              cy.log(`Username: ${summary.username}`);
              cy.log(`Remaining Balance: ${summary.remainingBalance}`);
              cy.log(`End Balance: ${summary.endBalance}`);
              cy.log(`Total Cash Deposits: ${summary.totalCashDeposits} (Count: ${summary.countCashDeposits})`);
              cy.log(`Total Credit Deposits: ${summary.totalCreditDeposits} (Count: ${summary.countCreditDeposits})`);
              cy.log(`Total Cash Withdrawals: ${summary.totalCashWithdrawals} (Count: ${summary.countCashWithdrawals})`);
              cy.log(`Total Credit Withdrawals: ${summary.totalCreditWithdrawals} (Count: ${summary.countCreditWithdrawals})`);
  
              // Determine winning or losing
              if (summary.winningAmount > 0) {
                cy.log(`Bettor Won: ${summary.winningAmount}`);
              } else {
                cy.log(`Bettor Lost: ${Math.abs(summary.winningAmount)}`);
              }
              const balancediff = Math.abs(summary.remainingBalance - summary.endBalance)

              if (!(balancediff >= 1 && balancediff <= 10)) {
                cy.log('Remaining balance is equal to the end balance.');
              } else {
                cy.log('Discrepancy detected: Remaining balance does not match the end balance.');
                throw new Error('Remaining balance and end balance are not equal.');
              }
            });
          }
        });
    })
    return summary;
}

export function calculateAndverifyLedger_WinLoss_EndBalance_deposits_Api(parentUserId = 45317) {
  const currentDate = new Date()
  return cy.request({
      method: "GET",
      url: `https://production.1obet.net/api/getAllUsers?userId=${parentUserId}`,
      headers: {
          Authorization: `Bearer ${Cypress.env('authToken')}`,
      },
  }).then((response) => {
      expect(response.status).to.eq(200); // Ensure the API request is successful
      const users = response.body.results.docs; // Extract the list of users
      //cy.log('Fetched Users:', JSON.stringify(users, null, 2));
      const results = []; // To store the test results for each user

      // Loop through each user
      return Cypress.Promise.map(users, (user) => {
          const summary = {
              totalAmountSum: 0,
              totalCashDeposits: 0,
              countCashDeposits: 0,
              totalCreditDeposits: 0,
              countCreditDeposits: 0,
              totalCashWithdrawals: 0,
              countCashWithdrawals: 0,
              totalCreditWithdrawals: 0,
              countCreditWithdrawals: 0,
              winningAmount: 0,
              remainingBalance: 0,
              endBalance: 0,
              username: user.userName,
              role: user.role,
          };
          const userId = user.userId;
          const startDate = "2024-11-01"; // Specify or dynamically set the date range
          const endDate = currentDate.toISOString().split('T')[0];
          
          return cy
              .request({
                  method: "POST",
                  failOnStatusCode: false,
                  url: "https://production.1obet.net/api/getLedgerDetails",
                  body: {
                      userId: userId,
                      startDate: startDate,
                      endDate: endDate,
                      numRecords: 100000,
                      page: 1,
                      type: "",
                  },
                  headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${Cypress.env('authToken')}`,
                  },
              })
              .then((ledgerResponse) => {
                  // Process and validate ledger details
                  if (ledgerResponse.status !== 200) {
                    results.push({ user: user.userName, status: "API error", reason: "API error found" });
                    cy.log(`API error found for userId: ${userId} -  ${summary.username}`);
                    return;
                }
                  if (!ledgerResponse.body?.results?.docs?.length) {
                      results.push({ user: user.userName, status: "No ledger data", reason: "No ledger data found or API error" });
                      cy.log(`No ledger data found for userId: ${userId} -  ${summary.username}`);
                      return;
                  }
                  const ledgerDetails = ledgerResponse.body.results.docs;

                  ledgerDetails.forEach((entry) => {
                      const description = entry.description || "";
                      const amount = parseFloat(entry.amount) || 0;

                      summary.totalAmountSum += amount;

                      if (description.includes("Cash deposit")) {
                          summary.totalCashDeposits += amount;
                          summary.countCashDeposits++;
                      } else if (description.includes("Credit deposit")) {
                          summary.totalCreditDeposits += amount;
                          summary.countCreditDeposits++;
                      } else if (description.includes("Cash withdra")) {
                          summary.totalCashWithdrawals += amount;
                          summary.countCashWithdrawals++;
                      } else if (description.includes("Credit withdra")) {
                          summary.totalCreditWithdrawals += amount;
                          summary.countCreditWithdrawals++;
                      }
                  });

                  const lastEntry = ledgerDetails[ledgerDetails.length - 1];
                  summary.endBalance += parseFloat(lastEntry.balance) || 0;

                  // Final validations
                  summary.remainingBalance = summary.totalAmountSum;
                  summary.winningAmount =
                      summary.totalAmountSum -
                      summary.totalCashDeposits -
                      summary.totalCreditDeposits -
                      summary.totalCashWithdrawals -
                      summary.totalCreditWithdrawals;

                  cy.log('Final Summary:', JSON.stringify(summary, null, 2));    

                  // const isBalanceMatched = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].some(
                  //     (offset) => summary.remainingBalance === summary.endBalance + offset
                  // );
                  const balancediff = Math.abs(summary.remainingBalance - summary.endBalance)

                  if (!(balancediff >= 0 && balancediff <= 10)) {
                  //if (!isBalanceMatched) {
                      results.push({
                          user: summary.username,
                          role: summary.role,
                          status: "Failed",
                          reason: "Remaining balance does not match end balance",
                      });
                      cy.log(`Username: ${summary.username}`);
                      cy.log(`Remaining Balance: ${summary.remainingBalance} != ${summary.endBalance}`);
                  } else {
                      results.push({ user: summary.username, status: "Passed" });
                      cy.log(`Username: ${summary.username}`);
                      cy.log(`Remaining Balance: ${summary.remainingBalance} = ${summary.endBalance}`);
                  }
              });
      }).then(() => results); // Return all results after processing
  });
}


export function exploreLedgerOf(childuser){

    // Visit the page containing the users' list
    let headerComponent = new HeaderComponent()
    headerComponent.exploreUsers()
        
    //usersPage.searchUser('12ahmad')
    //usersPage.searchbtnClick()

    // Specify the username you want to target
    const targetUsername = childuser; // Replace with the actual username

    cy.window().then((win) => {
        const openSpy = cy.spy(win, 'open').as('windowOpen'); // Spy on the window.open method
      });
    
    // Find the row with the target username
    cy.wait(1000)
    cy.contains('tr', targetUsername).within(() => {
        // Find and click the ledger button/icon in the Actions column
        cy.get('.style_ledgerBtn__BPc1b').click(); // Replace with the actual selector for the ledger button
    });

    // Capture the URL from the spy
    cy.get('@windowOpen').then((spy) => {
        const newWindowUrl = spy.args[0][0]; // First argument to window.open is the URL
        cy.visit(newWindowUrl); // Navigate to the new window's URL
     });

    // If new window is accessible, verify that it is visible
    cy.get('.style_ledgerReportData__qvONp').should('be.visible'); // Replace with the actual modal selector
    
}

export function exploreLedgerOf_Api(childUser, startDate, endDate) {
  const ledgerApiUrl = 'https://production.1obet.net/api/getLedgerDetails';

  // Dynamic payload for the API
  const payload = {
    userId: childUser,
    startDate: startDate,
    endDate: endDate,
    numRecords: 1000,
    page: 1,
    type: "", // Add specific type if needed
  };

  // Send API request
  cy.request({
    method: 'POST',
    url: ledgerApiUrl,
    body: payload,
    failOnStatusCode: false,
    headers: {
      Authorization: `Bearer ${Cypress.env('authToken')}`,
    },
  }).then((response) => {
    // Validate response
    expect(response.status).to.eq(200);
    const ledgerDetails = response.body;

    // Perform validation or further processing
    if (ledgerDetails.length > 0) {
      cy.log('ledger entries found for the user.');
    } else {
      cy.log('No ledger entries found for the user.');
    }
  });
}


export function pickDate(){

    cy.wait(3000);
        
    cy.get('.react-datetime-picker__calendar-button').eq(0).click(); // Click on the button to open the date picker
    // Select the year dropdown (if the calendar shows year selector)
    cy.get('.react-calendar__navigation__label__labelText').click();

    // Select the month dropdown and change the month to November (if the calendar shows month selector)
    cy.get('abbr[aria-label]').contains('November').click(); // Click on the selected month option
    // Now select the date (November 1, 2024)
    cy.get('button').contains(/^1$/) // Look for the day 
        .click(); // Click on the day
    
    cy.get('.style_btnStyle__bSdPz').contains('Submit').click()
    cy.wait(3000)

}


export function verifyBalanceEachRow(){

  let cumulativeSum = 0; // Declare globally to maintain across pages
      nextPage()
      function nextPage() {  
        cy.get('table tbody tr').each(($row, index) => {
          // Calculate cumulative sum for the current row, considering the previous pages' sum
          const amountText = $row.find('td').eq(5).text().trim();
          const amount = parseFloat(amountText.replace(/,/g, '')) || 0;
          cumulativeSum += amount; // Add to the global cumulative sum
      
          const balanceText = $row.find('td').eq(-1).text().trim(); // Assuming balance is in the last column
          const balance = parseFloat(balanceText.replace(/,/g, '')) || 0;
      
          // Compare cumulative sum up to this row with the balance of the current row
          
         // New code with array offsets:
          const isBalanceMatched = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].some((offset) => {
            return cumulativeSum === balance + offset;
          });

          if (isBalanceMatched) {
            cy.log(`Row ${index + 1}: Cumulative sum (${cumulativeSum}) matches the balance (${balance})`);
          } else {
            cy.fail(`Row ${index + 1}: Cumulative sum (${cumulativeSum}) does not match the balance (${balance})`);
}

          
        }).then(() => {
          // Check if there's a next page
          cy.get('.ant-pagination-next > .ant-pagination-item-link')
            .scrollIntoView()
            .then(($nextButton) => {
              if ($nextButton.is(':visible') && !$nextButton.is(':disabled')) {
                // Click the "Next" button and process the next page
                cy.log('Next button is visible and enabled.');
                cy.wrap($nextButton).click({ force: true });
                cy.wait(5000); // Wait for the next page to load
                nextPage(); // Recursive call for the next page
              } else {
                cy.log('Reached the last page.');
              }
            });
        });
      }
}