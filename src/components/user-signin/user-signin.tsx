import { Component, State } from '@stencil/core';

@Component({
  tag: 'user-signin'
})
export class UserSignin {

  @State() emailAddress: string;
  @State() password: string;

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
          <ion-button>Sign In</ion-button>
        </ion-card-content>
      </ion-card>
    ];
  }
}