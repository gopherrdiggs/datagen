import { Component, Listen, State } from '@stencil/core';
declare const AmazonCognitoIdentity: any;

@Component({
  tag: 'user-signin'
})
export class UserSignin {

  @State() emailAddress: string;
  @State() password: string;
  userPool: any;
  currentUser: any;

  componentWillLoad() {
    
    // Create a user pool object as a means of executing pool-related functions (e.g., signUp())
    this.userPool = new AmazonCognitoIdentity.CognitoUserPool({
      UserPoolId: 'us-east-2_TnkWZ2hqy',
      ClientId: 'o7598qg7b9e4gn63210btjn7q'
    });
  }

  signIn() {
    
    var userData = {
      Username: this.emailAddress.replace('@', '-at-'),
      Pool: this.userPool
    };

    // Create a user object as a means of executing user-related functions
    this.currentUser = new AmazonCognitoIdentity.CognitoUser(userData);

    var authenticationData = {
      Username: this.emailAddress.replace('@', '-at-'),
      Password: this.password
    }

    var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);
    
    this.currentUser.authenticateUser(authenticationDetails, {
      onSuccess: this.authenticateUserSucceeded,
      onFailure: this.authenticateUserFailed
    });
  }

  authenticateUserSucceeded(result) {
    console.log("authentication successful:");
    console.log(result);
    localStorage.setItem('datagen_userJwtToken', result.accessToken.jwtToken);
  }

  authenticateUserFailed(error) {
    console.log("authentication failed:");
    console.log(error);
  }

  authenticateUserNewPasswordRequired(info) {
    console.log("new password is required:");
    console.log(info);

  }

  deleteUser() {

    console.log("attempting to delete user");
    // var token = localStorage.getItem('datagen_userJwtToken');
    this.currentUser.deleteUser(function(err, result) {
      if (err) {
        console.log("error occurred for deleteUser:");
        console.log(err);
      }
      else {
        console.log("user deleted successfully:");
        console.log(result);
      }
    });
  }

  @Listen('ionChange')
  handleFieldChange(event: any) {
    if (event && event.detail) {
      if (event.target.id === "email") {
        this.emailAddress = event.detail.value;
      }
      else if (event.target.id === "password") {
        this.password = event.detail.value;
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
                      value={ this.emailAddress }></ion-input>
          </ion-item>
          <ion-item>
            <ion-label>Password</ion-label>
            <ion-input id="password"
                      type="password"
                      value={ this.password }></ion-input>
          </ion-item>
          <ion-item></ion-item>
          <ion-button onClick={ () => this.signIn() }>
            Sign In
          </ion-button>
          <ion-button onClick={ () => this.deleteUser() }>
            Delete Account
          </ion-button>
        </ion-card-content>
      </ion-card>
    ];
  }
}