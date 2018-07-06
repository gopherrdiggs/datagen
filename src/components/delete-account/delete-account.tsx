import { Component, Prop } from '@stencil/core';
import { ENV } from '../../environments/environment';
declare const AmazonCognitoIdentity: any;

@Component({
  tag: 'delete-account'
})
export class DeleteAccount {

  @Prop() emailAddress: string;
  env: ENV = new ENV();
  userPool: any;
  currentUser: any;

  componentWillLoad() {
    
    // Create a user pool object as a means of executing pool-related functions (e.g., signUp())
    this.userPool = new AmazonCognitoIdentity.CognitoUserPool({
      UserPoolId: this.env.iamUserPoolId(),
      ClientId: this.env.iamUserPoolClientId()
    });
    
    var userData = {
      Username: this.emailAddress.replace('@', '-at-'),
      Pool: this.userPool
    };

    // Create a user object as a means of executing user-related functions
    this.currentUser = new AmazonCognitoIdentity.CognitoUser(userData);
  }

  deleteAccount() {

    this.currentUser.deleteUser(function(err, result) {
      if (err) {
        console.log("error occurred for deleteUser:");
        console.log(err);
      }
      else {
        console.log("user deleted successfully:");
        console.log(result);
      }
    });
  }

  render() {
    return [

    ];
  }
}