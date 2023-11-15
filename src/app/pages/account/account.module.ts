import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountRoutingModule } from './account-routing.module';
import { AccountComponent } from './account.component';
import { ProfileComponent } from './profile/profile.component';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import{ FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzBackTopModule } from 'ng-zorro-antd/back-top';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzRateModule } from 'ng-zorro-antd/rate';
import { CompanyProfileComponent } from './company-profile/company-profile.component';
import { CandidateDetailesComponent } from './candidate-detailes/candidate-detailes.component';
import { NzTimelineModule } from 'ng-zorro-antd/timeline';
import { CandidatesComponent } from './candidates/candidates.component';
import { CvComponent } from './cv/cv.component';

@NgModule({
  declarations: [
    AccountComponent,
    ProfileComponent,
    CompanyProfileComponent,
    CandidateDetailesComponent,
    CandidatesComponent,
    CvComponent
  ],
  imports: [
    CommonModule,
    AccountRoutingModule,
    NzDividerModule,
    NzGridModule,
    NzLayoutModule,
    NzBreadCrumbModule,
    NzMenuModule,
    NzCardModule,
    NzAvatarModule,
    NzInputModule,
    NzIconModule,
    NzDrawerModule,
    NzButtonModule,
    ReactiveFormsModule ,
    HttpClientModule,
    FontAwesomeModule,
    NzCheckboxModule,
    NzSpaceModule,
    NzAlertModule,
    NzFormModule,
    NzSelectModule,
    NzPaginationModule,
    NzToolTipModule,
    NzResultModule,
    NzBackTopModule,
    NzDropDownModule,
    NzTagModule,
    FormsModule,
    NzStepsModule,
    NzDatePickerModule,
    NzModalModule,
    NzPopconfirmModule,
    NzRateModule,
    NzTimelineModule





  ]
})
export class AccountModule { }
