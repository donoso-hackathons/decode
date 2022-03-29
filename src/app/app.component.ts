import { AfterContentInit, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { web3Selectors } from 'angular-web3';
import { IpfsService } from './shared/services/ipfs-service';
import { LitProtocolService } from './shared/services/lit-protocol-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterContentInit {
  title = 'desource';
  blockchain_is_busy: boolean;

  constructor(
    private store: Store,
    private ipfsService:IpfsService,
    private litProtocolService:LitProtocolService){

    

  }

  async asyncStuff(){
    await this.ipfsService.init()
    await  this.litProtocolService.init()

  }

  ngAfterContentInit(): void {
  this.asyncStuff()

   this.store
   .select(web3Selectors.isNetworkBusy)
   .subscribe((isBusy: boolean) => {
     console.log(isBusy);
     this.blockchain_is_busy = isBusy;
   });


    
  }


}
