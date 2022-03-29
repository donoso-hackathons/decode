import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { Store } from '@ngrx/store';
import {
  AngularContract,
  DappInjectorService,
  NETWORK_STATUS,
  Web3Actions,
} from 'angular-web3';
import { utils } from 'ethers';
import { abi_FOLLOW_NFT } from 'src/app/dapp-injector/abis/FOLLOW_NFT';
import { ICODEO } from '../../models/models-codeo';
import { AlertService } from '../alerts/alert.service';

import CollectFeeModuleMeatadata from '../../../../assets/contracts/feecollectmodule_metadata.json';
import { abi_ERC20 } from 'src/app/dapp-injector/abis/ERC20_ABI';
import { abi_CURRENCY } from 'src/app/dapp-injector/abis/CURRENCY';
import { LitProtocolService } from '../../services/lit-protocol-service';
import { IpfsService } from '../../services/ipfs-service';

@Component({
  selector: 'dececode-codeo',
  templateUrl: './codeo.component.html',
  styleUrls: ['./codeo.component.scss'],
})
export class CodeoComponent implements OnChanges {
  follower: 'not' | 'loading' | 'follower';
  followNftAngular: AngularContract;
  myAddress: string;
  tokensAmount: number = 0;
  collectContract: AngularContract;
  amount: number = 0;
  collectAddress: any;
  show_success: boolean;
  currencyContract: AngularContract;
  balance: any;
  constructor(
    private store: Store,
    public alertService: AlertService,
    private dappInjectorService: DappInjectorService,
    private ipfs: IpfsService,
    private litProtocolService: LitProtocolService,
  ) {}
  disabled = true;
  @Input() codeo: any;
  @Input() blockchain_status: NETWORK_STATUS;


  ngOnChanges(): void {
  
    if (
      this.blockchain_status == 'lens-profiles-found' ||
      this.blockchain_status == 'success'
    ) {
      this.disabled = false;
      console.log(this.codeo)
      this.refreshFollowing();
    }
  }

  async refreshFollowing() {
    this.follower = 'loading';
    if (this.codeo.encrypted == true) {
      this.follower = 'not';
      return;
    }
    const followNFTAddr =
      await this.dappInjectorService.config.defaultContract.contract.getFollowNFT(
        this.codeo.profileId
      );

    if (followNFTAddr == this.dappInjectorService.ZERO_ADDRESS) {
      this.follower = 'not';
      return;
    }

    this.followNftAngular = new AngularContract({
      metadata: {
        name: 'FOLLOWNFT',
        address: followNFTAddr,
        abi: abi_FOLLOW_NFT,
        network: 'mumbai',
      },
      provider: this.dappInjectorService.config.defaultProvider,
      signer: this.dappInjectorService.config.signer,
    });
    await this.followNftAngular.init();
    this.myAddress = await this.dappInjectorService.config.signer.getAddress();
    this.tokensAmount = +(
      await this.followNftAngular.contract.balanceOf(this.myAddress)
    ).toString();

    if (+this.tokensAmount > 0) {
    
      if (
        this.codeo.collectModule ==
        this.dappInjectorService.lensProtocolAddresses['fee collect module']
      ) {
        this.collectContract = new AngularContract({
          metadata: {
            abi: CollectFeeModuleMeatadata.abi,
            address: CollectFeeModuleMeatadata.address,
            name: 'FeeColectmodule',
            network: 'mumbai',
          },
          provider: this.dappInjectorService.config.defaultProvider,
          signer: this.dappInjectorService.config.signer,
        });
        await this.collectContract.init();
        const data = await this.collectContract.contract.getPublicationData(
          this.codeo.profileId,
          this.codeo.pubId
        );
        this.amount = +data.amount.toString();
      } else {
        this.amount = 0;
      }
      this.follower = 'follower';
    } else {
      this.follower = 'not';
    }
  }

  async unfollow() {
    this.store.dispatch(Web3Actions.chainBusy({ status: true }));
    try {
      const result_unFollow = await this.followNftAngular.contract.burn(
        this.myAddress,
        this.tokensAmount,
        {
          gasPrice: utils.parseUnits('100', 'gwei'),
          gasLimit: 2000000,
        }
      );
      const tx = await result_unFollow.wait();
      this.store.dispatch(Web3Actions.chainBusy({ status: false }));
      this.follower = 'not';
      this.alertService.showAlertOK('OK', 'You stop Following...');
    } catch (error) {
      console.log(error);
      this.alertService.showAlertERROR(
        'OOPS',
        'Something went wrong, burn function ot yet implemented'
      );
      this.store.dispatch(Web3Actions.chainBusy({ status: false }));
    }
  }

  async follow() {
    if (
      this.blockchain_status == 'lens-profiles-found' ||
      this.blockchain_status == 'success'
    ) {
      console.log('I am doing following', this.codeo.profileId);
      this.store.dispatch(Web3Actions.chainBusy({ status: true }));
      try {
        const result_follow =
          await this.dappInjectorService.config.defaultContract.contract.follow(
            [this.codeo.profileId],
            [[]],
            {
              gasPrice: utils.parseUnits('100', 'gwei'),
              gasLimit: 2000000,
            }
          );
        const tx = await result_follow.wait();
        this.alertService.showAlertOK(
          'OK',
          `Succesfull follow Operation with tx:${tx.transactionHash}`
        );
        this.follower = 'follower';
        this.store.dispatch(Web3Actions.chainBusy({ status: false }));
        this.refreshFollowing()
      } catch (error) {
        console.log(error);
        this.alertService.showAlertERROR('OOPS', 'Something went wrong');
        this.store.dispatch(Web3Actions.chainBusy({ status: false }));
      }
    } else {
      this.alertService.showAlertERROR(
        'OOPS',
        'You need to be connected to be able to follow'
      );
    }
  }

