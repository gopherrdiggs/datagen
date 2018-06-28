import { Component } from '@stencil/core';

@Component({
  tag: 'about-cell-templates'
})
export class AboutCellTemplates {

  render() {
    return [
      <app-header>
        <ion-toolbar slot="secondary-toolbar" color="secondary">
          <ion-title>About Cell Templates</ion-title>
        </ion-toolbar>
      </app-header>,
      <ion-content padding>
        <p>Cell templates are...</p>
      </ion-content>,
      <ion-footer>
        <ion-grid>
          <ion-row>
            <ion-col>
              <ion-card onClick={ () => document.querySelector('ion-nav').push('about-saved-configurations') }>
                <ion-card-header>Previous</ion-card-header>
                <ion-card-content>
                  <h1>Saved Configurations</h1>
                </ion-card-content>
              </ion-card>
            </ion-col>
            <ion-col>
              <ion-card onClick={ () => document.querySelector('ion-nav').push('app-home') }>
                <ion-card-header>Next</ion-card-header>
                <ion-card-content>
                  <h1>Generate a Spreadsheet!</h1>
                </ion-card-content>
              </ion-card>
            </ion-col>
          </ion-row>
        </ion-grid>
      </ion-footer>
    ];
  }
}