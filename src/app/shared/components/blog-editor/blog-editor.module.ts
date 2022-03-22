import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogEditorComponent } from './blog-editor/blog-editor.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { PhotoModule } from '../photo/photo.module';




@NgModule({
  declarations: [BlogEditorComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    PhotoModule

  ],
  exports: [BlogEditorComponent]
})
export class BlogEditorModule { }
