require("module-alias/register");
import { App } from "@base/app";

/**
 * entry point for boats api
 */
const app = new App();
app.start();

// TODO:  you will make resources which are protected behind some 
//          variety of login. The specifics of the login system are up 
//          to you but you will need to use JWTs when it comes to 
//          making requests of the API which access protected resources.