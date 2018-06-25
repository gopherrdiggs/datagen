import { Component } from '@stencil/core';

@Component({
  tag: 'app-home'
})
export class AppHome {
  render() {
    return [
      <app-header>
        <ion-toolbar slot="secondary-toolbar" color="secondary">
          <ion-title>Home</ion-title>
        </ion-toolbar>
      </app-header>,
      <ion-content padding>
        <p>
          Welcome to the app starter.
        </p>
      </ion-content>
    ];
  }
}
