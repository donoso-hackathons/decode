import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AngularContract, DappInjectorService, web3Selectors } from 'angular-web3';
import { Location } from '@angular/common';
import { ProfileStructStruct } from 'src/assets/types/ILensHub';
import { ProfileDataStruct } from 'hardhat/typechain-types/FeeFollowModule';

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

  constructor(private location: Location, private dappInjectorService: DappInjectorService,
    private store: Store,
    private router: Router) { }


  connect() {
   // this.router.navigateByUrl('/app/create-profile')
    this.dappInjectorService.launchWenmodal();
  }


  signUp() {
    this.router.navigateByUrl('/app/create-profile')
   // this.dappInjectorService.launchWenmodal();
  }

  ngAfterViewInit(): void {
    this.store.select(web3Selectors.chainStatus).subscribe(async (value) => {
    
      console.log(value)
      if (value == 'lens-profiles-found' ) {
      const signerAddress = await this.dappInjectorService.config.signer.getAddress()
      const profiles_nr =  +((await this.dappInjectorService.config.defaultContract.contract.balanceOf(signerAddress)).toString())
      this.lensHub = this.dappInjectorService.config.defaultContract;
      let pub= 0;
      let maxpubIndex=0;
      for (let i=0; i<profiles_nr;i++){
        const token = await this.lensHub.contract.tokenOfOwnerByIndex(signerAddress,i)
        const profile = await this.lensHub.contract.getProfile(+token.toString()) as ProfileStructStruct
        this.availableProfiles.push(profile)
        if(profile.pubCount > pub){
          maxpubIndex = i
        }
      }
      this.currentProfile = this.availableProfiles[0];
      

      }

      this.blockchain_status = value;

      //await this.dappInjectorService.config.defaultContract.contract.

      // if (this.location.path().indexOf('/inbox-gratitude') !==  -1){

      // } else if (value == 'success'){
      //   console.log(this.router.url)
      //    this.router.navigateByUrl('/dashboard')
      //  } else {
      //    this.router.navigateByUrl('/landing')
      //  }



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
