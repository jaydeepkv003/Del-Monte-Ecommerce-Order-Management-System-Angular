import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  MissingTranslationHandler,
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import { DashboardService } from '@services/dashboard.service';
import { DataService } from '@services/data.service';
import { AuthGuard } from '@services/interceptor/auth.guard';
import { AuthInterceptor } from '@services/interceptor/auth.interceptor.guard';
import { LoadingInterceptor } from '@services/interceptor/loading.interceptor.guard';
import {
  MyMissingTranslationHandler,
  TranslationsService,
} from '@services/translations.service';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { LayoutContainersModule } from '../layout/layout.containers.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RootComponent } from './root.component';

export const rootRoutes: Routes = [
  {
    path: '',
    component: RootComponent,
    loadChildren: () => import('../auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'document',
    component: RootComponent,
    loadChildren: () =>
      import('../document/document.module').then((m) => m.DocumentModule),
  },
  {
    path: 'download',
    component: RootComponent,
    loadChildren: () =>
      import('../download/download.module').then((m) => m.DownloadModule),
  },
  {
    path: '**',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('../manager/manager.module').then((m) => m.ManagerModule),
  },
];

@NgModule({
  declarations: [RootComponent, DashboardComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    LayoutContainersModule,
    RouterModule.forChild(rootRoutes),
    SimpleNotificationsModule.forRoot({
      timeOut: 5000,
      clickToClose: true,
      theClass: 'outline primary',
      position: ['bottom', 'center'],
    }),
    TranslateModule.forRoot({
      isolate: true,
      useDefaultLang: false,
      missingTranslationHandler: {
        provide: MissingTranslationHandler,
        useClass: MyMissingTranslationHandler,
      },
      loader: {
        provide: TranslateLoader,
        useClass: TranslationsService,
        deps: [DataService],
      },
    }),
  ],
  providers: [
    DataService,
    DashboardService,
    TranslationsService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
  ],
})
export class RootModule {}
