import { Component, Event, EventEmitter, Listen, Method, State } from '@stencil/core';
import { DataRow } from '../../interfaces/interfaces';

@Component({
  tag: 'data-grid',
  styleUrl: 'data-grid.css'
})
export class DataGrid {

  @Event() dataRowUpdated: EventEmitter;
  @Event() dataRowDeleted: EventEmitter;
  @State() dataRows: Array<DataRow> = []

  componentWillLoad() {
    
    this.dataRows = [{
      index: 0,
      columnName: "",
      columnValue: "",
      isActive: true
    }]; 
  }

  @Method()
  getDataRows() {

    return this.dataRows;
  }

  @Method()
  loadDataRows(dataRows: Array<DataRow>) {

    this.dataRows = dataRows;
  }

  @Method()
  insertDataRow(index?: number) {

    if (!index) {
      index = this.dataRows.length;
    }
    var tempRows = this.dataRows.filter(r => { return r.index <= index });
    var newRow: DataRow = {
      index: index + 1,
      columnName: "",
      columnValue: "",
      isActive: true
    }
    tempRows.push(newRow); 
    tempRows = tempRows.concat(this.dataRows.filter(r => { return r.index > index }));
    index = 0;
    tempRows.map(r => { r.index = index++ });
    this.dataRows = tempRows;
  }

  removeDataRow(index: number) {

    var tempRows = this.dataRows.filter(r => { 
      return r.index != index; 
    });
    index = 0;
    tempRows.map(r => { r.index = index++ });
    this.dataRows = tempRows;
    this.dataRowDeleted.emit(index);
  }

  getIndexFromId(elementId: string) {

    return elementId.split('_')[1];
  }

  pushComponent(component: string) {

    var navElem = document.querySelector('ion-nav');
    navElem.push(component);
  }

  @Listen('ionChange')
  handleFieldChange(event: any) {
    if (event && event.detail) {
      
      var rowIndex = event.target.id.split('_')[1];
      if(event.target.id.startsWith("clmnName_")) {
        this.dataRows[this.getIndexFromId(event.target.id)].columnName = event.detail.value;
        this.dataRowUpdated.emit(this.dataRows[rowIndex]);
      }
      else if(event.target.id.startsWith("clmnValue_")) {
        this.dataRows[this.getIndexFromId(event.target.id)].columnValue = event.detail.value;
        this.dataRowUpdated.emit(this.dataRows[rowIndex]);
      }
      else if(event.target.id.startsWith("include_")) {
        this.dataRows[this.getIndexFromId(event.target.id)].isActive = event.detail.checked;
        this.dataRowUpdated.emit(this.dataRows[rowIndex]);
      }
    }
  }

  render() {
    return [
      <div class="wrapper">
        <ion-item>
          <ion-label>Column Name</ion-label>
        </ion-item>
        <ion-item>
          <ion-label>Cell Template
            <ion-icon slot="icon-only" class="helpIcon" name="help"
                      onClick={ () => this.pushComponent('about-cell-templates') }></ion-icon>
          </ion-label>
        </ion-item>
        <ion-item>
          <ion-label>Include</ion-label>
        </ion-item>
        <div></div>
        <div></div>

        { this.dataRows.map(row =>
          [
            <ion-item><ion-input id={`clmnName_${row.index}`} value={ row.columnName }></ion-input></ion-item>,
            <ion-item><ion-input id={`clmnValue_${row.index}`} value={ row.columnValue }></ion-input></ion-item>,
            <ion-item><ion-checkbox id={`include_${row.index}`} checked={ row.isActive }></ion-checkbox></ion-item>,
            <ion-button class="gridBtn" 
                        fill="clear" 
                        title="Insert Below"
                        onClick={ () => this.insertDataRow(row.index) }><ion-icon slot="icon-only" name="return-left" ></ion-icon></ion-button>,
            <ion-button class="gridBtn" 
                        fill="clear" 
                        title="Delete"
                        onClick={ () => this.removeDataRow(row.index) }><ion-icon slot="icon-only" name="close-circle" ></ion-icon></ion-button>
          ]
        )}

      </div>
    ];
  }
}