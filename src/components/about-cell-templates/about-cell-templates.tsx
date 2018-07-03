import { Component } from '@stencil/core';

@Component({
  tag: 'about-cell-templates'
})
export class AboutCellTemplates {

  render() {
    return [
      <app-header>
        <ion-toolbar slot="secondary-toolbar" color="secondary">
          <ion-title>Cell Templates</ion-title>
        </ion-toolbar>
      </app-header>,
      <ion-content padding>
        <p>Cell templates can be plain text values that will be repeated for every row that is generated, but they can also be templates for auto-generated content.
          <br /><br />
          For example, using the <b>{'{'}x{'}'}</b> tag with be replaced with an auto-incremented integer value.
          <br /><br />
          See the table below for the complete reference on how tags can be used.
        </p>
      </ion-content>,
      <ion-footer>
        <ion-grid>
          <ion-row>
            <ion-col>
              <ion-card onClick={ () => document.querySelector('ion-nav').push('about-named-configurations') }>
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