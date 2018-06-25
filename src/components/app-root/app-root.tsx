import { Component } from '@stencil/core';

@Component({
  tag: 'app-root',
  styleUrl: 'app-root.css'
})
export class AppRoot {

  configureRoutes() {
    return(
      <ion-router useHash={false}>
        <ion-route-redirect from="/" to="/home" />
        <ion-route url="/home" component="app-home" />
        <ion-route url="/sign-in" component="user-signin" /> 
      </ion-router>
    );
  }

  render() {
    return (
      <ion-app>
        { this.configureRoutes() }
        <ion-split-pane>
          <ion-menu>
            <ion-header>
              <ion-toolbar color='primary'>
                <ion-title>Menu</ion-title>
              </ion-toolbar>
            </ion-header>
            <ion-content>
              <ion-list>
                <ion-item disabled>Navigation</ion-item>
                <ion-item button href='/home'>Home</ion-item>
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