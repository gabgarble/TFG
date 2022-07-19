import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { RequestsComponent } from './requests.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [RequestsComponent]
})
export class RequestsModule { }
