import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { eExceptions } from '@dynamics/dynamics.constants';
import { FormConfig, ResourceRequest } from '@dynamics/dynamics.interface';
import { AuthService } from '@services/auth.service';
import { DashboardService } from '@services/dashboard.service';
import { DataService } from '@services/data.service';
import { ExternalUrls, LocalConfig, Modules, Urls } from '@urls';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  formReset: boolean;
  formConfig: FormConfig;
  isMaster = false;
  imageBase64: string;
  currentIP: string;
  QRLogin = LocalConfig.QRLogin;
  socialLogin = LocalConfig.SocialLogin;
  resourceRequest: ResourceRequest = {
    moduleName: 'Auth',
    resourceName: 'Login',
  };

  constructor(
    private dataService: DataService,
    private authService: AuthService,
    private dashboardService: DashboardService,
    public activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const code = this.activatedRoute.snapshot.url;
    this.activatedRoute.params.subscribe(
      (param: Params) =>
        (this.resourceRequest.tenantCode = param.tenantcode
          ? param.tenantcode
          : Modules.TenantCode)
    );

    if (!this.resourceRequest.tenantCode) {
      this.resourceRequest.resourceName = 'TLogin';
    }

    this.getFormConfig(this.resourceRequest);
  }

  getFormConfig(data: ResourceRequest): void {
    this.dataService
      .postData<FormConfig>(Urls.Forms.GetForm, data)
      .then((response) => {
        this.formReset = false;
        this.formConfig = response;
      });
  }

  onSubmit(value: any): void {
    if (!this.isMaster) {
      value.Ip = this.currentIP;
    }
    if (this.resourceRequest.tenantCode) {
      value = { ...value, TenantCode: this.resourceRequest.tenantCode };
    }
    this.dataService
      .post<any>(`${Urls.Base}${this.formConfig.submitUrl}`, value)
      .then((resp) => {
        this.onResponse(resp);
      });
  }

  onResponse(resp): void {
    if (resp.status === eExceptions.MasterFileNotFound) {
      this.isMaster = true;
      this.getFormConfig({ moduleName: 'Auth', resourceName: 'Master' });
    } else if (resp.status === eExceptions.Success && this.isMaster) {
      this.getFormConfig(this.resourceRequest);
    } else if (
      resp.status === eExceptions.Success &&
      resp.data &&
      !this.isMaster
    ) {
      this.authService.goToDash = true;
      this.authService.setupLocalValues(resp.data);
    }
  }

  onGotUser(value: any): void {
    if (Modules.TenantCode) {
      value = { ...value, TenantCode: Modules.TenantCode };
    }
    this.dataService
      .post<any>(Urls.Authenticate.RegisterSocialUser, value)
      .then((resp) => {
        if (resp.status === eExceptions.Success) {
          // this.socialAuthService.signOut();
          this.onResponse(resp);
        }
      });
  }

  getCurrentIP(): void {
    this.dataService.get<string>(ExternalUrls.IPAddress).then((response) => {
      localStorage.CurrentIP = response;
      this.currentIP = response;
    });
  }

  getCurrentLocation(): void {}
}
