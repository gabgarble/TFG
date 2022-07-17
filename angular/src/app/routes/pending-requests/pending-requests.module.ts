import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { PendingRequestsComponent } from './pending-requests.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [PendingRequestsComponent]
})
export class PendingRequestsModule { }
