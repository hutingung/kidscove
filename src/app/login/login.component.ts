import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { OAuthService } from 'angular-oauth2-oidc';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {

  user: Observable<firebase.User>;

  constructor(public afAuth: AngularFireAuth, private oAuthService: OAuthService) {
    this.user = afAuth.authState;
    console.log("user:", afAuth);
  }

  login() {
    this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

  logout() {
    this.afAuth.auth.signOut();
  }
  
  public loginIntuit() {
       this.oAuthService.initImplicitFlow();
  }
    
  public logoutIntuit() {
        this.oAuthService.logOut();
  }
  
  public get name() {
    return 'a';
  }
    
}