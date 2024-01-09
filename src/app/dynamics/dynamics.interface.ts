import {
  DataType,
  FieldOperations,
  TextAlignment,
} from '@dynamics/dynamics.enum';
export class Validator {
  name?: string;
  validator?: any;
  message?: string;
  validationType?: string;
  validationValue?: string;
}
export class KeyValuePair {
  key: string;
  value: string;
}
export class PropertyOptions {
  propertyId?: number;
  isServerSide: boolean;
  tableName?: string;
  url?: string;
  keyField?: string;
  valueField?: string;
  cascadeBy?: string;
  cascadeValue?: string;
  cascadeAllData?: boolean;
}
export class FieldConfig {
  id?: string;
  name?: string;
  label?: string;
  componentType: string;
  checked?: boolean; // For multiple in file
  color?: string;
  showLimit?: boolean;
  notInSubForm: boolean;

  validations?: Validator[];
  options?: KeyValuePair[];
  propertyOptions?: PropertyOptions;

  subForm?: FormConfig;
  subTable?: TableConfig;

  collections?: any; // For character collection Which is Allowed
  value?: any; // For Edit Time Binding
  large?: boolean;
  // These properties will work when validation applied
  maxLength?: number;
  minLength?: number;
  min?: number;
  max?: number;
  isHidden?: boolean;
  rebuildControl?: boolean;
}
export class FormConfig {
  name: string;
  title: string;
  isPreDefined: boolean;
  isSave: boolean;
  isReset: boolean;
  isSearch: boolean;
  isExport: boolean;
  submitUrl?: string;
  layoutType: string;
  properties?: FieldConfig[];
  behaviours?: Behaviours[];
  buttons?: FieldConfig[];
  isSubForm: boolean;
}
export class ResourceRequest {
  moduleName?: string;
  resourceName?: string;
  tenantCode?: string;
}
export class ApiResponse<T> {
  data: T;
  message: string;
  status: number;
}
export class Behaviours {
  sourceField: string;
  destinationField: string;
  operation: FieldOperations;
  sourceValue: string;
  destinationeValue?: string;
  compareEqual: boolean;
}
export class TableConfig {
  name: string;
  title?: string;
  dataUrl?: string;
  rowPerPage: number;
  isFilter?: boolean;
  isActions?: boolean;
  isExport?: boolean;
  isPreDefined?: boolean;
  isDocument?: boolean;
  columns?: TableColumn[];
  options?: KeyValuePair[];
  isSubTable: boolean;
}
export class TableColumn {
  name: string;
  label: string;
  dataType?: DataType;
  sortable?: boolean;
  sortIndex: number;

  notInSubTable: boolean;

  textAlign?: TextAlignment;
  columnWidth?: string;
  clickableCells?: boolean;
  iconName?: string;
  iconClass?: string;
  disableClickableIcon?: boolean;
  disabledReason?: boolean;
  displayOnlyIcon?: boolean;
  columnOptions?: PropertyOptions;
  options?: KeyValuePair[];
}
export class TableData {
  [key: string]: string | boolean;
}

export class IMenuItem {
  id?: number;
  type: string; // Possible values: link/dropDown/icon/separator/extLink
  name?: string; // Used as display text for item and title for separator type
  state?: string; // Router state
  icon?: string; // Material icon name
  tooltip?: string; // Tooltip text
  disabled?: boolean; // If true, item will not be appeared in sidenav.
  childItems?: IMenuItem[]; // Dropdown items
  badges?: IBadge[];
  pageType?: string;
  newWindow = false;

  isCreate?: boolean;
  isEdit?: boolean;
  isView?: boolean;
  isDelete?: boolean;
  navigationId?: number;
}

export class IBadge {
  color: string; // primary/accent/warn/hex color codes(#fff000)
  value: string; // Display text
}

export class DashboardConfig {
  name: string;
  title: string;
  isActive: boolean;
  widgets?: WidgetConfig[];
}
export class WidgetConfig {
  name: string;
  title: string;
  dataUrl?: string;
  isActive: boolean;
  isLive: boolean;
  sortIndex: number;
  isDataWidget: boolean;
  isInternalUrl: boolean;
  widgetType: string;
  widgetMessageType: number;
  widgetOptions: WidgetOptions[];
}

export class WidgetOptions {
  keyField: string;
  valueField: string;
}

export class TcpMessage {
  messageType: number;
  widgetMessageType: number;
  senderIdentity: string;
  data: any;
}

export class ListTileOption {
  key: string;
  value: string;
  image: string;
  color: string;
  subValue: string;
  description: string;
}

export class Translations {
  code: string;
  name: string;
  direction?: string;
  translations?: [];
}

export class GlobalConfig {
  configCode?: string;
  organizationName?: string;
  defaultLogo?: string;
  logoUrl?: string;
  tagline?: string;
  contact?: string;
  email?: string;
  address?: string;
  website?: string;
  vpa?: string;
  isActive?: boolean;
}

export class FormInput {
  formField?: string;
  formConfig: FormConfig;
  formData?: any;
  parentData?: any;
}

export class PrintData {
  emailTemplate?: TemplateConfig;
  smsTemplate?: TemplateConfig;
  emailReceiver?: string;
  smsReceiver?: string;
}

export class TemplateConfig {
  source?: string;
  subject?: string;
  height?: number;
  width?: number;
}

export interface BarChartData
{
  identifier: string;
  options: KeyValuePair[];
}
