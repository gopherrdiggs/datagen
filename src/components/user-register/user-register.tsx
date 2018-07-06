import { Component, Listen, State } from '@stencil/core';
declare const AmazonCognitoIdentity: any;

@Component({
  tag: 'user-register'
})
export class UserRegister {

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

  async registerUser() {

    var emailAttr = new AmazonCognitoIdentity.CognitoUserAttribute({
      Name: 'email',
      Value: this.emailAddress
    });

    // Register new user account with email address and password
    this.userPool.signUp(
      this.emailAddress.replace('@', '-at-'),
      this.password,
      [emailAttr],
      null, this.registrationCallback);
  }

  registrationCallback(error, result) {
    if (error) {
      console.log("registration error occurred:");
      console.log(error);
    }
    else {
      console.log("user registered successfully:");
      console.log(result);
    }
  }

  verifyAccount() {

    var userData = {
      Username: this.emailAddress.replace('@', '-at-'),
      Pool: this.userPool
    };

    // Create a user object as a means of executing user-related functions
    this.currentUser = new AmazonCognitoIdentity.CognitoUser(userData);

    this.currentUser.confirmRegistration('701459', false, this.verificationCallback);
  }

  verificationCallback(error, result) {
    if (error) {
      console.log("verification error occurred:");
      console.log(error);
    }
    else {
      console.log("account verified successfully:");
      console.log(result);
    }
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
            <ion-note slot='start' color='tertiary'>Use this form to create a new account.</ion-note>
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
          <ion-button onClick={ () => this.registerUser() }>
            Register
          </ion-button>
          <ion-button onClick={ () => this.verifyAccount() }>
            Verify Account
          </ion-button>
        </ion-card-content>
      </ion-card>
    ];
  }
}