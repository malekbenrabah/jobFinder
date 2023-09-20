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
import { NzBackTopModule } from 'ng-zorro-antd/back-top';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { JobListComponent } from './job-list/job-list.component';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { JobGridComponent } from './job-grid/job-grid.component';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { JobDetail2Component } from './job-detail2/job-detail2.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { SiteInfoComponent } from './site-info/site-info.component';
import { CategoryComponent } from './category/category.component';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import { DayJobsComponent } from './day-jobs/day-jobs.component';
import { TopRecruitersComponent } from './top-recruiters/top-recruiters.component';
import { NewsletterComponent } from './newsletter/newsletter.component';
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';

@NgModule({
  declarations: [
    HomeComponent,
    SearchComponent,
    NavbarComponent,
    FooterComponent,
    MenuComponent,
    JobDetailComponent,
    NotFoundComponent,
    LayoutComponent,
    JobListComponent,
    BreadcrumbComponent,
    JobGridComponent,
    JobDetail2Component,
    SiteInfoComponent,
    CategoryComponent,
    DayJobsComponent,
    TopRecruitersComponent,
    NewsletterComponent
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
    NzResultModule,
    NzBackTopModule,
    NzDropDownModule,
    NzCollapseModule,
    NzStatisticModule,
    SweetAlert2Module,
    NzCarouselModule,
    NzAutocompleteModule

  ],
  exports:[NavbarComponent, FooterComponent]
})
export class HomeModule { }
