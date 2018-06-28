import { Component } from '@stencil/core';
import { ENV } from '../../environments/environment';
import { AuthService } from '../../services/auth-service';

@Component({
  tag: 'app-authcallback'
})
export class AppAuthcallback {

  apiBaseUrl: string = new ENV().apiBaseUrl();
  clientUrl: string = new ENV().clientUrl();
  authSvc: AuthService = new AuthService();

  async componentWillLoad() {

    try {
      await this.authSvc.handleAuthentication();
    } catch {}
  }

  async componentDidLoad() {

    if (await this.authSvc.getIsUserAuthenticated()) {
      document.querySelector('ion-nav').push('app-home');
    }
  }
}