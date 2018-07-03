import { Component } from '@stencil/core';

@Component({
  tag: 'app-header'
})
export class AppHeader {

  render() {
    return (
      <ion-header>
        <ion-toolbar color='primary'>
          <ion-buttons slot="start">
            <ion-menu-button></ion-menu-button>
          </ion-buttons>
          <ion-title>DataGen</ion-title>
          <ion-buttons slot="end">
            <ion-button href='/signin-register'>Sign In / Register</ion-button>
          </ion-buttons>
        </ion-toolbar>
        <slot name="secondary-toolbar"/>
      </ion-header>
    );
  }
}