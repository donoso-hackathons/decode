import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParticlesComponent } from './particles.component';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  imports: [
    CommonModule,
    MatIconModule
  ],
  declarations: [ParticlesComponent],
  exports: [ParticlesComponent]
})
export class ParticlesModule { }
