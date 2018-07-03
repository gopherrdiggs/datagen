import { Component, Listen, State } from '@stencil/core';
import { UserSettings, Configuration, ConfigurationColumn, DataRow } from '../../interfaces/interfaces';
declare const XLSX: any;

@Component({
  tag: 'app-home',
  styleUrl: 'app-home.css'
})
export class AppHome {

  userSettings: UserSettings;
  selectedConfiguration: Configuration;
  @State() userConfigurations: Array<Configuration> = [];
  @State() selectedConfigName: string = '';
  @State() selectedConfigBaseValue: string = '';
  @State() selectedConfigNumRowsToGenerate: number = 1;
  @State() selectedConfigPadIncrementedNumbers: boolean = true;
  @State() selectedConfigColumns: Array<ConfigurationColumn> = [];
  @State() configHasChanges: boolean = false;
  localStorageKey: string = 'datagen_configs';
  userId: string;
  dataGridElem: any;
  workbook:any;
  counter: number;

  async componentWillLoad() {

    this.userSettings = {
      accountInfo: {
        userDisplayName: 'Guest'
      },
      configurations: []
    };
    
    var userSettings = localStorage.getItem(this.localStorageKey);
    if (userSettings) {
      this.userSettings = JSON.parse(userSettings);
    }

    this.userConfigurations = this.userSettings.configurations;
  }

  componentDidLoad() {

    this.dataGridElem = document.querySelector('data-grid');
  }

  loadConfiguration(configName: string) {

    var config = this.userConfigurations.find(c => { return c.name === configName });
    if (!config) { return; }
    this.selectedConfiguration = config;
    this.selectedConfigName = config.name;
    this.selectedConfigBaseValue = config.baseValue;
    this.selectedConfigNumRowsToGenerate = config.numRowsToGenerate;
    this.selectedConfigPadIncrementedNumbers = config.padIncrementedNumbers;
    this.selectedConfigColumns = config.columns;
    let dataRows: Array<DataRow> = [];
    let indx = 0;
    for (let col of this.selectedConfigColumns) {
      dataRows.push({
        index: indx++,
        columnName: col.name,
        columnValue: col.cellTemplate,
        isActive: col.isActive
      });
    }
    this.dataGridElem.loadDataRows(dataRows);
  }

  async saveUserSettings() {

    this.userSettings.configurations = this.userConfigurations;
    localStorage.setItem(this.localStorageKey, JSON.stringify(this.userSettings));
    await this.displayToast('Settings saved!');
    this.configHasChanges = false;
  }

  async displayModal(component: string, componentProps?: any) {

    const modalController = document.querySelector('ion-modal-controller');
    const modal = await modalController.create({
      component: component,
      componentProps: componentProps
    });
    await modal.present();
  }

  async displayToast(message: string, isSuccess: boolean = true) {

    const toastController = document.querySelector('ion-toast-controller');
    const toast = await toastController.create({
      message: message,
      cssClass: isSuccess ? 'toast-success' : 'toast-failure',
      duration: 3000
    });
    await toast.present();
  }

  @Listen('body:configurationCreated')
  handleConfigCreated(event: any) {

    var newConfig = {
      name: event.detail,
      baseValue: '',
      numRowsToGenerate: 1,
      padIncrementedNumbers: true,
      columns: []
    };
    this.userConfigurations = [...this.userConfigurations,newConfig];
    this.loadConfiguration(newConfig.name);
  }

  @Listen('body:configurationEdited')
  handleConfigEdited(event: any) {

    this.userConfigurations = this.userConfigurations.map(c => { 
      if (c.name === this.selectedConfigName) {
        c.name =  event.detail;
      }
      return c;
    });
    this.selectedConfigName = event.detail;
  }

