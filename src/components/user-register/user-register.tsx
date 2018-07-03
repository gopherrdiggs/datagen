import { Component, State } from '@stencil/core';
declare const AWS: any;

@Component({
  tag: 'user-register'
})
export class UserRegister {

  @State() emailAddress: string;
  @State() password: string;
  userPool: any;

  componentWillLoad() {

    console.log(AWS);
    console.log(this.userPool);
  }

  registerUser() {

  }

  render() {
    return[
      <ion-card>
        <ion-card-content>
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
          <ion-button onClick={ () => this.registerUser() }>
            Register
          </ion-button>
        </ion-card-content>
      </ion-card>
    ];
  }
}