import { Component, Prop } from '@stencil/core';
import { AuthService } from '../../services/auth-service'

@Component({
  tag: 'app-auth'
})
export class AppAuth {

  authSvc: AuthService = new AuthService();
  @Prop() displayScreen: string;

  componentWillLoad() {
    this.authSvc.initiateAuthentication();
  }

  render() {
    return [
      <ion-card>
        Redirecting you for authentication...
      </ion-card>
    ]
  }
}