import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { AngularContract, DappInjectorService, NETWORK_STATUS, Web3Actions } from 'angular-web3';
import { utils } from 'ethers';
import { abi_FOLLOW_NFT } from 'src/app/dapp-injector/abis/FOLLOW_NFT';
import { ICODEO } from '../../models/models-codeo';
import { AlertService } from '../alerts/alert.service';

@Component({
  selector: 'dececode-codeo',
  templateUrl: './codeo.component.html',
  styleUrls: ['./codeo.component.scss']
})
export class CodeoComponent implements OnChanges {
  follower: 'not' | 'loading' | 'follower';
  followNftAngular: AngularContract;
  myAddress: string;
  tokensAmount: number;

  constructor(
    private store: Store,
    public alertService: AlertService,
    private dappInjectorService:DappInjectorService) { }
disabled = true;
@Input() codeo:any
@Input() blockchain_status:NETWORK_STATUS
@Output() onDecrypt =  new EventEmitter();
@Output() onCollect =  new EventEmitter();
@Output() onFollow =  new EventEmitter();  
@Output() onUnFollow =  new EventEmitter();  

ngOnChanges(): void {
    console.log(this.codeo.id)
    console.log(this.blockchain_status)
    if (this.blockchain_status == 'lens-profiles-found' || this.blockchain_status == 'success') {
      this.disabled = false;
      this.refreshFollowing()

    }
  }

  async refreshFollowing(){
    this.follower = 'loading';
    const followNFTAddr = await this.dappInjectorService.config.defaultContract.contract.getFollowNFT(this.codeo.profileId);
    this.followNftAngular = new AngularContract({
      metadata:  {
        name:'FOLLOWNFT',
        address:followNFTAddr,
        abi:abi_FOLLOW_NFT,
        network:'mumbai'},
      provider: this.dappInjectorService.config.defaultProvider,
      signer: this.dappInjectorService.config.signer
    })
    await this.followNftAngular.init()
    this.myAddress = await this.dappInjectorService.config.signer.getAddress()
    this.tokensAmount =  +((await this.followNftAngular.contract.balanceOf(this.myAddress)).toString())
  
    if (+this.tokensAmount >0){
      this.follower = 'follower';
    } else {
      this.follower = 'not';
    }

  }

 async unfollow() {
  this.store.dispatch(Web3Actions.chainBusy({ status: true }));
  try {
    

    const result_unFollow = await this.followNftAngular.contract.burn(this.myAddress,this.tokensAmount,
      {
        gasPrice: utils.parseUnits('100', 'gwei'),
        gasLimit: 2000000,
      }
    );
    const tx = await result_unFollow.wait();
    this.store.dispatch(Web3Actions.chainBusy({ status: false }));
    this.follower = 'not'
    this.alertService.showAlertOK('OK', 'You stop Following...')
  } catch (error) {
    console.log(error)
    this.alertService.showAlertERROR('OOPS', 'Something went wrong, burn function ot yet implemented')
    this.store.dispatch(Web3Actions.chainBusy({ status: false }));
  }
  }

  follow(){
    this.onFollow.emit(this.codeo)
  }

  collect() {
    this.onCollect.emit(this.codeo)
  }

  decrypt(){
    console.log('decrp')
    console.log(this.codeo)
    this.onDecrypt.emit(this.codeo.id)
  }

}
