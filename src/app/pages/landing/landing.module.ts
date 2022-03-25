import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingComponent } from './landing/landing.component';
import { LandingRoutingModule } from './landing-routing.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ButtonComponent } from 'src/app/shared/components/button/button.component';
import { CodeoComponent } from 'src/app/shared/components/codeo/codeo.component';
import { FeedComponent } from 'src/app/shared/components/feed/feed.component';
import { FollowSuggestionsComponent } from 'src/app/shared/components/follow-suggestions/follow-suggestions.component';
import { ListComponent } from 'src/app/shared/components/list/list.component';
import { MainComponent } from 'src/app/shared/components/main/main.component';
import { MenuBarComponent } from 'src/app/shared/components/menu-bar/menu-bar.component';
import { NewsComponent } from 'src/app/shared/components/news/news.component';
import { OnboardComponent } from 'src/app/shared/components/onboard/onboard.component';
import { ProfilePageComponent } from 'src/app/shared/components/profile-page/profile-page.component';
import { SidebarComponent } from 'src/app/shared/components/sidebar/sidebar.component';
import { ButtonModule } from 'src/app/shared/components/button/button.module';



@NgModule({
  declarations: [
    LandingComponent,
    MenuBarComponent,
    MainComponent,
    ProfilePageComponent,
    FeedComponent,
    CodeoComponent,
    SidebarComponent,
    ListComponent,
    NewsComponent,
    FollowSuggestionsComponent,
    OnboardComponent
  ],
  imports: [
    CommonModule,
    LandingRoutingModule,
    MatProgressSpinnerModule,
    ButtonModule
  ]
})
export class LandingModule { }
