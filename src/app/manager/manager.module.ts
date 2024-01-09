import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DynamicsModule } from '@dynamics/dynamics.module';
import { ManagerComponent } from './manager.component';

export const managerRoutes: Routes = [
  { path: '**', component: ManagerComponent },
];

@NgModule({
  declarations: [ManagerComponent],
  imports: [CommonModule, DynamicsModule, RouterModule.forChild(managerRoutes)],
})
export class ManagerModule {}
