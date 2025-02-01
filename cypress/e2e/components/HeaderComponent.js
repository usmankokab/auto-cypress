export default class HeaderComponent {

    //get searchInput() { return cy.get('#search input[name="search"]'); }
    //get searchBtn() { return cy.get('#search button'); }
    //cy..click();
    
    get disclaimer(){return cy.get('button.MuiButton-containedSizeSmall.css-18qmf20');}
    get myAccountDropdown() { return cy.get(':nth-child(1) > .style_profileUserNameText__EeMIe'); }
    //get shoppingCart() { return cy.get('#top-links a[title="Shopping Cart"]'); }
    get logoutLink() { return cy.get('span[class = "anticon anticon-logout"]'); }
    //get wishListMenu() { return cy.get('#top-links #wishlist-total'); }
    get clickUsers(){return cy.contains('div', 'Users')}

    
    performLogout() {
        this.myAccountDropdown.click();
        this.logoutLink.click();
    }

    closeDisclaimer() {
        this.disclaimer.if('visible').then(($el) => {
            try {
                this.disclaimer.click()
            } catch (error) {
              // ignore the error and continue the test
                this.disclaimer.click()
            }
        })        
    }

    exploreUsers() {
        cy.contains('div', 'Users').click();
    }


    //////////////////////////////////////////////////////////////////////////////////////////
    searchProduct(product) {
        this.searchInput.clear()
        this.searchInput.type(product);
        this.searchBtn.click();
    }

    

    openShoppingCart() {
        this.shoppingCart.click()
    }

    

}
