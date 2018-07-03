export class ENV {

  public static currentEnvironment: string = "dev";
  //public static currentEnvironment: string = "prod";

  hostName() {
    switch (ENV.currentEnvironment) {
      case "dev": {
        return "localtest.me";
      }
      case "prod": {
        return "myapp.com";
      }
      default: {
        return "";
      }
    }
  }

  clientUrl() {
    switch (ENV.currentEnvironment) {
      case "dev": {
        return `http://${this.hostName()}:3333`;
      }
      case "prod": {
        return `https://${this.hostName()}`;
      }
      default: {
        return "";
      }
    }
  }

  serverUrl() {
    switch (ENV.currentEnvironment) {
      case "dev": {
        return `http://localhost:64659`;
      }
      case "prod": {
        return "https://myapp.azurewebsites.net";
      }
      default: {
        return "";
      }
    }
  }
  
  apiBaseUrl() {
    return `${this.serverUrl()}/api`;
  }
  
  awsRegion() {
    return 'us-east-2';
  }

  apiInvokeUrl() {
    switch (ENV.currentEnvironment) {
      case "dev": {
        return "";
      }
      case "prod": {
        return "https://jl4lsjpe53.execute-api.us-east-2.amazonaws.com/prod";
      }
      default: {
        return "";
      }
    }
  }

  iamUserPoolId() {
    return 'us-east-2_TnkWZ2hqy';
  }

  iamUserPoolClientId() {
    return 'o7598qg7b9e4gn63210btjn7q';
  }

};