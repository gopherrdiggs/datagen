import { Component, Listen, State } from '@stencil/core';
import { AuthService } from '../../services/auth-service';
import { UserSettings, Configuration, ConfigurationColumn } from '../../interfaces/interfaces';
declare const XLSX: any;

@Component({
  tag: 'app-home' 
})
export class AppHome {

  authSvc: AuthService = new AuthService();
  @State() name: string = '';
  @State() baseValue: string = '';
  @State() numRowsToGenerate: number = 1;
  @State() isCounterPadded: boolean = true;
  @State() configHasChanges: boolean = false;
  @State() userConfigurations: Array<Configuration> = [];
  @State() configColumns: Array<ConfigurationColumn> = [];
  @State() selectedConfigName: string;
  userId: string;
  userSettings: UserSettings;
  dataGridElem: any;
  workbook:any;
  counter: number;

  async componentWillLoad() {

    if (await this.authSvc.getIsUserAuthenticated()) {

      this.userId = localStorage.getItem('user_id');
      // await this.getUserSettings();
    }
  }

  componentDidLoad() {

    this.dataGridElem = document.querySelector('data-grid');
  }

  async getUserSettings() {

    if (!this.userId) { return; }

    let response = await fetch(
      `...`, {
        method: 'GET'
    });

    if (response.ok) {

      this.userSettings = await response.json();
      this.userConfigurations = this.userSettings.configurations;
      if (this.userConfigurations.length > 0) {
        this.loadConfiguration(this.userConfigurations[0].name);
      }
    }
  }

  loadConfiguration(configName: string) {

    var config = this.userConfigurations.find(c => { return c.name === configName });
    if (!config) { return; }
    
    console.log(`loading config: ${configName}`);
    if (this.selectedConfigName != configName) {
      console.log(`setting selected config name`);
      this.selectedConfigName = configName;
    }
    this.baseValue = config.baseValue;
    this.numRowsToGenerate = config.numRowsToGenerate;
    this.isCounterPadded = config.padIncrementedNumbers;
    this.configColumns = config.columns;
  }

  async saveUserSettings() {

    console.log(JSON.stringify(this.userSettings));
  }

  async displayNewConfigModal() {

    const modalController = document.querySelector('ion-modal-controller');
    const modal = await modalController.create({
      component: 'configuration-create'
    });
    await modal.present();
  }

  @Listen('body:configurationCreated')
  handleItemCreated(event: any) {

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

  async processCellTemplate(template: string) {

    //TODO: Optimize processing by caching non-calculated templates
    var uppedTemplate = template.toUpperCase();

    // {Base} = base value entered
    template = template.replace(/{base}/gi, this.baseValue);
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
        this.isCounterPadded
          ? this.counter.toString().padStart(this.numRowsToGenerate.toString().length, '0')
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
    for (i = 0; i < this.numRowsToGenerate; i++) {

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
    console.log(ws_data);
    // Push the data into the sheet
    this.workbook.Sheets["Sheet 1"] = XLSX.utils.aoa_to_sheet(ws_data);
    // Write the file which prompts for download
    XLSX.writeFile(this.workbook, `${this.name}.xlsx`);
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
      if (event.target.id === "name") {
        this.name = event.detail.value;
      }
      else if (event.target.id === "baseValue") {
        this.baseValue = event.detail.value;
        this.configHasChanges = true;
      }
      else if (event.target.id === "numRows") {
        this.numRowsToGenerate = event.detail.value;
        this.configHasChanges = true;
      }
      else if (event.target.id === "isCounterPadded") {
        this.isCounterPadded = event.detail.checked;
        this.configHasChanges = true;
      }
      else if (event.target.id === "configSelect") {
        if (this.selectedConfigName != event.detail.value) {
          this.loadConfiguration(event.detail.value);
        }
      }
    }
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
                          onClick={ () => this.displayNewConfigModal() }>
                New
              </ion-button>
            </ion-item>
          </ion-card-header>
          <ion-card-content>
            <ion-grid>
              <ion-row>
                <ion-col col-lg-6 col-md-12 col-sm-12 col-12 align-self-stretch> 
                  <ion-item>
                    <ion-label position='floating'>Name</ion-label>
                    <ion-select id="configSelect" 
                                value={ this.selectedConfigName }
                                selectedText={ this.selectedConfigName }>
                      { this.userConfigurations.map(configuration => 
                        <ion-select-option value={ configuration.name }>{ configuration.name }</ion-select-option>
                      )}
                    </ion-select>
                  </ion-item>
                  <ion-item>
                    <ion-label position='floating'># Rows to Generate</ion-label>
                    <ion-input id="numRows" 
                               type="number" 
                               min="1" 
                               max="100000" 
                               value={ this.numRowsToGenerate.toString() }></ion-input>
                  </ion-item>
                </ion-col>
                <ion-col col-lg-6 col-md-12 col-sm-12 col-12 align-self-stretch>
                  <ion-item>
                    <ion-label position='floating'>Base Value</ion-label>
                    <ion-input id="baseValue" 
                               value={ this.baseValue }></ion-input>
                  </ion-item>
                  <ion-item>
                    <ion-label>Pad Incremented Numbers</ion-label>
                    <ion-checkbox id="isCounterPadded" 
                                  checked={ this.isCounterPadded }></ion-checkbox>
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
