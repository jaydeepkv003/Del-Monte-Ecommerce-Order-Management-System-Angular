import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { eExceptions } from '@dynamics/dynamics.constants';
import { FormConfig, ResourceRequest } from '@dynamics/dynamics.interface';
import { AuthService } from '@services/auth.service';
import { DataService } from '@services/data.service';
import { Urls } from '@urls';

@Component({
  selector: 'app-setpass',
  templateUrl: './setpass.component.html',
  styleUrls: ['./setpass.component.scss'],
})
export class SetpassComponent implements OnInit {
  formReset: boolean;
  formConfig: FormConfig;
  resetToken: string;
  emailData: string;
  resourceRequest: ResourceRequest = {
    moduleName: 'Auth',
    resourceName: 'PasswordReset',
  };

  constructor(
    public router: Router,
    private dataService: DataService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.resetToken = this.activatedRoute.snapshot.queryParams.code;
    if (this.resetToken) {
      this.getTokenData(this.resetToken);
    } else {
      this.authService.onSignOut();
    }
  }

  getTokenData(code: string): void {
    this.dataService
      .post(Urls.Authenticate.ForgotTokenData, { data: code })
      .then((resp: any) => {
        if (resp.status === eExceptions.Success) {
          this.emailData = resp.data;
          this.getFormConfig(this.resourceRequest);
        } else {
          this.authService.onSignOut();
        }
      });
  }

  getFormConfig(data: ResourceRequest): void {
    this.dataService
      .postData<FormConfig>(Urls.Forms.GetForm, data)
      .then((response) => {
        this.formReset = false;
        this.formConfig = response;
        this.formConfig.title += `: ${this.emailData}`;
      });
  }

  onSubmit(value: any): void {
    value = { ...value, ResetToken: this.resetToken };
    this.dataService
      .post<any>(`${Urls.Base}${this.formConfig.submitUrl}`, value)
      .then((resp) => {
        this.authService.onSignOut();
      });
  }
}
