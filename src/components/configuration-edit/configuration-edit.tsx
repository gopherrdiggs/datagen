import { Component, Element, Event, EventEmitter, Listen, Prop, State } from '@stencil/core';

@Component({
  tag: 'configuration-edit'
})
export class ConfigurationEdit {

  @Element() el: any;
  @Event() configurationEdited: EventEmitter;
  @Prop() configurationName: string;
  @State() configName: string;
  @State() isFormValid: boolean;

  componentWillLoad() {

    this.configName = this.configurationName;
    this.isFormValid = this.configName.length > 0;
  }

  saveConfiguration() {

    this.dismiss(this.configName);
  }

  dismiss(data?: any) {
    
    if (data) {
      this.configurationEdited.emit(data);
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
            Edit Configuration
          </ion-title>
        </ion-toolbar>
      </ion-header>,
      <ion-content padding>
        <ion-item></ion-item>
        <ion-item>
          <ion-label>Configuration Name</ion-label>
          <ion-input id="configName" value={ this.configName }></ion-input>
        </ion-item>
        <ion-item></ion-item>
        <ion-button disabled={ this.isFormValid ? false : true } 
                    onClick={ () => this.saveConfiguration() }>
          Save Configuration
        </ion-button>
      </ion-content>
    ];
  }
}