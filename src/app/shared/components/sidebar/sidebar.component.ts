import { AfterViewInit, Component, OnInit } from '@angular/core';
import { INEWS } from '../../models';
import MockNews from '../../../../assets/data/news.json';
import { ISUGGESTION } from '../../models/models-suggestions';
import { FormBuilder } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AngularContract, DappInjectorService, web3Selectors } from 'angular-web3';
import { ProfileStructStruct } from 'src/assets/types/ILensHub';

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
  constructor(  public formBuilder: FormBuilder,
    private dappInjectorService: DappInjectorService,
    private store: Store,) { 
    this.newsArray = MockNews;
   }

   ngAfterViewInit(): void {
  
    this.store.pipe(web3Selectors.isviewReady).subscribe(async (value) => {
      return
      console.log(value)
      if (this.ready  == value){
        return
      }

      this.ready = value;
      this.readingContract = this.dappInjectorService.config.defaultViewContract;
      console.log('I am defaulting.....')
      
      this.totalSupply = +(await this.readingContract.contract.totalSupply()).toString()
  
      const lastProfile = await this.readingContract.contract.getProfile(this.totalSupply)
      //console.log(lastProfile)

      const beforeProfile = await this.readingContract.contract.getProfile(this.totalSupply-1)
      this.allProfiles = [lastProfile,beforeProfile]

    })
  }
}