  async createCurrencyContract() {
    if (this.currencyContract == undefined) {
      const currency =
        this.dappInjectorService.lensProtocolAddresses['currency'];
      const contract = new AngularContract({
        metadata: {
          abi: abi_CURRENCY,
          address: currency,
          network: 'mumbai',
          name: 'Currency',
        },
        provider: this.dappInjectorService.config.defaultProvider,
        signer: this.dappInjectorService.config.signer,
      });
      await contract.init();
      return contract;
    } else {
      return this.currencyContract;
    }
  }

  async doFaucet() {
    try {
      this.store.dispatch(Web3Actions.chainBusy({ status: true }));
      this.currencyContract = await this.createCurrencyContract();
      const result_mint = await this.currencyContract.contract.mint(
        this.myAddress,
        +this.amount +1,
        {
          gasPrice: utils.parseUnits('100', 'gwei'),
          gasLimit: 2000000,
        }
      );
      const tx = await result_mint.wait();
      console.log(tx);
      this.store.dispatch(Web3Actions.chainBusy({ status: false }));
    } catch (error) {
      console.log(error);
      this.store.dispatch(Web3Actions.chainBusy({ status: false }));
    }
  }

  async collect() {
    if (this.follower !== 'follower') {
      this.alertService.showAlertERROR(
        'OOPS',
        'You have to follow the Creator in order to collect the publication'
      );
      return;
    }
    if (
      this.codeo.collectModule ==
      this.dappInjectorService.lensProtocolAddresses['empty collect module']
    ) {
      console.log('empty');
      this.collectAddress = this.codeo.collectModule;
      this.store.dispatch(Web3Actions.chainBusy({ status: true }));
      const result_collect =
        await this.dappInjectorService.config.defaultContract.contract.collect(
          this.codeo.profileId,
          this.codeo.pubId,
          [],
          {
            gasPrice: utils.parseUnits('100', 'gwei'),
            gasLimit: 2000000,
          }
        );
      const tx = await result_collect.wait();
      this.store.dispatch(Web3Actions.chainBusy({ status: false }));
      this.show_success = true;
    } else if (
      this.codeo.collectModule ==
      this.dappInjectorService.lensProtocolAddresses['fee collect module']
    ) {
      this.currencyContract = await this.createCurrencyContract();
      this.balance = +(
        await this.currencyContract.contract.balanceOf(this.myAddress)
      ).toString();
      console.log(this.balance);

      if (this.balance <= this.amount) {
        await this.alertService.showAlertOK(
          'OK',
          `you need ${this.amount + 1} TOKENS and your balance is ${this.balance}, click the faucet to earn some test tokens`
        );
      } else {
        try {
          const currencyAddress = this.dappInjectorService.lensProtocolAddresses['currency']
      

          const encodedData = utils.defaultAbiCoder.encode(
            ['address', 'uint256'],
            [this.currencyContract.address, this.amount]
          );
          this.collectAddress = this.codeo.collectModule;
             this.store.dispatch(Web3Actions.chainBusy({ status: true }));
          const result_collect =
            await this.dappInjectorService.config.defaultContract.contract.collect(
              this.codeo.profileId,
              this.codeo.pubId,
              encodedData,
              {
                gasPrice: utils.parseUnits('100', 'gwei'),
                gasLimit: 2000000,
              }
            );
          const tx = await result_collect.wait();
          this.store.dispatch(Web3Actions.chainBusy({ status: false }));
          this.show_success = true;
        } catch (error) {
          this.alertService.showAlertERROR('OOPS', 'Something went wrong')
          this.store.dispatch(Web3Actions.chainBusy({ status: false }));
          console.log(error)
        }
      }
    }
  }

  async decrypt() {
    this.store.dispatch(Web3Actions.chainBusy({ status: true }));
    const json = this.codeo;
    console.log(json)

    let pubjson_e = json.pubjson;
    try {
      console.log('ok')
      const pubjson = await this.litProtocolService.decrypt(pubjson_e);
      console.log(pubjson);
      const image = await this.ipfs.getImage(pubjson.media[0].item);

      let k = json.profileId;
      let i = json.pubId;
      let pub = json.pub;
      const publicationObject = {
        ...{ profileId: k, pubId: i, pubKey: `${k}-${i}`,   encrypted: false, },
        ...pubjson,
        ...pub,
        ...{ src: image.toString() },
        ...{ profile: this.codeo.profile},
        ...{ profile_src: this.codeo.profile_src.toString() },
      };

      //  this.publications.push(publicationObject);
      this.store.dispatch(
        Web3Actions.setPublication({ publication: publicationObject })
      );
      this.store.dispatch(Web3Actions.chainBusy({ status: false }));
      this.alertService.showAlertOK('OK', 'DECRYPTED !!!!!');


    } catch (error) {
      console.log(error)
      this.store.dispatch(Web3Actions.chainBusy({ status: false }));
      const myaddress =   await this.dappInjectorService.config.signer.getAddress();
      const amIallowed = await this.dappInjectorService.config.contracts[
        'superfluid'
      ].contract.hasSubscription(1,myaddress);
      let message = `You have to be subscribed to decode this publication`;
      if (amIallowed == true) {
        message = `Althought you are subscribed we have temprary problems with the network`;
        this.alertService.showAlertOK('OK', message);
      } else {
        this.alertService.showAlertERROR('OOPS', message);
      }
    }
  }
}
