import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LensProtocolModule } from './4-lens-protocol/lens-protocol.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { blockchain_providers } from './blockchain_wiring';
import { DappInjectorModule } from './dapp-injector/dapp-injector.module';
import { StoreModule } from '@ngrx/store';
import { we3ReducerFunction } from 'angular-web3';
import { MenuBarComponent } from './shared/components/menu-bar/menu-bar.component';
import { MainComponent } from './shared/components/main/main.component';
import { ProfilePageComponent } from './shared/components/profile-page/profile-page.component';
import { FeedComponent } from './shared/components/feed/feed.component';
import { CodeoComponent } from './shared/components/codeo/codeo.component';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { ListComponent } from './shared/components/list/list.component';
import { NewsComponent } from './shared/components/news/news.component';
import { FollowSuggestionsComponent } from './shared/components/follow-suggestions/follow-suggestions.component';
import { ButtonComponent } from './shared/components/button/button.component';
import { OnboardComponent } from './shared/components/onboard/onboard.component';

@NgModule({
  declarations: [
    AppComponent,
    MenuBarComponent,
    MainComponent,
    ProfilePageComponent,
    FeedComponent,
    CodeoComponent,
    SidebarComponent,
    ListComponent,
    NewsComponent,
    FollowSuggestionsComponent,
    ButtonComponent,
    OnboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LensProtocolModule,
    BrowserAnimationsModule,
    DappInjectorModule,
    StoreModule.forRoot({web3: we3ReducerFunction}),
  ],
  providers: [
    ...blockchain_providers
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
