import { Injectable } from '@angular/core';
import { GlobalConfig } from '@dynamics/dynamics.interface';
import { LocalConfig, Modules } from '@urls';

@Injectable({ providedIn: 'root' })
export class GlobalConfigService {
  public defaultLogo = LocalConfig.LogoUrl;
  public globalConfig: GlobalConfig;
  public imageUrl = `${Modules.Images}${localStorage.TenantCode}/`;
  public fullScreenDash = false;

  constructor() {
    this.loadConfig();
  }

  loadConfig(): void {
    if (localStorage.GlobalConfig) {
      this.globalConfig =
        localStorage.GlobalConfig && localStorage.GlobalConfig !== 'null'
          ? JSON.parse(localStorage.GlobalConfig)
          : {
              logoUrl: LocalConfig.LogoUrl,
              organizationName: LocalConfig.BrandName,
            };
    }
  }
}
