import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';
import { LoginComponent } from './login.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    SharedModule,
  ],
  declarations: [
    LoginComponent
  ],
  providers: [
    
  ],
  exports: [
    LoginComponent,
    RouterModule
  ]
})
export class LoginModule { }
