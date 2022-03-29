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
 
    await  this.litProtocolService.init()
   const result = await this.litProtocolService.encrypt({profile:4, description:'ahora que clarooooooi'})
    // console.log(result)
    // const { cid } = await this.ipfsService.add(JSON.stringify(result));
    // const result2 =  await this.ipfsService.getFile(cid)
 
    const result3 = await this.litProtocolService.decrypt(result)
     console.log(result3)

  }

  ngAfterContentInit(): void {
  this.asyncStuff()
  this.ipfsService.init()
   this.store
   .select(web3Selectors.isNetworkBusy)
   .subscribe((isBusy: boolean) => {
     console.log(isBusy);
     this.blockchain_is_busy = isBusy;
   });


    
  }


}
