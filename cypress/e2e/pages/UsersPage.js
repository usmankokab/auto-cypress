import BasePage from "./BasePage";
const routes = require('../config/routes');
import { ENDPOINT_PREFIX } from "../config/CONSTANTS";

export default class UsersPage extends BasePage{

    get searchInput() { return cy.get('input.ant-input[placeholder="Username"]') }
    get searchbtn() { return cy.get('.style_searchIcon__4WVKW')}
    
    
    searchUser(username) {
        this.searchInput.type(username)    
    }

    searchbtnClick(username) {
        this.searchbtn.click()    
    }

}

//export default new UsersPage();

