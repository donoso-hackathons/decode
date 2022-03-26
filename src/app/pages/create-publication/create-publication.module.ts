import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreatePublicationRoutingModule } from './create-publication-routing.module';
import { CreatePublicationComponent } from './create-publication.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ButtonModule } from 'src/app/shared/components/button/button.module';


@NgModule({
  declarations: [
    CreatePublicationComponent
  ],
  imports: [
    CommonModule,
    CreatePublicationRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,

    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCheckboxModule,
  ]
})
export class CreatePublicationModule { }
