import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';

/* PrimeNg */
import { MenubarModule } from 'primeng/menubar';
import {ButtonModule} from 'primeng/button';

@NgModule({

  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    MenubarModule,
    ButtonModule
  ],
  providers: [
    DatePipe
  ],
  declarations: [
    SpinnerComponent,
    NavBarComponent
  ],
  exports: [
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    SpinnerComponent,
    NavBarComponent,
    //MenubarModule,
  ]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule
    };
  }
}
