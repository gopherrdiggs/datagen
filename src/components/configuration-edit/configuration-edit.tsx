import { Component, Element, Event, EventEmitter, Listen, Prop, State } from '@stencil/core';

@Component({
  tag: 'configuration-edit'
})
export class ConfigurationEdit {

  @Element() el: any;
  @Event() configurationEdited: EventEmitter;
  @Prop() configurationName: string;
  @State() _configName: string;
  @State() _isFormValid: boolean;

  componentWillLoad() {

    this._configName = this.configurationName;
    this._isFormValid = this._configName.length > 0;
  }

  saveConfiguration() {

    this.dismiss(this._configName);
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
        this._configName = event.detail.value;
        this._isFormValid = this._configName.length > 0;
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
          <ion-input id="configName" value={ this._configName }></ion-input>
        </ion-item>
        <ion-item></ion-item>
        <ion-button disabled={ this._isFormValid ? false : true } 
                    onClick={ () => this.saveConfiguration() }>
          Save Configuration
        </ion-button>
      </ion-content>
    ];
  }
}