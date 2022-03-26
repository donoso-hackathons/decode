import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreateProfileRoutingModule } from './create-profile-routing.module';
import { CreateProfileComponent } from './create-profile.component';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ButtonModule } from 'src/app/shared/components/button/button.module';
import { ParticlesModule } from 'src/app/shared/components/particles/particles.module';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    CreateProfileComponent
  ],
  imports: [
    CommonModule,
    CreateProfileRoutingModule,

    FormsModule,
    ReactiveFormsModule,

    ParticlesModule,
    ButtonModule,
    
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCheckboxModule,

  ]
})
export class CreateProfileModule { }
