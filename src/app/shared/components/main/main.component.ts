import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AngularContract, DappInjectorService, web3Selectors } from 'angular-web3';
import { Location } from '@angular/common';
import { ProfileStructStruct } from 'src/assets/types/ILensHub';
import { NotifierService } from '../../../dapp-components/notifier';

@Component({
  selector: 'dececode-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, AfterViewInit {
  blockchain_status: string;
  blockchain_is_busy: boolean;
  lensHub: AngularContract;
  currentProfile: ProfileStructStruct;
  availableProfiles:Array<ProfileStructStruct> = [];
  value: string;
  profileAdress: string;

  constructor(
    private notifierService:NotifierService,
    private location: Location, 
    private dappInjectorService: DappInjectorService,
    private store: Store,
    private router: Router) { }


  connect() {
   // this.router.navigateByUrl('/app/create-profile')
    this.dappInjectorService.launchWenmodal();
  }


  signUp() {
    this.router.navigateByUrl(`/app/create-profile`)
   // this.dappInjectorService.launchWenmodal();
  }

  ngAfterViewInit(): void {

    console.log(' i am intering')
    if (this.value  == 'lens-profiles-found'){
      this.availableProfiles = this.dappInjectorService.availableProfiles;
      this.currentProfile = this.dappInjectorService.currentProfile;
    }

    this.store.select(web3Selectors.chainStatus).subscribe(async (value) => {
    
      console.log(value)
      this.value = value;
      if (value == 'lens-profiles-found' ) {
        this.availableProfiles = this.dappInjectorService.availableProfiles;
        this.currentProfile = this.dappInjectorService.currentProfile;
        this.profileAdress  = await this.dappInjectorService.config.signer.getAddress();
      }

      this.blockchain_status = value;


     
    });

    this.store
      .select(web3Selectors.isNetworkBusy)
      .subscribe((isBusy: boolean) => {
        console.log(isBusy);
        this.blockchain_is_busy = isBusy;
      });

  
  }


  ngOnInit(): void {
  }

}
