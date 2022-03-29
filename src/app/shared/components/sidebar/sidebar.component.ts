import { AfterViewInit, Component, OnInit } from '@angular/core';
import { INEWS } from '../../models';
import MockNews from '../../../../assets/data/news.json';
import { ISUGGESTION } from '../../models/models-suggestions';
import { FormBuilder } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AngularContract, DappInjectorService, web3Selectors } from 'angular-web3';
import { ProfileStructStruct } from 'src/assets/types/ILensHub';
import { converterObjectToArray } from '../../helpers/time';

@Component({
  selector: 'dececode-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements AfterViewInit {
  readingContract:AngularContract;
  allProfiles:Array<ProfileStructStruct>
  suggestionsArray:Array<ISUGGESTION> = [
    { name:"Wuldku Kizon",nickname:"@wkizon"},
    { name:"Oriny Figash",nickname:"@OrinyFi22"},
    { name:"Maxe Nenial",nickname:"@maxe_nenial"},
  ]
  newsArray:Array<INEWS>
  totalSupply: number
  ready: boolean;
  fetchedProfiles = {};
  profiles = [];
  constructor(  public formBuilder: FormBuilder,
    private dappInjectorService: DappInjectorService,
    private store: Store,) { 
    this.newsArray = MockNews;
   }

   ngAfterViewInit(): void {
    this.store
    .select(web3Selectors.fetchedProfiles)
    .subscribe(async (value) => {

      const profiles = converterObjectToArray(value);

      for (const profile of profiles) {
        const tocheckProfile = this.fetchedProfiles[profile.profileId];
          if (tocheckProfile == undefined) {
            this.fetchedProfiles[profile.profileId] = profile; 
            this.profiles.push(profile)          
          } 
      }

      
    });
  
  }
}
