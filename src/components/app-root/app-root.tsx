import { Component } from '@stencil/core';

@Component({
  tag: 'app-root'
})
export class AppRoot {

  configureRoutes() {
    return(
      <ion-router useHash={false}>
        <ion-route-redirect from="/" to="/welcome" />
        <ion-route url="/home" component="app-home" />
        <ion-route url="/sign-in" component="user-signin" /> 
        <ion-route url="/authcallback" component="app-authcallback" />
        <ion-route url="/welcome" component="app-welcome" />
        <ion-route url="/about-saved-configurations" component="about-saved-configurations" />
        <ion-route url="/about-cell-templates" component="about-cell-templates" />
      </ion-router>
    );
  }

  render() {
    return (
      <ion-app>
        { this.configureRoutes() }
        <ion-split-pane when="lg">
          <ion-menu>
            <ion-header>
              <ion-toolbar color='primary'>
                <ion-title>Menu</ion-title>
              </ion-toolbar>
            </ion-header>
            <ion-content>
              <ion-toast-controller />
              <ion-modal-controller />
              <ion-list>
                <ion-item disabled>Getting Started</ion-item>
                <ion-item button href='/welcome'>Welcome to DataGen!</ion-item>
                <ion-item button href='/about-saved-configurations'>Named Configurations</ion-item>
                <ion-item button href='/about-cell-templates'>Cell Templates</ion-item>
              </ion-list>
              <ion-list>
                <ion-item disabled>Navigation</ion-item>
                <ion-item button href='/home'>Spreadsheet Generator</ion-item>
              </ion-list>
              <ion-list>
              <ion-item disabled>Account</ion-item>
                <ion-item button href='/sign-in'>Sign In</ion-item>
              </ion-list>
            </ion-content>
          </ion-menu>
          <ion-nav main animated={false}/>
        </ion-split-pane>
      </ion-app>
    );
  }
}