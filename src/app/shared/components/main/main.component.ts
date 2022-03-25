import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { DappInjectorService, web3Selectors } from 'angular-web3';
import { Location } from '@angular/common';

@Component({
  selector: 'dececode-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, AfterViewInit {
  blockchain_status: string;
  blockchain_is_busy: boolean;
  lenshub: import("c:/Users/javie/Documents/WEB/BLOCKCHAIN/desource/src/app/dapp-injector/index").AngularContract;
  lensHub: import("c:/Users/javie/Documents/WEB/BLOCKCHAIN/desource/src/app/dapp-injector/index").AngularContract;

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
      this.blockchain_status = value;
      console.log(value)

      this.lensHub = this.dappInjectorService.config.defaultContract;
      const address = await this.dappInjectorService.config.signer.getAddress()
      const p = await this.lensHub.contract.tokenOfOwnerByIndex(address,0)

      const myProfile = await this.lensHub.contract.getProfile(+p.toString())

      console.log(myProfile)

     

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
