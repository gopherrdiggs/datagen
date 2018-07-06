import { Component, Event, EventEmitter, Listen, Prop } from '@stencil/core';

@Component({
  tag: 'app-root'
})
export class AppRoot {

  @Event() userSignedOut: EventEmitter;
  @Prop({ connect: 'ion-toast-controller' }) toastCtrl: HTMLIonToastControllerElement;

  /**
   * Handle service worker updates correctly.
   * This code will show a toast letting the
   * user of the PWA know that there is a
   * new version available. When they click the
   * reload button it then reloads the page
   * so that the new service worker can take over
   * and serve the fresh content
   */
  @Listen('window:swUpdate')
  async onSWUpdate() {
    const toast = await this.toastCtrl.create({
      message: 'New version available',
      showCloseButton: true,
      closeButtonText: 'Reload'
    });
    await toast.present();
    await toast.onWillDismiss();
    window.location.reload();
  }

  async signOut() {

    localStorage.removeItem('datagen_userEmail');
    this.userSignedOut.emit();
    const toast = await this.toastCtrl.create({
      message: 'See ya later!',
      duration: 5000
    });
    await toast.present();
  }

  configureRoutes() {
    return(
      <ion-router useHash={false}>
        <ion-route-redirect from="/" to="/welcome" />
        <ion-route url="/welcome" component="app-welcome" />
        <ion-route url="/named-configurations" component="about-named-configurations" />
        <ion-route url="/cell-templates" component="about-cell-templates" />
        <ion-route url="/spreadsheetgen" component="app-home" />
        <ion-route url="/signin-register" component="signin-register" /> 
        <ion-route url="/user-account" component="user-account" /> 
        <ion-route url="/authcallback" component="app-authcallback" />
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
                <ion-item button href='/named-configurations'>Named Configurations</ion-item>
                <ion-item button href='/cell-templates'>Cell Templates</ion-item>
              </ion-list>
              <ion-list>
                <ion-item disabled>Main Navigation</ion-item>
                <ion-item button href='/spreadsheetgen'>Spreadsheet Generator</ion-item>
              </ion-list>
              <ion-list>
              <ion-item disabled>Account</ion-item>
                <ion-item button href='/signin-register'>Sign In / Register</ion-item>
                <ion-item button href='/user-account'>Manage Account</ion-item>
                <ion-item button onClick={ () => this.signOut() }>Sign Out</ion-item>
              </ion-list>
            </ion-content>
          </ion-menu>
          <ion-nav main animated={false}/>
        </ion-split-pane>
      </ion-app>
    );
  }
}