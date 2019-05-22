// TODO: If you choose to implement your own JWT provider then you 
//      will also need to implement user accounts. If you choose to 
//      use a 3rd party provider then you do not need to implement 
//      user accounts but you do need to detail how the authentication 
//      flow works between your API and the 3rd party identity provider.
//      Some examples of providers you could use are Google or Auth0.

// TODO: If you do implement user accounts all that is required is 
//      that each account store a user name and password. It is bad 
//      practice to store non-salted and hashed passwords, however for 
//      this assignment storing plain text passwords is acceptable.

import * as json2html from "json2html";
import * as jwt from "express-jwt";
import * as jwksRsa from "jwks-rsa";

export const PROJECT_ID = "hindss-assign7";

export class AuthenticationService {
    private static _instance: AuthenticationService;
    public static get Instance(): AuthenticationService {
        if (!this._instance) this._instance = new AuthenticationService();
        return this._instance;
    }

    public JwtVerifier;

    private constructor() { 
        this.JwtVerifier = jwt({
            secret: jwksRsa.expressJwtSecret({
                cache: true,
                rateLimit: true,
                jwksRequestsPerMinute: 5,
                jwksUri: "https://dev-hdtedn05.auth0.com/.well-known/jwks.json" // TODO: URI?
            }),
            issuer: "https://dev-hdtedn05.auth0.com",  // TODO: issuer?
            algorithms: ["RS256"] 
        });
    }

}