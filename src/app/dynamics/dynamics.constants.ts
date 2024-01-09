export const ComponentTypes = {
  Radio: 'Radio',
  Checkbox: 'Checkbox',
  Switch: 'Switch',
  Select: 'Select',
  IconSelect: 'IconSelect',
  MultiSelect: 'MultiSelect',
  Autocomplete: 'Autocomplete',
  Date: 'Date',
  Textarea: 'Textarea',
  Text: 'Text',
  Password: 'Password',
  Number: 'Number',
  Email: 'Email',
  File: 'File',
  Excel: 'Excel',
  Image: 'Image',
  QRCode: 'QRCode',
  Submit: 'Submit',
  Reset: 'Reset',
  SubForm: 'SubForm',
};

export const Fields = {
  MyFiles: 'MyFiles',
  Id: 'Id',
};

export const eExceptions = {
  MasterFileNotFound: 1,
  TenantNotFound: 2,
  TenantInactive: 3,
  LicenseExpired: 4,
  UserNotFound: 5,
  UserInactive: 6,
  Success: 7,
  Failed: 8,
  AlreadyExists: 9,
  DependancyExists: 10,
  NotPermitted: 11,
};

export const eMessageType = {
  Error: 'error',
  Success: 'success',
  Info: 'info',
  Warning: 'warning',
};

export const PageType = {
  Dash: 'Dash',
  Crud: 'Crud',
  Report: 'Report',
  CrudExtend: 'CrudExtend',
  // Custom: 'Custom',
  // Feedback: 'Feedback',
};

// https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
export const FileTypes = {
  Image: 'image/png,image/jpg,image/jpeg',
  Excel:
    'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
};
