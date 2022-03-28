import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { ICODEO } from '../../models/models-codeo';
import MockCodeos from '../../../../assets/data/data.json';
import { FormBuilder } from '@angular/forms';
import { Store } from '@ngrx/store';
import {
  AngularContract,
  DappInjectorService,
  Web3Actions,
  web3Selectors,
} from 'angular-web3';
import { IpfsService } from '../../services/ipfs-service';
import { ThisReceiver } from '@angular/compiler';
import { ProfileStructStruct } from 'src/assets/types/ILensHub';
import { LitProtocolService } from '../../services/lit-protocol-service';
import { AlertService } from '../alerts/alert.service';
import { utils } from 'ethers';

@Component({
  selector: 'dececode-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss'],
})
export class FeedComponent implements AfterViewInit {
  readingContract: AngularContract;
  codeos: Array<ICODEO>;
  totalSupply: number;
  totalPub: number;
  pubs: any[];
  ready: boolean;
  loading = true;
  publications: any = [];
  encrypted: any[];
  show_success: boolean;
  collectAddress: any;
  constructor(
    public formBuilder: FormBuilder,
    private dappInjectorService: DappInjectorService,
    private ipfs: IpfsService,
    private store: Store,
    private litProtocolService: LitProtocolService,
    public alertService: AlertService
  ) {}

  @Input() blockchain_status;




  async follow(pub) {
 
    if (
      this.blockchain_status == 'lens-profiles-found' ||
      this.blockchain_status == 'success'
    ) {
      console.log('I am doing following', pub.profileId);
      this.store.dispatch(Web3Actions.chainBusy({ status: true }));
      try {
      

        const result_follow =  await this.dappInjectorService.config.defaultContract.contract.follow(
          [pub.profileId],
          [[]],
          {
            gasPrice: utils.parseUnits('100', 'gwei'),
            gasLimit: 2000000,
          }
        );
        const tx = await result_follow.wait();
        this.alertService.showAlertOK('OK', `Succesfull follow Operation with tx:${tx.transactionHash}`)
       console.log(tx.transactionHash)
        this.store.dispatch(Web3Actions.chainBusy({ status: false }));
      } catch (error) {
        console.log(error)
        this.alertService.showAlertERROR('OOPS', 'Something went wrong')
        this.store.dispatch(Web3Actions.chainBusy({ status: false }));
      }
    } else {
      this.alertService.showAlertERROR(
        'OOPS',
        'You need to be connected to be able to follow'
      );
    }
  }

  async collect(pub) {
    console.log(pub);
    if (
      pub.collectModule ==
      this.dappInjectorService.lensProtocolAddresses['empty collect module']
    ) {
      this.collectAddress = pub.collectModule;
      this.store.dispatch(Web3Actions.chainBusy({ status: true }));
     const result_collect =  await this.dappInjectorService.config.defaultContract.contract.collect(
        pub.profileId,
        pub.pubId,
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
      pub.collectModule ==
      this.dappInjectorService.lensProtocolAddresses['fee collect module']
    ) {
      console.log('collect');
      const currency =
        this.dappInjectorService.lensProtocolAddresses['currency'];
      console.log(currency);
      const encodedData = utils.defaultAbiCoder.encode(
        ['string', 'uint256'],
        [currency, 10000]
      );
    }
  }

  async close() {
    this.show_success = false;
  }

  async decrypt(id) {
    const json = this.encrypted[id];
    try {
      const result = await this.litProtocolService.decrypt(json);
      this.alertService.showAlertOK('OK', 'Somehow now it is working');
    } catch (error) {
      const myaddress =
        await this.dappInjectorService.config.signer.getAddress();
      const amIallowed = await this.dappInjectorService.config.contracts[
        'superfluid'
      ].contract.hasSubscription();
      let message = `You have to be subscribed to decode this publication`;
      if (amIallowed == true) {
        message = `Althought you are subscribed we have temprary problems with the network`;
        this.alertService.showAlertOK('OK', message);
      } else {
        this.alertService.showAlertERROR('OOPS', message);
      }
    }
  }

  ngAfterViewInit(): void {
    this.store.pipe(web3Selectors.isviewReady).subscribe(async (value) => {
      console.log(value);

      if (this.ready == value) {
        return;
      }
      this.ready = value;
      console.log('I am defaulting....  feed.');
      this.readingContract =
        this.dappInjectorService.config.defaultViewContract;
      this.totalSupply = +(
        await this.readingContract.contract.totalSupply()
      ).toString();
      this.totalPub = 0;
      this.pubs = [];
      this.publications = [];
      this.encrypted = [];
      let encrpyted_index = 0;
      for (let k = this.totalSupply; k >= 1; k--) {
        const nrPubs = +(
          await this.readingContract.contract.getPubCount(k)
        ).toString();

        const profile: ProfileStructStruct =
          await this.readingContract.contract.getProfile(k);
          console.log(profile)
        let imageError = false;
        let image_Profile;
        let json_Profile;
    
        const profil_image_cid = profile.imageURI.replace(
          'https://ipfs.io/ipfs/',
          ''
        );
        const profil_json_cid = profile.followNFTURI.replace(
          'https://ipfs.io/ipfs/',
          ''
        );



        try {
          image_Profile = await this.ipfs.getImage(profil_image_cid);
          json_Profile = await this.ipfs.getFile(profil_json_cid);
        } catch (error) {
          console.log(error);
          imageError = true;
        }

        if (imageError == false) {
          this.totalPub = this.totalPub + nrPubs;
          for (let i = 1; i <= nrPubs; i++) {
            try {
              const pub = await this.readingContract.contract.getPub(k, i);
              const pubjson = await this.ipfs.getFile(pub.contentURI);

              if (pubjson.encrypted == true) {
                this.pubs.push({ profileId: k, pubId: i });
                this.encrypted.push(pubjson);

                this.publications.push({
                  ...{
                    id: encrpyted_index,
                    description:
                      'This content is protected only for subscribers',
                    src: 'assets/images/encryption.jpg',
                    encrypted: true,
                  },
                  ...{ profile: { handle: 'encrpyted' } },
                  ...{ profile_src: image_Profile },
                });
                encrpyted_index++;
              } else {
                const image = await this.ipfs.getImage(pubjson.media[0].item);

                this.pubs.push({ profileId: k, pubId: i });
                this.publications.push({
                  ...{ profileId: k, pubId: i },
                  ...pubjson,
                  ...pub,
                  ...{ src: image },
                  ...{ profile: json_Profile },
                  ...{ profile_src: image_Profile },
                });
               // return;
              }
            } catch (error) {
              console.log(error);
            }
          }
        }
      }
      this.loading = false;
    });
  }

  ngOnChanges() {}
}
