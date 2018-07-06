import { Component } from '@stencil/core';

@Component({
  tag: 'user-account'
})
export class UserAccount {

  render() {
    return [
      <app-header>
        <ion-toolbar slot="secondary-toolbar" color="secondary">
          <ion-title>Manage Account</ion-title>
        </ion-toolbar>
      </app-header>,
      <ion-content>
        <ion-card>
          <ion-card-header>
            <ion-title color='danger'>Danger Zone!</ion-title>
          </ion-card-header>
          <ion-card-content>
            <ion-button color='danger'>Delete Account</ion-button>
          </ion-card-content>
        </ion-card>
      </ion-content>
    ];
  }
}