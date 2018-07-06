import { Component, Element, Event, EventEmitter, Listen, Prop, State } from '@stencil/core';
import { ENV } from '../../environments/environment';
declare const AmazonCognitoIdentity: any;

@Component({
  tag: 'user-verification'
})
export class UserVerification {
  
  @Element() el: any;
  @Event() verificationSucceeded: EventEmitter;
  @Prop() emailAddress: string;
  @State() _emailAddress: string;
  @State() _verificationCode: string;
  @State() _isFormValid: boolean;
  @State() _userMessage: string;
  env: ENV = new ENV();
  userPool: any;
  currentUser: any;

  componentWillLoad() {
    this._emailAddress = this.emailAddress;

    // Create a user pool object as a means of executing pool-related functions (e.g., signUp())
    this.userPool = new AmazonCognitoIdentity.CognitoUserPool({
      UserPoolId: this.env.iamUserPoolId(),
      ClientId: this.env.iamUserPoolClientId()
    });
  }

  dismiss(data?: any) {
    
    (this.el.closest('ion-modal') as any).dismiss(data);
  }

  verifyAccount() {
    
    var userData = {
      Username: this._emailAddress.replace('@', '-at-'),
      Pool: this.userPool
    };

    // Create a user object as a means of executing user-related functions
    this.currentUser = new AmazonCognitoIdentity.CognitoUser(userData);

    this.currentUser.confirmRegistration(
      this._verificationCode, false, this.verificationCallback.bind(this));
  }

  verificationCallback(error, result) {
    
    if (error) {
      console.log(error);
      this._userMessage = error.message;
    }
    else {
      console.log(result);
      this._userMessage = result;
      this.dismiss();
    }
  }

  @Listen('ionChange')
  handleFieldChange(event: any) {
    if (event && event.detail) {
      if (event.target.id === "email") {
        this._emailAddress = event.detail.value;
      }
      else if (event.target.id === "verificationCode") {
        this._verificationCode = event.detail.value;
        this._isFormValid = this._verificationCode
          ? this._verificationCode.length > 0
          : false;
      }
    }
  }

  render() {
    return [
      <ion-header>
        <ion-toolbar color="primary">
          <ion-title>
            Enter Validation Code
          </ion-title>
        </ion-toolbar>
      </ion-header>,
      <ion-content padding>
        <ion-item>
          <ion-note>Thanks for registering! We just sent you an email with a verification code. Please enter it below to verify your account.</ion-note>
        </ion-item>
        <ion-item>
          <ion-label>Email Address</ion-label>
          <ion-input id="email" value={ this._emailAddress }></ion-input>
        </ion-item>
        <ion-item>
          <ion-label>Verification Code</ion-label>
          <ion-input id="verificationCode" value={ this._verificationCode }></ion-input>
        </ion-item>
        <ion-item></ion-item>
        <ion-button disabled={ this._isFormValid ? false : true } 
                    onClick={ () => this.verifyAccount() }>
          Verify Account
        </ion-button>
        <ion-item style={{ display: this._userMessage ? 'block' : 'none'}}>
          { this._userMessage }
        </ion-item>
      </ion-content>
    ];
  }
}