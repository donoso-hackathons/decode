import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PhotoComponent } from './photo/photo.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {CroppComponent} from './cropp/cropp.component'

@NgModule({
  declarations: [PhotoComponent, CroppComponent],
  imports: [
    CommonModule,
    MatInputModule,
    MatIconModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    DragDropModule,
  ],
  exports: [PhotoComponent, CroppComponent]
})
export class PhotoModule { }
