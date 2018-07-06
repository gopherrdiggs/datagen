import { Component, Listen, State } from '@stencil/core';
import { ENV } from '../../environments/environment';
declare const AmazonCognitoIdentity: any;

@Component({
  tag: 'user-register'
})
export class UserRegister {

  @State() _emailAddress: string;
  @State() _password: string;
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

  async displayModal(component: string, componentProps?: any) {

    const modalController = document.querySelector('ion-modal-controller');
    const modal = await modalController.create({
      component: component,
      componentProps: componentProps
    });
    await modal.present();
  }

  async registerUser() {

    var emailAttr = new AmazonCognitoIdentity.CognitoUserAttribute({
      Name: 'email',
      Value: this._emailAddress
    });

    // Register new user account with email address and password
    this.userPool.signUp(
      this._emailAddress.replace('@', '-at-'),
      this._password,
      [emailAttr],
      null, this.registrationCallback);
  }

  async registrationCallback(error, result) {
    if (error) {
      console.log("registration error occurred:");
      console.log(error);
    }
    else {
      console.log("user registered successfully:");
      console.log(result);
      await this.verifyAccount();
    }
  }

  async verifyAccount() {

    await this.displayModal('user-verification', {
      emailAddress: this._emailAddress
    });
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
            <ion-note slot='start' color='tertiary'>Use this form to create a new account.</ion-note>
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
          <ion-button onClick={ () => this.registerUser() }>
            Register
          </ion-button>
          <ion-button fill='clear' 
                      onClick={ () => this.verifyAccount() }>
            Verify Account
          </ion-button>
        </ion-card-content>
      </ion-card>
    ];
  }
}