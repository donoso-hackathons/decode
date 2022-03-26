import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreatePublicationComponent } from './create-publication.component';

const routes: Routes = [
  { path: '', component: CreatePublicationComponent },
  {
    path: 'profile/:profileId/comment/:pubId',
    component: CreatePublicationComponent,
  },
  { path: '**', redirectTo: '/' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreatePublicationRoutingModule {}
