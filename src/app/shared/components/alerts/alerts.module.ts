import { NgModule, ModuleWithProviders } from '@angular/core';

// New imports to update based on AngularFire2 version 4




import { AlertService } from './alert.service';
import { SweetAlert2Module , Sweetalert2ModuleConfig} from '@sweetalert2/ngx-sweetalert2';


// This needs to be converted to a Token


@NgModule({
  imports: [

    SweetAlert2Module.forRoot({
      // buttonsStyling: false,
      // customClass: 'modal-content',
      // confirmButtonClass: 'btn btn-primary',
      // cancelButtonClass: 'btn'
  })

  ],
  exports: [
    SweetAlert2Module
  ],

})
export class AlertsModule {
static forRoot(): ModuleWithProviders<AlertsModule> {
  return {
    ngModule: AlertsModule,
    providers: [
   AlertService
    ],
  };
}
}
