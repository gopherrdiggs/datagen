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
  
};