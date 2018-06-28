import { Component } from '@stencil/core';
import { AuthService } from '../../services/auth-service';

@Component({
  tag: 'user-signin'
})
export class UserSigning {

  authSvc: AuthService = new AuthService();

  async componentWillLoad() {

    await this.authSvc.initiateAuthentication();
  }

  render() {
    return [
      <p>Redirecting you for authentication...</p>
    ];
  }
}