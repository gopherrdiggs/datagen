import { Component } from '@stencil/core';

@Component({
  tag: 'app-welcome'
})
export class AppWelcome {

  render() {
    return [
      <app-header>
        <ion-toolbar slot="secondary-toolbar" color="secondary">
          <ion-title>Welcome to DataGen!</ion-title>
        </ion-toolbar>
      </app-header>,
      <ion-content padding>
        <p>DataGen is...</p>
      </ion-content>,
      <ion-footer>
        <ion-grid>
          <ion-row>
            <ion-col>
              
            </ion-col>
            <ion-col>
              <ion-card onClick={ () => document.querySelector('ion-nav').push('about-saved-configurations') }>
                <ion-card-header>Next</ion-card-header>
                <ion-card-content>
                  <h1>Saved Configurations</h1>
                </ion-card-content>
              </ion-card>
            </ion-col>
          </ion-row>
        </ion-grid>
      </ion-footer>
    ];
  }
}