  async processCellTemplate(template: string) {

    //TODO: Optimize processing by caching non-calculated templates
    var uppedTemplate = template.toUpperCase();

    // {Base} = base value entered
    template = template.replace(/{base}/gi, this.selectedConfigBaseValue);
    // {Today} = today's date in format MM/dd/yyyy
    if (uppedTemplate.indexOf('{TODAY}') > -1) {
      var today = new Date();
      template = template.replace(/{today}/gi, 
        today.getMonth().toString().padStart(2, '0') + '/' +
        today.getDate().toString().padStart(2, '0') + '/' +
        today.getFullYear().toString());
    }
    // {x} = incrementing counter
    if (uppedTemplate.indexOf('{X}') > -1) {
      template = template.replace(/{x}/gi, 
        this.selectedConfigPadIncrementedNumbers
          ? this.counter.toString().padStart(this.selectedConfigNumRowsToGenerate.toString().length, '0')
          : this.counter.toString());
    }
    // {rand(x,y)} = random number between x and y
    if (uppedTemplate.indexOf('{RAND(') > -1) {
      var lowerIndex = uppedTemplate.indexOf('{RAND(');
      var upperIndex = uppedTemplate.indexOf(')', lowerIndex);
      var toReplace = template.substring(lowerIndex, upperIndex + 2);
      var minMaxNums = uppedTemplate.substring(lowerIndex + 6, upperIndex);
      var minValue = minMaxNums.split(',')[0];
      var maxValue = minMaxNums.split(',')[1];
      template = template.replace(toReplace, 
        this.getRandomInteger(parseInt(minValue.trim()), parseInt(maxValue.trim())));
    }
    
    return template;
  }

  async processDataRows() {

    var result: Array<Array<string>> = [];
    var columnHeaders: Array<string> = [];
    var cellTemplates: Array<string> = [];
    var rawDataRows = this.dataGridElem.getDataRows();
    // Collect column headers and cell templates
    for (let dataRow of rawDataRows) {
      if (dataRow.isActive) {
        columnHeaders.push(dataRow.columnName);
        cellTemplates.push(dataRow.columnValue);
      }
    }
    result.push(columnHeaders);
    // Collect/generate cell values
    var i;
    var cellValues: Array<any>;
    this.counter = 1;
    for (i = 0; i < this.selectedConfigNumRowsToGenerate; i++) {

      cellValues = [];
      for (let cellTemplate of cellTemplates) {
        
        if (cellTemplate.indexOf('{') > -1 && cellTemplate.indexOf('}') > 0) {
          cellValues.push(await this.processCellTemplate(cellTemplate));
        }
        else {
          cellValues.push(cellTemplate);
        }
      }
      this.counter++;
      result.push(cellValues);
    }
    return result;
  }

  async generateSpreadsheet() {

    // SheetJS Tutorial: https://redstapler.co/sheetjs-tutorial-create-xlsx/
    this.workbook = XLSX.utils.book_new();
    // Create a new sheet name for reference
    this.workbook.SheetNames.push("Sheet 1");
    // Generate column and row data for sheet in JSON format
    var ws_data = await this.processDataRows();
    
    // Push the data into the sheet
    this.workbook.Sheets["Sheet 1"] = XLSX.utils.aoa_to_sheet(ws_data);
    // Write the file which prompts for download
    XLSX.writeFile(this.workbook, `${this.selectedConfigName}.xlsx`);
  }

  addDataRow() {
    
    this.dataGridElem.insertDataRow();
  }

  getRandomInteger(min, max) {

    return Math.floor(Math.random() * (max - min + 1) ) + min;
  }

  @Listen('ionChange')
  handleFieldChange(event: any) {
    if (event && event.detail) {
      if (event.target.id === "configName") {
        this.selectedConfigName = event.detail.value;
        this.selectedConfiguration.name = event.detail.value;
      }
      else if (event.target.id === "baseValue") {
        this.selectedConfigBaseValue = event.detail.value;
        this.selectedConfiguration.baseValue = event.detail.value;
        this.configHasChanges = true;
      }
      else if (event.target.id === "numRows") {
        this.selectedConfigNumRowsToGenerate = event.detail.value;
        this.selectedConfiguration.numRowsToGenerate = event.detail.value;
        this.configHasChanges = true;
      }
      else if (event.target.id === "isCounterPadded") {
        this.selectedConfigPadIncrementedNumbers = event.detail.checked;
        this.selectedConfiguration.padIncrementedNumbers = event.detail.checked;
        this.configHasChanges = true;
      }
      else if (event.target.id === "configSelect") {
        if (!this.selectedConfiguration 
          || (this.selectedConfiguration && this.selectedConfiguration.name != event.detail.value)) {
          this.loadConfiguration(event.detail.value);
        }
      }
    }
  }

