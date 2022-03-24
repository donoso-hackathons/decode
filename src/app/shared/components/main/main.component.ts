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

  constructor(private location: Location, private dappInjectorService: DappInjectorService,
    private store: Store,
    private router: Router) { }


  connect() {
    this.router.navigateByUrl('/app/create-profile')
   // this.dappInjectorService.launchWenmodal();
  }


  ngAfterViewInit(): void {
    this.store.select(web3Selectors.chainStatus).subscribe(async (value) => {
      this.blockchain_status = value;
      console.log(value)
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
