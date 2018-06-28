import { Component, Element, Event, EventEmitter, Listen, State } from '@stencil/core';

@Component({
  tag: 'configuration-create'
})
export class ConfigurationCreate {

  @Element() el: any;
  @Event() configurationCreated: EventEmitter;
  @State() configName: string;
  @State() isFormValid: boolean;

  saveConfiguration() {

    this.dismiss(this.configName);
  }

  dismiss(data?: any) {
    
    if (data) {
      this.configurationCreated.emit(data);
    }
    (this.el.closest('ion-modal') as any).dismiss();
  }

  @Listen('ionChange')
  handleFieldChange(event: any) {
    if (event && event.detail) {
      if (event.target.id === "configName") {
        this.configName = event.detail.value;
        this.isFormValid = this.configName.length > 0;
      }
    }
  }

  render() {
    return [
      <ion-header>
        <ion-toolbar color="primary">
          <ion-title>
            Create Configuration
          </ion-title>
        </ion-toolbar>
      </ion-header>,
      <ion-content padding>
        <ion-item></ion-item>
        <ion-item>
          <ion-label>Configuration Name</ion-label>
          <ion-input id="configName"></ion-input>
        </ion-item>
        <ion-item></ion-item>
        <ion-button disabled={ this.isFormValid ? false : true } 
                    onClick={ () => this.saveConfiguration() }>
          Create Configuration
        </ion-button>
      </ion-content>
    ];
  }
}