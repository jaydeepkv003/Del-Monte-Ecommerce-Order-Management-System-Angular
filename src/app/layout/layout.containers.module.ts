import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DynamicsModule } from '@dynamics/dynamics.module';
import { TranslateModule } from '@ngx-translate/core';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { ApplicationMenuComponent } from './application-menu/application-menu.component';
import { ColorSwitcherComponent } from './color-switcher/color-switcher.component';
import { FooterComponent } from './footer/footer.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { TopnavComponent } from './topnav/topnav.component';

@NgModule({
  declarations: [
    TopnavComponent,
    SidebarComponent,
    ColorSwitcherComponent,
    FooterComponent,
    ApplicationMenuComponent,
  ],
  imports: [
    CommonModule,
    PerfectScrollbarModule,
    TranslateModule,
    RouterModule,
    CollapseModule,
    FormsModule,
    DynamicsModule,
    BsDropdownModule.forRoot(),
  ],
  exports: [
    TopnavComponent,
    SidebarComponent,
    ColorSwitcherComponent,
    FooterComponent,
    ApplicationMenuComponent,
  ],
})
export class LayoutContainersModule {}
