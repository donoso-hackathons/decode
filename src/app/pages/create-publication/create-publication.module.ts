import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreatePublicationRoutingModule } from './create-publication-routing.module';
import { CreatePublicationComponent } from './create-publication.component';


@NgModule({
  declarations: [
    CreatePublicationComponent
  ],
  imports: [
    CommonModule,
    CreatePublicationRoutingModule
  ]
})
export class CreatePublicationModule { }
