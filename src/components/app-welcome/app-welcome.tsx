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
        <h2>Getting Started</h2>
        <p>DataGen is a lightweight application to help you generate potentially very large spreadsheets in a matter of seconds, right from your browser.<br/><br/>
           To get a better understanding of the app, navigate through the Getting Started information using the buttons at the bottom of the screen.<br/><br/>
           If you're ready to jump right in and generate a spreadsheet, click <a href="/home">here</a>.</p>
      </ion-content>,
      <ion-footer>
        <ion-grid>
          <ion-row>
            <ion-col>
              
            </ion-col>
            <ion-col>
              <ion-card onClick={ () => document.querySelector('ion-nav').push('about-named-configurations') }>
                <ion-card-header>Next</ion-card-header>
                <ion-card-content>
                  <h1>Named Configurations</h1>
                </ion-card-content>
              </ion-card>
            </ion-col>
          </ion-row>
        </ion-grid>
      </ion-footer>
    ];
  }
}