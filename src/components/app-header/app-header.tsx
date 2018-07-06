import { Component, Listen, State } from '@stencil/core';

@Component({
  tag: 'app-header'
})
export class AppHeader {

  @State() _userLoggedIn: boolean;
  @State() _userEmail: string;

  componentWillLoad() {

    this.updateSignedInStatus();
  }

  updateSignedInStatus() {

    var email = localStorage.getItem('datagen_userEmail');
    if (email) {
      this._userEmail = email;
      this._userLoggedIn = true;
    }
    else {
      this._userEmail = '';
      this._userLoggedIn = false;
    }
  }

  @Listen('body:userSignedIn')
  @Listen('body:userSignedOut')
  handleUserSignIn(event: any) {
    
    if (event) {

      this.updateSignedInStatus();
    }
  }

  render() {
    return (
      <ion-header>
        <ion-toolbar color='primary'>
          <ion-buttons slot="start">
            <ion-menu-button></ion-menu-button>
          </ion-buttons>
          <ion-title>DataGen</ion-title>
          <ion-buttons slot="end">
            { this._userLoggedIn
              ? <ion-button href='/user-account'>{ this._userEmail }</ion-button>
              : <ion-button href='/signin-register'>Sign In / Register</ion-button>
            }
          </ion-buttons>
        </ion-toolbar>
        <slot name="secondary-toolbar"/>
      </ion-header>
    );
  }
}