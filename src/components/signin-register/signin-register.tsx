import { Component, Listen, State } from '@stencil/core';

@Component({
  tag: 'signin-register'
})
export class SigninRegister {

  @State() emailAddress: string;
  @State() password: string;
  @State() componentToDisplay: any;
  @State() signingIn: boolean = true;

  @Listen('ionChange')
  handleFieldChange(event: any) {
    
    if (event && event.detail) {
      if (event.target.id === "email") {
        this.emailAddress = event.detail.value;
      }
      else if (event.target.id === "password") {
        this.password = event.detail.value;
      }
      else if (event.detail.value === "signin") {
        this.signingIn = true;
      }
      else if (event.detail.value === "register") {
        this.signingIn = false;
      }
    }
  }

  render() {
    return [
      <app-header>
        <ion-toolbar slot="secondary-toolbar" color="secondary">
          <ion-title>Sign In / Register</ion-title>
        </ion-toolbar>
      </app-header>,
      <ion-content>
        <ion-card>
          <ion-card-content>
            <ion-segment>
              <ion-segment-button value="signin">
                Sign In
              </ion-segment-button>
              <ion-segment-button value="register">
                Register
              </ion-segment-button>
            </ion-segment>
            { this.signingIn
              ? <user-signin></user-signin>
              : <user-register></user-register>
            }
          </ion-card-content>
        </ion-card>
      </ion-content>
    ];
  }
}