  @Listen('body:dataRowUpdated')
  handleDataRowUpdated(event: any) {
    
    this.selectedConfigColumns[event.detail.index] = {
      name: event.detail.columnName,
      cellTemplate: event.detail.columnValue,
      isActive: event.detail.isActive
    };

    this.selectedConfiguration.columns = this.selectedConfigColumns;

    this.configHasChanges = true;
  }

  @Listen('body:dataRowDeleted')
  handleDataRowDeleted(event: any) {
    
    var clmnToRemove = this.selectedConfigColumns[event.detail - 1];
    this.selectedConfigColumns = this.selectedConfigColumns.filter(c => {
      return c.name != clmnToRemove.name && c.cellTemplate != clmnToRemove.cellTemplate;
    });
  }

  render() {
    return [
      <app-header>
        <ion-toolbar slot="secondary-toolbar" color="secondary">
          <ion-title>Home</ion-title>
        </ion-toolbar>
      </app-header>,
      <ion-content padding>
        <ion-card>
          <ion-card-header>
            <ion-item>
              <ion-label>
                Configuration Settings
              </ion-label>
              <ion-button slot="end" 
                          onClick={ () => this.displayModal('configuration-create') }>
                New
              </ion-button>
            </ion-item>
          </ion-card-header>
          <ion-card-content>
            <ion-grid>
              <ion-row>
                <ion-col col-lg-6 col-md-12 col-sm-12 col-12 align-self-stretch> 
                  <ion-item>
                    <ion-label position='floating'>Configuration</ion-label>
                    <ion-select id="configSelect" 
                                value={ this.selectedConfigName }
                                selectedText={ this.selectedConfigName }>
                      { this.userConfigurations.map(configuration => 
                        <ion-select-option value={ configuration.name }>{ configuration.name }</ion-select-option>
                      )}
                    </ion-select>
                    <ion-button slot='end' size='small' fill='clear'
                                disabled={ !this.selectedConfigName }
                                onClick={ () => this.displayModal('configuration-edit', { configurationName: this.selectedConfigName}) }>
                      <ion-icon slot="icon-only" name="create"></ion-icon>
                    </ion-button>
                  </ion-item>
                  <ion-item>
                    <ion-label position='floating'># Rows to Generate</ion-label>
                    <ion-input id="numRows" 
                               type="number" 
                               min="1" 
                               max="100000" 
                               value={ this.selectedConfigNumRowsToGenerate.toString() }></ion-input>
                  </ion-item>
                </ion-col>
                <ion-col col-lg-6 col-md-12 col-sm-12 col-12 align-self-stretch>
                  <ion-item>
                    <ion-label position='floating'>Base Value</ion-label>
                    <ion-input id="baseValue" 
                               value={ this.selectedConfigBaseValue }></ion-input>
                  </ion-item>
                  <ion-item>
                    <ion-label>Pad Incremented Numbers</ion-label>
                    <ion-checkbox id="isCounterPadded" 
                                  checked={ this.selectedConfigPadIncrementedNumbers }></ion-checkbox>
                  </ion-item>
                </ion-col>
              </ion-row>
              <ion-row>
                <ion-col>
                  <ion-button onClick={ () => this.generateSpreadsheet() }>
                    Generate Spreadsheet
                  </ion-button>
                  <ion-button disabled={ this.configHasChanges ? false : true }
                              onClick={ () => this.saveUserSettings() }>
                    Save Changes
                  </ion-button>
                </ion-col>
              </ion-row>
            </ion-grid>
          </ion-card-content>
        </ion-card>
        <ion-card>
          <ion-card-header>
            <ion-item>
              <ion-label>Data Generation Settings</ion-label>
              <ion-button slot="end" color="primary" 
                          onClick={ () => this.addDataRow() }>
                Add
              </ion-button>
            </ion-item>
          </ion-card-header>
          <ion-card-content>
            <data-grid></data-grid>
          </ion-card-content>
        </ion-card>
      </ion-content>
    ];
  }
}
