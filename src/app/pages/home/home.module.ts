import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from '../home/home.component';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { SearchComponent } from './search/search.component';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NavbarComponent } from './navbar/navbar.component';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { FooterComponent } from './footer/footer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import {NgxTypedJsModule} from 'ngx-typed-js';
import { MenuComponent } from './menu/menu.component';
import { NzSelectModule } from 'ng-zorro-antd/select';
import{ FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { JobDetailComponent } from './job-detail/job-detail.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { NzResultModule } from 'ng-zorro-antd/result';
import { LayoutComponent } from './layout/layout.component';




@NgModule({
  declarations: [
    HomeComponent,
    SearchComponent,
    NavbarComponent,
    FooterComponent,
    MenuComponent,
    JobDetailComponent,
    NotFoundComponent,
    LayoutComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    NzLayoutModule,
    NzBreadCrumbModule,
    NzMenuModule,
    NzCardModule,
    NzAvatarModule,
    NzInputModule,
    NzIconModule,
    NzDrawerModule,
    NzButtonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NzCheckboxModule,
    NzSpaceModule,
    NzAlertModule,
    NzFormModule,
    NzGridModule,
    NzDividerModule,
    NgxTypedJsModule,
    NzSelectModule,
    FontAwesomeModule,
    NzPaginationModule,
    NzToolTipModule,
    NzResultModule

  ],
  exports:[NavbarComponent, FooterComponent]
})
export class HomeModule { }
