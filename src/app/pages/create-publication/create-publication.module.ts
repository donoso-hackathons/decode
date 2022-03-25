import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreatePublicationRoutingModule } from './create-publication-routing.module';
import { CreatePublicationComponent } from './create-publication.component';
import { BlogEditorModule } from 'src/app/shared/components/blog-editor/blog-editor.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    CreatePublicationComponent
  ],
  imports: [
    CommonModule,
    CreatePublicationRoutingModule,
    BlogEditorModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class CreatePublicationModule { }
