import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  AngularContract,
  DappInjectorService,
  randomString,
  Web3Actions,
  web3Selectors,
} from 'angular-web3';
import { ethers, utils } from 'ethers';

import { Subject } from 'rxjs';
import { AlertService } from 'src/app/shared/components/alerts/alert.service';

import { IUSER_POST_BLOG } from 'src/app/shared/models';
import {
  IMetadata_ERC721,
  MetadataVersions,
} from 'src/app/shared/models/metadata';
import { IpfsService } from 'src/app/shared/services/ipfs-service';
import { LitProtocolService } from 'src/app/shared/services/lit-protocol-service';
import { PostDataStruct, ProfileStructStruct } from 'src/assets/types/ILensHub';
import { nftBase64 } from '../create-profile/avatar.base64';

function positiveVal(control: AbstractControl): { [key: string]: any } {
  if (Number(control.value) <= 0) {
    return { nonZero: true };
  } else {
    return null;
  }
}

@Component({
  selector: 'app-create-publication',
  templateUrl: './create-publication.component.html',
  styleUrls: ['./create-publication.component.scss'],
})
export class CreatePublicationComponent implements AfterViewInit {
  private ngUnsubscribe: Subject<void> = new Subject();
  collectModuleOptions = [
    {
      id: 0,
      name: 'Only Followers Can Collect',
      address: '',
    },
    {
      id: 1,
      name: 'Collect paying a fee',
      address: '',
    },
  ];
  publicationForm: FormGroup;
  blog_state!: { action?: 'new' | 'edit'; blog?: IUSER_POST_BLOG };
  clicked: boolean;
  blockchain_status: string;
  lensHubContract: AngularContract;
  blockchain_is_busy: boolean;
  show_create_success = false;
  nft_src: any;
  profile: ProfileStructStruct;
  profileId: any;
  encryptCtrl: FormControl = new FormControl(false);
  constructor(
    public formBuilder: FormBuilder,
    private dappInjectorService: DappInjectorService,
    private store: Store,
    private cd: ChangeDetectorRef,
    private litProtocolService: LitProtocolService,
    private ipfsService: IpfsService,
    public router: Router,
    public alertService: AlertService
  ) {
    this.collectModuleOptions[0].address =
      this.dappInjectorService.lensProtocolAddresses['empty collect module'];
    this.collectModuleOptions[1].address =
      this.dappInjectorService.lensProtocolAddresses['fee collect module'];

    this.publicationForm = this.formBuilder.group({
      titleCtrl: [
        'My awesome publication',
        [Validators.required, Validators.maxLength(100)],
      ],
      descriptionCtrl: [
        'my Gloroious eblblblblb blblbllb',
        [Validators.required, Validators.maxLength(500)],
      ],
      collectModuleCtrl: [0],
      valueCtrl: [10000],
    });

    this.nft_src = nftBase64;
  }

  resetNft() {
    this.nft_src = nftBase64;
  }

  uploadNft(event) {
    const file: File = event.target.files[0];
    console.log(file, 'fileeeee');
    const reader = new FileReader();
    reader.addEventListener('load', async (event: any) => {
      this.nft_src = event.target.result;
    });
    reader.readAsDataURL(file);
  }
  async createPublication() {
    this.clicked = true;
    let colletOption = this.publicationForm.controls.collectModuleCtrl.value;
    let collectData;
    const myaddress =
    await this.dappInjectorService.config.signer.getAddress();
    if (colletOption.value == 1){
      this.publicationForm.controls.valueCtrl.setValidators(Validators.compose([Validators.required, Validators.min(10000)]));
      const currencyAddress = this.dappInjectorService.lensProtocolAddresses['currency']
      console.log(currencyAddress)
      collectData = utils.defaultAbiCoder.encode([ "uint", "address","address","uint16" ], [ 10005, currencyAddress,myaddress,0 ]);
        
    } else {
      collectData = [];
      this.publicationForm.controls.valueCtrl.clearValidators()
    }


    if (this.publicationForm.invalid) {
      alert('please fill');
      return;
    }

    this.store.dispatch(Web3Actions.chainBusy({ status: true }));
    try {
      await this.ipfsService.init();
      const result = await this.ipfsService.add(this.nft_src);

      if (!result || !result.path) {
        alert('error profileimagublicatione');
      }

  

      const nftImage_ipfs = await this.ipfsService.add(this.nft_src);
      if (!nftImage_ipfs || !nftImage_ipfs.path) {
        alert('error nft image');
      }

      const nftImage = nftImage_ipfs.path;

      // data:image/jpg
      let imageType = 'image/png';
      if (nftImage.indexOf('image/jpg')!== -1){
        imageType = 'image/jpeg'
      }
      let pubNft_metadata: IMetadata_ERC721 | any = {
        version: MetadataVersions.one,
        metadata_id: randomString(20),
        description: this.publicationForm.controls.descriptionCtrl.value,
        name: this.publicationForm.controls.titleCtrl.value,
        attributes: [],
        image: nftImage,
        media: [
          {
            item: nftImage,
            type: imageType,
          },
        ],
        appId: 'dececode',
      };

      
      let encripted;
      if (this.encryptCtrl.value == true){
        pubNft_metadata = await  this.litProtocolService.encrypt(pubNft_metadata)
        pubNft_metadata['encrypted'] = true
      }


      const pubNft_metadata_ipfs = await this.ipfsService.add(
        JSON.stringify(pubNft_metadata)
      );
      if (!pubNft_metadata_ipfs || !pubNft_metadata_ipfs.path) {
        alert('error nfturi');
      }

      let publication: PostDataStruct | any= {
        profileId: this.profileId.toString(),
        contentURI: pubNft_metadata_ipfs.path,
        collectModule: this.collectModuleOptions[0].address,
        collectModuleData: [],
        referenceModule: this.dappInjectorService.ZERO_ADDRESS,
        referenceModuleData: [],
      };

     

      const result_mint = await this.lensHubContract.contract.post(
        publication,
        { gasPrice: utils.parseUnits('100', 'gwei'), gasLimit: 2000000 }
      );
      console.log(result_mint);
      const tx = await result_mint.wait();
      console.log(tx);
      this.store.dispatch(Web3Actions.chainBusy({ status: false }));
      await this.alertService.showAlertOK('OK', 'your Publication is Out');
      this.router.navigateByUrl('/')
    } catch (error) {
      console.log(error)
      this.store.dispatch(Web3Actions.chainBusy({ status: false }));
      await this.alertService.showAlertERROR('OOPS', 'An Error has happened');
      //this.router.navigateByUrl('/')
    }
  }

  back() {
    this.router.navigateByUrl('');
  }

  ngAfterViewInit(): void {
    this.store.select(web3Selectors.chainStatus).subscribe(async (value) => {
      this.blockchain_status = value;

      if (
        ['fail', 'wallet-not-connected', 'disconnected'].indexOf(value) !== -1
      ) {
        this.router.navigateByUrl('');
      } else {
        this.lensHubContract = this.dappInjectorService.config.defaultContract;
        this.profile = this.dappInjectorService.currentProfile;
        this.profileId = (
          await this.lensHubContract.contract.getProfileIdByHandle(
            this.profile.handle
          )
        ).toString();
      }
    });

    this.store
      .select(web3Selectors.isNetworkBusy)
      .subscribe((isBusy: boolean) => {
        this.blockchain_is_busy = isBusy;
      });

    this.cd.detectChanges();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
