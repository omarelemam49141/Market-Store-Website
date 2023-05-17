import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SpinnerComponent } from './spinner/spinner.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ImageUploadComponent } from './image-upload/image-upload.component';
import { FormSpinnerComponent } from './form-spinner/form-spinner.component';
import { ToastrModule } from 'ngx-toastr';
import { NotificationSpinnerComponent } from './notification-spinner/notification-spinner.component';


@NgModule({
  declarations: [
    HeaderComponent,
    SpinnerComponent,
    ImageUploadComponent,
    FormSpinnerComponent,
    NotificationSpinnerComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule,
    FontAwesomeModule,
    BrowserAnimationsModule,
    NgbCollapseModule,
    FormsModule,
    NgbDropdownModule,
    ReactiveFormsModule,
    ToastrModule.forRoot({
      timeOut: 3000, 
      closeButton: true,
      progressBar: true,
      positionClass: 'toast-bottom-right',
    })
  ],
  exports: [
    HttpClientModule,
    FontAwesomeModule,
    CommonModule,
    RouterModule,
    HeaderComponent,
    SpinnerComponent,
    NgbCollapseModule,
    FormsModule,
    ReactiveFormsModule,
    ImageUploadComponent,
    FormSpinnerComponent,
    ToastrModule
  ],
  
})
export class SharedModule {
  constructor() {

  }
}
