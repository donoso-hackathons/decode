import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreateProfileRoutingModule } from './create-profile-routing.module';
import { CreateProfileComponent } from './create-profile.component';


@NgModule({
  declarations: [
    CreateProfileComponent
  ],
  imports: [
    CommonModule,
    CreateProfileRoutingModule
  ]
})
export class CreateProfileModule { }
