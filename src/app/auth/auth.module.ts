import { FixedRoutes } from '@urls';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DynamicsModule } from '@dynamics/dynamics.module';
import { AuthComponent } from './auth.component';
import { LoginComponent } from './login/login.component';
import { SetpassComponent } from './setpass/setpass.component';

export const authRoutes: Routes = [
  {
    path: '',
    component: AuthComponent,
    children: [
      { path: '', component: LoginComponent },
      { path: `${FixedRoutes.Login}`, component: LoginComponent },
      { path: `${FixedRoutes.Login}/:tenantcode`, component: LoginComponent },
      { path: `${FixedRoutes.SetPassword}`, component: SetpassComponent },
    ],
  },
];

@NgModule({
  declarations: [AuthComponent, LoginComponent, SetpassComponent],
  imports: [CommonModule, DynamicsModule, RouterModule.forChild(authRoutes)],
})
export class AuthModule {}
