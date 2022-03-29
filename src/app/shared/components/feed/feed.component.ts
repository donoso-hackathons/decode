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
import { converterObjectToArray } from '../../helpers/time';

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
  fetchedProfiles = {};
  fetchedPublications = {};

  constructor(
    public formBuilder: FormBuilder,
    private dappInjectorService: DappInjectorService,
    private ipfs: IpfsService,
    private store: Store,
    public alertService: AlertService
  ) {
    this.publications = [];
  }

  @Input() blockchain_status;

  async close() {
    this.show_success = false;
  }

  ngAfterViewInit(): void {
    this.store
      .select(web3Selectors.fetchedPublications)
      .subscribe(async (value) => {

        const publications = converterObjectToArray(value);

        for (const pub of publications) {
          const tocheckPub = this.fetchedPublications[pub.pubKey];

          if (pub.pubKey !== '2-1') {
            if (tocheckPub == undefined) {
              this.fetchedPublications[pub.pubKey] = pub;
              this.publications.push(pub);
            } else {
              if (tocheckPub.encrypted == true && pub.encrypted == false) {
                let index = this.publications
                  .map((map) => map.pubKey)
                  .indexOf(pub.key);
                console.log(index);
                this.fetchedPublications[pub.pubKey] = pub;
                this.publications[index] = pub;
              }
            }
          }
        }

        //  this.publications.push(value)
      });

      this.store
      .select(web3Selectors.fetchedProfiles)
      .subscribe(async (value) => {

        const profiles = converterObjectToArray(value);

        for (const profile of profiles) {
          const tocheckProfile = this.fetchedProfiles[profile.profileId];
            if (tocheckProfile == undefined) {
              this.fetchedProfiles[profile.profileId] = profile;           
            } 
        }

        //  this.publications.push(value)
      });


    this.store.pipe(web3Selectors.isviewReady).subscribe(async (value) => {
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
  
      this.encrypted = [];
      let encrpyted_index = 0;
      for (let k = this.totalSupply; k >= 1; k--) {
        const nrPubs = +(
          await this.readingContract.contract.getPubCount(k)
        ).toString();

        const profile: ProfileStructStruct =
          await this.readingContract.contract.getProfile(k);
        let imageError = false;
        let image_src;
        let json_Profile;
        const toCheckProfile = this.fetchedProfiles[k];
        // if (toCheckProfile == undefined) {
          const profil_image_cid = profile.imageURI.replace(
            'https://ipfs.io/ipfs/',
            ''
          );
          const profil_json_cid = profile.followNFTURI.replace(
            'https://ipfs.io/ipfs/',
            ''
          );

          try {
            image_src = await this.ipfs.getImage(profil_image_cid);
            json_Profile = await this.ipfs.getFile(profil_json_cid);
          } catch (error) {
            console.log(error);
            imageError = true;
          }

          this.store.dispatch(
            Web3Actions.setProfile({
              profile: {
                ...json_Profile,
                ...{ profileId: k, image_src: image_src.toString() },
              },
            })
          );
       // } 
        // else {
        //   console.log('profile already fetched')
        //   console.log(toCheckProfile)
        //   imageError = false;
        //   image_src = toCheckProfile.image_src;
        //   json_Profile = toCheckProfile.json_Profile;
        // }
        if (imageError == false) {
          this.totalPub = this.totalPub + nrPubs;
          for (let i = nrPubs; i >= 1; i--) {
            if (this.fetchedPublications[`${k}-${i}`] == undefined) {
            try {

              const pub = await this.readingContract.contract.getPub(k, i);
              const pubjson = await this.ipfs.getFile(pub.contentURI);

              if (pubjson.encrypted == true) {
                this.pubs.push({ profileId: k, pubId: i });
                this.encrypted.push(pubjson);

                const publicationObject = {
                  ...{
                    profileId: k,
                    pubId: i,
                    pubKey: `${k}-${i}`,
                    encrypted: true,
                  },
                  ...{
                    id: encrpyted_index,
                    description:
                      'This content is protected only for subscribers',
                    src: 'assets/images/encryption.jpg',
                  },
                  ...pub,
                  ...{ pubjson },
                  ...{ profile: json_Profile },
                  ...{ profile_src: image_src.toString() },
                };

                encrpyted_index++;

                this.store.dispatch(
                  Web3Actions.setPublication({ publication: publicationObject })
                );
              } else {
                const image = await this.ipfs.getImage(pubjson.media[0].item);

                this.pubs.push({ profileId: k, pubId: i });

                console.log(json_Profile)

                const publicationObject = {
                  ...{
                    profileId: k,
                    pubId: i,
                    pubKey: `${k}-${i}`,
                    encrypted: false,
                  },
                  ...pubjson,
                  ...pub,
                  ...{ src: image.toString() },
                  ...{ profile: json_Profile },
                  ...{ profile_src: image_src.toString() },
                };

                //  this.publications.push(publicationObject);
                this.store.dispatch(
                  Web3Actions.setPublication({ publication: publicationObject })
                );

                //return;
              }
            } catch (error) {
              console.log(error);
            }
            } else {
              console.log('piublication already fetched')
            }
          }
        
        }
      }
      this.loading = false;
    });
  }

  ngOnChanges() {}
}
