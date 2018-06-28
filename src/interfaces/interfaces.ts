export interface User {
  id: string,
  name: string
}

export interface DataRow {
  index: number,
  columnName: string,
  columnValue: string,
  isActive: boolean
}

export interface AccountInfo {
  userDisplayName: string
}

export interface ConfigurationColumn {
  name: string,
  cellTemplate: string,
  isActive: boolean
}

export interface Configuration {
  name: string,
  baseValue: string,
  numRowsToGenerate: number,
  padIncrementedNumbers: boolean,
  columns: Array<ConfigurationColumn>
}

export interface UserSettings {
  accountInfo: AccountInfo,
  configurations: Array<Configuration>
}