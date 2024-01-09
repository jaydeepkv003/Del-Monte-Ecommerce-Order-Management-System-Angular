export enum DataType {
  Icon = 'Icon',
  Boolean = 'Boolean',
  Image = 'Image',
  Number = 'Number',

  Currency = 'Currency',
  Date = 'Date',
  DateTime = 'DateTime',
  Time = 'Time',
  Preformatted = 'Preformatted',
}

// This property not in use
export enum FieldOperations {
  Disable = 'Disable',
  Hide = 'Hide',
  SetValue = 'SetValue',
  Cascading = 'Cascading',
  ResetValidation = 'ResetValidation',
}

export enum TextAlignment {
  Center = 'text-center',
  Right = 'text-right',
}

export enum eValidators {
  Required,
  Pattern,
  Email,
  MinLength,
  MaxLength,
  Min,
  Max,
}

export enum TcpMessageType {
  WidgetMessage = 1,
  SocketConnection = 2,
  UserConncetion = 3,
  UserDisconnection = 4,
  DisplayInitialization = 5,
  DisplayConncetion = 6,
}

export enum WidgetMessageType {
  LiveUsers = 1,
  CurrentCall = 50,
  DisplayNewsFeed = 51,
  DisplayPramotion = 52,
  DisplayRefresh = 53,
  GeneratorRefresh = 54,
}

export enum OperatorEvent {
  Next = 1,
  TransferToMe = 2,
  SkippedByMe = 3,
  TakeBreak = 4,
  Complete = 5,
  Transfer = 6,
  Recall = 7,
  Skip = 8,
  Calling = 9,
}

export enum BellTypes {
  Bell = 1,
  BellAndToken = 2,
  TokenAndCounter = 3,
}

export enum BellLanguages {
  English = 1,
  Hindi = 2,
}

export enum WidgetOptionType {
  ImageUrl = 'ImageUrl',
  Title = 'Title',
  SubTitle = 'SubTitle',
  Data = 'Data',
  SubData = 'SubData',
  PrimaryForm = 'PrimaryForm',
  SecondaryForm = 'SecondaryForm',
  Table = 'Table',
  PrimaryUrl = 'PrimaryUrl',
  SecondaryUrl = 'SecondaryUrl',
  SaveUrl = 'SaveUrl',
  DownloadUrl = 'DownloadUrl',
  SubUrl = 'SubUrl',
}

export enum FormSignal {
  Primary = 'Primary',
  Secondary = 'Secondary',
  Invalid = 'Invalid',
}

export enum OrderState {
  None = 0,
  New = 1,
  Processing = 2,
  Shipped = 3,
  Cancelled = 4,
  Refunded = 5,
  Blocked = 6,
  Terminated = 7,
  Payment = 8,
  Completed = 10,
}
