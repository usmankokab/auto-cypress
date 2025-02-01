import BasePage from "./BasePage";
const routes = require('../config/routes');
import { ENDPOINT_PREFIX } from "../config/CONSTANTS";

class LoginPage extends BasePage{

    //get usernameInput() { return cy.get('input[placeholder="UserName'); }
    get usernameInput() { return cy.get('input[placeholder="Username'); }
    get passwordInput() { return cy.get('input[placeholder="Password"'); }
    get loginBtn() { return cy.get("button[type=submit]"); }
    get alertMsg() { return cy.get('button.MuiButton-containedSizeSmall.css-18qmf20'); }

    open() {
        //cy.visit('?route=account/login');   //Prefixes the baseUrl
        //cy.visit(Cypress.env('URL'));   //loads the URL from env object in cypress.config.js
        return super.open(ENDPOINT_PREFIX + routes.LOGIN_ENDPOINT)
    }

    // openRegistrationPage() {
    //     this.open();
    //     this.continueBtn.click();
    // }

    loginWithUI(user, password) {
        this.open();
        this.usernameInput.clear().type(user)
        this.passwordInput.type(password)
        this.loginBtn.click()
  
    }

}


export default new LoginPage();

