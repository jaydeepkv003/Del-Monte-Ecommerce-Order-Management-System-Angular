import { environment } from './../environments/environment';

export const FixedRoutes = {
  Login: 'login',
  Verify: 'verify',
  Download: 'download',
  SetPassword: 'setpass',
};

export const WebSockets = {
  Base: environment.webSocketUrl,
  Socket: `${environment.webSocketUrl}ws/`,
};

export const Operations = {
  Save: `/Save`,
  Select: `/Select`,
  Delete: `/Delete`,
  Search: `/Search`,
  Import: `/Import`,
  Export: `/Export`,
  Document: `/Document`,
  Download: `/Download`,
};

export const Modules = {
  Base: environment.apiURL,
  TenantCode: environment.tenantCode,
  Images: `${environment.apiURL}ArcKautilyam/Images/`,
  Authenticate: `${environment.apiURL}api/Authenticate`,
  Dashboard: `${environment.apiURL}api/Dashboard/`,
  Widgets: `${environment.apiURL}api/Widget`,
  FormsUrl: `${environment.apiURL}api/Forms`,
  TablesUrl: `${environment.apiURL}api/Tables`,
  LanguageUrl: `${environment.apiURL}api/Language/Translations`,

  OptionsUrl: `${environment.apiURL}api/Options/Fill`,
  NavigationsUrl: `${environment.apiURL}api/Navigations`,
  UserTypesUrl: `${environment.apiURL}api/UserTypes`,
  UsersUrl: `${environment.apiURL}api/Users`,
  FrontUtilityUrl: `${environment.apiURL}api/FrontUtility`,
};

export const Urls = {
  Base: Modules.Base,
  Authenticate: {
    Auth: `${Modules.Authenticate}/AuthUser`,
    KeepAlive: `${Modules.Authenticate}/KeepAlive`,
    GetQRBase: `${Modules.Authenticate}/GetQRBase`,
    ForgotTokenData: `${Modules.Authenticate}/ForgotTokenData`,
    RegisterSocialUser: `${Modules.Authenticate}/RegisterSocialUser`,
  },
  Dashboard: {
    GetDash: `${Modules.Dashboard}SelectDash`,
    GetWebConfig: `${Modules.Dashboard}GetWebConfig`,
    GetUser: `${Modules.Dashboard}GetUser`,
  },
  Forms: { GetForm: `${Modules.FormsUrl}/SelectForm` },
  Tables: { GetTable: `${Modules.TablesUrl}/SelectTable` },
  Widgets: { GetWidget: `${Modules.Widgets}/SelectWidget` },
  FrontUtility: { GetDownloadLink: `${Modules.FrontUtilityUrl}/DownloadLink` },
};

export const ExternalUrls = { IPAddress: `http://api.ipify.org/?format=json` };

export const LocalConfig = {
  LogoUrl: environment.LogoUrl,
  BrandName: environment.brandName,
};
