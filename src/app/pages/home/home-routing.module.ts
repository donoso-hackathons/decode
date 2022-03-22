import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'create-profile',
    loadChildren: () =>
      import('../create-profile/create-profile.module').then(
        (m) => m.CreateProfileModule
      ),
  },
  { path: 'create-publication', 
  loadChildren: () => import('../create-publication/create-publication.module').then(m => m.CreatePublicationModule) },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
