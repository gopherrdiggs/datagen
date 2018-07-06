import { Component, Event, EventEmitter, Listen, State } from '@stencil/core';
import { ENV } from '../../environments/environment';
declare const AmazonCognitoIdentity: any;

@Component({
  tag: 'user-signin'
})
export class UserSignin {

  @Event() userSignedIn: EventEmitter;
  @State() _emailAddress: string;
  @State() _password: string;
  @State() _userMessage: string;
  env: ENV = new ENV();
  userPool: any;
  currentUser: any;

  componentWillLoad() {
    
    // Create a user pool object as a means of executing pool-related functions (e.g., signUp())
    this.userPool = new AmazonCognitoIdentity.CognitoUserPool({
      UserPoolId: this.env.iamUserPoolId(),
      ClientId: this.env.iamUserPoolClientId()
    });
  }

  signIn() {
    
    var userData = {
      Username: this._emailAddress.replace('@', '-at-'),
      Pool: this.userPool
    };

    // Create a user object as a means of executing user-related functions
    this.currentUser = new AmazonCognitoIdentity.CognitoUser(userData);

    var authenticationData = {
      Username: this._emailAddress.replace('@', '-at-'),
      Password: this._password
    }

    var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);
    
    this.currentUser.authenticateUser(authenticationDetails, {
      onSuccess: this.authenticateUserSucceeded.bind(this),
      onFailure: this.authenticateUserFailed.bind(this)
    });
  }

  authenticateUserSucceeded(result) {
    
    localStorage.setItem('datagen_userEmail', this._emailAddress);
    localStorage.setItem('datagen_userJwtToken', result.accessToken.jwtToken);
    this.userSignedIn.emit();
  }

  authenticateUserFailed(error) {
    
    this._userMessage = error.message;
  }

  @Listen('ionChange')
  handleFieldChange(event: any) {
    if (event && event.detail) {
      if (event.target.id === "email") {
        this._emailAddress = event.detail.value;
      }
      else if (event.target.id === "password") {
        this._password = event.detail.value;
      }
    }
  }

  render() {
    return[
      <ion-card>
        <ion-card-content>
          <ion-item>
            <ion-note slot='start' color='tertiary'>Use this form to sign in with an existing account.</ion-note>
          </ion-item>
          <ion-item>
            <ion-label>Email Address</ion-label>
            <ion-input id="email"
                      type="email"
                      placeholder="you@awesome.com"
                      value={ this._emailAddress }></ion-input>
          </ion-item>
          <ion-item>
            <ion-label>Password</ion-label>
            <ion-input id="password"
                      type="password"
                      value={ this._password }></ion-input>
          </ion-item>
          <ion-item></ion-item>
          <ion-button onClick={ () => this.signIn() }>
            Sign In
          </ion-button>
        <ion-item style={{ display: this._userMessage ? 'block' : 'none'}}>
          { this._userMessage }
        </ion-item>
        </ion-card-content>
      </ion-card>
    ];
  }
}