import { Component } from '@stencil/core';

@Component({
  tag: 'about-named-configurations'
})
export class AboutNamedConfigurations {

  render() {
    return [
      <app-header>
        <ion-toolbar slot="secondary-toolbar" color="secondary">
          <ion-title>Named Configurations</ion-title>
        </ion-toolbar>
      </app-header>,
      <ion-content padding>
        <p>Named configurations are...</p>
      </ion-content>,
      <ion-footer>
        <ion-grid>
          <ion-row>
            <ion-col>
              <ion-card onClick={ () => document.querySelector('ion-nav').push('app-welcome') }>
                <ion-card-header>Previous</ion-card-header>
                <ion-card-content>
                  <h1>Welcome!</h1>
                </ion-card-content>
              </ion-card>
            </ion-col>
            <ion-col>
              <ion-card onClick={ () => document.querySelector('ion-nav').push('about-cell-templates') }>
                <ion-card-header>Next</ion-card-header>
                <ion-card-content>
                  <h1>Cell Templates</h1>
                </ion-card-content>
              </ion-card>
            </ion-col>
          </ion-row>
        </ion-grid>
      </ion-footer>
    ];
  }
}