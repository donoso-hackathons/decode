import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path:'',
    loadChildren: () =>
      import('./pages/landing/landing.module').then((m) => m.LandingModule),
  },
  {
    path: 'app',
    loadChildren: () =>
      import('./pages/home/home.module').then((m) => m.HomeModule),
  },
  { path: 'members', loadChildren: () => import('./pages/members/members.module').then(m => m.MembersModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
