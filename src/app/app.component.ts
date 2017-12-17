import { Component } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Membership';
   constructor(private oauthService: OAuthService) {
                // Login-Url
        this.oauthService.loginUrl = "https://steyer-identity-server.azurewebsites.net/identity/connect/authorize"; //Id-Provider?

        // URL of the SPA to redirect the user to after login
        this.oauthService.redirectUri = window.location.origin + "/index.html";

        // The SPA's id. Register SPA with this id at the auth-server
        this.oauthService.clientId = "Q0yqMqBBvMu5eoRjXNmhiNp0dQRzSPtUGHTNPt6rNqzzVR5L9H";

        // set the scope for the permissions the client should request
        this.oauthService.scope = "openid profile email voucher";

        // Use setStorage to use sessionStorage or another implementation of the TS-type Storage
        // instead of localStorage
        this.oauthService.setStorage(sessionStorage);

        // To also enable single-sign-out set the url for your auth-server's logout-endpoint here
        this.oauthService.logoutUrl = "https://steyer-identity-server.azurewebsites.net/identity/connect/endsession";

        // This method just tries to parse the token(s) within the url when
        // the auth-server redirects the user back to the web-app
        // It dosn't send the user the the login page
        this.oauthService.tryLogin();      
        this.oauthService.requireHttps=false;
  }
}
