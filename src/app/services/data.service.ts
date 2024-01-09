import { DatePipe } from '@angular/common';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import {
  eExceptions,
  eMessageType,
  Fields,
} from '@dynamics/dynamics.constants';
import { ApiResponse } from '@dynamics/dynamics.interface';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { Subscription } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DataService implements OnDestroy {
  postSubscription: Subscription;
  postFileSubscription: Subscription;
  getSubscription: Subscription;
  downloadSubscription: Subscription;

  constructor(
    private notifications: NotificationsService,
    private http: HttpClient
  ) {}

  post<T>(url: string, data: any): Promise<ApiResponse<T>> {
    return new Promise<ApiResponse<T>>((resolve) => {
      this.postSubscription = this.http
        .post<ApiResponse<T>>(url, data)
        .subscribe((resp) => resolve(this.completeResponse<T>(resp)));
    });
  }

  postFile<T>(url: string, data: any): Promise<ApiResponse<T>> {
    return new Promise<ApiResponse<T>>((resolve) => {
      const formData: FormData = new FormData();
      if (
        data &&
        data[Fields.MyFiles] !== undefined &&
        data[Fields.MyFiles] !== null &&
        data[Fields.MyFiles].length
      ) {
        data[Fields.MyFiles].forEach((file) => formData.append('files', file));
      }
      formData.append('data', JSON.stringify(data));

      this.postFileSubscription = this.http
        .post<ApiResponse<T>>(url, formData)
        .subscribe((resp) => resolve(this.completeResponse<T>(resp)));
    });
  }

  postData<T>(url: string, data?: any): Promise<T> {
    return new Promise<T>(async (resolve) => {
      resolve(this.responseData<T>(await this.post<T>(url, data)));
    });
  }

  get<T>(url: string): Promise<T> {
    return new Promise<T>((resolve) => {
      this.getSubscription = this.http
        .get<T>(url)
        .subscribe((resp) => resolve(resp));
    });
  }

  downloadFile(url: string, data: any, fileName = ''): void {
    this.downloadSubscription = this.http
      .post(url, data, { responseType: 'blob', observe: 'response' })
      .subscribe((resp: HttpResponse<any>) => {
        const downloadURL = window.URL.createObjectURL(resp.body);
        const link = document.createElement('a');
        link.href = downloadURL;
        link.download = fileName
          ? fileName
          : new DatePipe('en-US').transform(new Date(), 'ddMMyyyyHHmmss');
        link.click();
      });
  }

  completeResponse<T>(apiResponse: any): ApiResponse<T> {
    if (apiResponse && apiResponse.message) {
      switch (apiResponse.status) {
        // Success
        case eExceptions.Success: {
          this.notify(apiResponse.message, eMessageType.Success);
          break;
        }
        // Exceptions
        case eExceptions.Failed:
        case eExceptions.AlreadyExists:
        case eExceptions.DependancyExists:
        case eExceptions.TenantNotFound:
        case eExceptions.UserInactive:
        case eExceptions.UserNotFound:
        case eExceptions.NotPermitted:
        case eExceptions.MasterFileNotFound: {
          this.notify(apiResponse.message, eMessageType.Error);
          break;
        }
        // Warnings
        case eExceptions.TenantInactive: {
          this.notify(apiResponse.message, eMessageType.Warning);
          break;
        }
        // Information
        case eExceptions.LicenseExpired:
        default: {
          this.notify(apiResponse.message, eMessageType.Info);
          break;
        }
      }
    }
    return apiResponse;
  }

  notify(message: string, status: string): void {
    this.notifications.create(
      status === eMessageType.Error
        ? 'Error'
        : status === eMessageType.Info
        ? 'Info'
        : status === eMessageType.Warning
        ? 'Warning'
        : 'Success',
      message,
      status === eMessageType.Error
        ? NotificationType.Error
        : status === eMessageType.Info
        ? NotificationType.Info
        : status === eMessageType.Warning
        ? NotificationType.Warn
        : NotificationType.Success
    );
  }

  responseData<T>(apiResponse: ApiResponse<T>): T {
    this.completeResponse(apiResponse);
    return apiResponse.data;
  }

  ngOnDestroy(): void {
    if (this.postSubscription) {
      this.postSubscription.unsubscribe();
    }
    if (this.postFileSubscription) {
      this.postFileSubscription.unsubscribe();
    }
    if (this.getSubscription) {
      this.getSubscription.unsubscribe();
    }
    if (this.downloadSubscription) {
      this.downloadSubscription.unsubscribe();
    }
  }
}
