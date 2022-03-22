import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreatePublicationRoutingModule } from './create-publication-routing.module';
import { CreatePublicationComponent } from './create-publication.component';
import { BlogEditorModule } from 'src/app/shared/components/blog-editor/blog-editor.module';


@NgModule({
  declarations: [
    CreatePublicationComponent
  ],
  imports: [
    CommonModule,
    CreatePublicationRoutingModule,
    BlogEditorModule
  ]
})
export class CreatePublicationModule { }
