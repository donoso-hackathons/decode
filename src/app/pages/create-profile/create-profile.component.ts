import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
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
  web3Selectors,
} from 'angular-web3';
import { Subject, takeUntil } from 'rxjs';
import { avatarBase64, nftBase64 } from './avatar.base64';
import { CreateProfileDataStruct } from '../../../assets/types/ILensHub';
import { IpfsService } from 'src/app/shared/services/ipfs-service';
import {
  IMetadata_ERC721,
  MetadataVersions,
} from 'src/app/shared/models/metadata';
import { utils } from 'ethers';

@Component({
  selector: 'app-create-profile',
  templateUrl: './create-profile.component.html',
  styleUrls: ['./create-profile.component.scss'],
})
export class CreateProfileComponent implements AfterViewInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject();
  profileForm: FormGroup;
  followModuleOptions = [
    {
      id: 0,
      name: 'Everyone Can Follow Me',
      address: '',
    },
    {
      id: 1,
      name: 'Supporting followers must pay a fee',
      address: '',
    },
  ];
  option = 0;
  samePictureCtrl: FormControl = new FormControl(false);
  image_src: any;
  nft_src: any;
  isSingleClick: boolean;
  clicked: boolean;
  blockchain_status: string;
  blockchain_is_busy: boolean;
  lensHubContract: AngularContract;
  profileData: CreateProfileDataStruct;

  constructor(
    public formBuilder: FormBuilder,
    private dappInjectorService: DappInjectorService,
    private store: Store,
    private cd: ChangeDetectorRef,
    private ipfsService: IpfsService,
    public router: Router
  ) {
    this.followModuleOptions[0].address = this.dappInjectorService.ZERO_ADDRESS;
    this.followModuleOptions[1].address =
      this.dappInjectorService.lensProtocolAddresses['fee follow module'];

    this.profileForm = this.formBuilder.group({
      handleCtrl: ['', [Validators.required, Validators.maxLength(20)]],
      descriptionCtrl: [
        'my Description',
        [Validators.required, Validators.maxLength(200)],
      ],
      twitterCtrl: [],
      webCtrl: [''],
      followModuleCtrl: [0],
    });

    const myRandom = randomString(10);
    this.profileForm.controls.handleCtrl.setValue(myRandom);

    this.profileForm.controls.followModuleCtrl.valueChanges.subscribe(
      (value) => {
        console.log(value);
      }
    );

    this.samePictureCtrl.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((value) => {
        console.log(value);
        if (value) {
          this.nft_src = this.image_src;
        } else {
          this.nft_src = nftBase64;
        }
      });

    this.image_src = avatarBase64;
    this.nft_src = nftBase64;
  }

  resetProfile() {
    this.image_src = avatarBase64;
  }
  uploadProfile(event) {
    const file: File = event.target.files[0];
    console.log(file, 'fileeeee');
    const reader = new FileReader();
    reader.addEventListener('load', async (event: any) => {
      this.image_src = event.target.result;
      const buf = Buffer.from(reader.result as ArrayBuffer);
      //  try {
      //   const result = await this.ipfsService.add(buf);
      //   console.log(result)
      //   console.log(`https://ipfs.io/ipfs/${result.path}`)
      //   this.imageUrl = `https://ipfs.io/ipfs/${result.path}`;
      //   this.image=this.imageUrl;
      //   console.log(this.imageUrl,"imageeeeeeee");
      //  } catch (error) {
      //    console.log(error,"errorrr");
      //    alert("Error Uploadig file");
      //  }
    });
    reader.readAsDataURL(file);

    // const reader2 = new FileReader();
    // reader2.addEventListener('load', async (event: any) => {

    //  this.buf = Buffer.from(reader2.result as ArrayBuffer)
    // });
    // reader2.readAsArrayBuffer(file);
  }

  resetNft() {
    this.nft_src = nftBase64;
    this.samePictureCtrl.setValue(false);
  }

  uploadNft(event) {
    const file: File = event.target.files[0];
    console.log(file, 'fileeeee');
    const reader = new FileReader();
    reader.addEventListener('load', async (event: any) => {
      this.nft_src = event.target.result;
      const buf = Buffer.from(reader.result as ArrayBuffer);
      //  try {
      //   const result = await this.ipfsService.add(buf);
      //   console.log(result)
      //   console.log(`https://ipfs.io/ipfs/${result.path}`)
      //   this.imageUrl = `https://ipfs.io/ipfs/${result.path}`;
      //   this.image=this.imageUrl;
      //   console.log(this.imageUrl,"imageeeeeeee");
      //  } catch (error) {
      //    console.log(error,"errorrr");
      //    alert("Error Uploadig file");
      //  }
    });
    reader.readAsDataURL(file);

    // const reader2 = new FileReader();
    // reader2.addEventListener('load', async (event: any) => {

    //  this.buf = Buffer.from(reader2.result as ArrayBuffer)
    // });
    // reader2.readAsArrayBuffer(file);
  }

  async createProfile() {
    this.clicked = true;

    if (this.profileForm.invalid) {
      alert('please fill');
      return;
    }

    console.log('now is time');
    await this.ipfsService.init();
    const result = await this.ipfsService.add(this.image_src);

    if (!result || !result.path) {
      alert('error profileimage');
    }

    const myaddress = await this.dappInjectorService.config.signer.getAddress();

    const nftImage_ipfs = await this.ipfsService.add(this.nft_src);
    if (!nftImage_ipfs || !nftImage_ipfs.path) {
      alert('error nft image');
    }

    const nftImage = nftImage_ipfs.path;

// data:image/jpg

    const followNft_metadata: IMetadata_ERC721 = {
      version: MetadataVersions.one,
      metadata_id: randomString(20),
      description: this.profileForm.controls.descriptionCtrl.value,
      name: this.profileForm.controls.handleCtrl.value,
      attributes: [],
      image: nftImage,
      media: [
        {
          item: nftImage,
          type: 'image/png',
        },
      ],
      appId: 'dececode',
    };

    const followNft_metadata_ipfs = await this.ipfsService.add(JSON.stringify(followNft_metadata));
    if (!followNft_metadata_ipfs || !followNft_metadata_ipfs.path) {
      alert('error nfturi');
    }
  
    const profile_paywall: CreateProfileDataStruct = {
      to: myaddress,
      handle: this.profileForm.controls.handleCtrl.value,
      imageURI: result.path,
      followModule: this.dappInjectorService.ZERO_ADDRESS,
      followModuleData: [],
      followNFTURI: 'https://ipfs.io/ipfs/' + followNft_metadata_ipfs.path,
    };
    const result_mint = await  this.lensHubContract.contract.createProfile(profile_paywall,
      { gasPrice: utils.parseUnits('100', 'gwei'), 
      gasLimit: 2000000 })
   const tx =  await result_mint.wait();
      console.log(tx)
  }

  back() {
    this.router.navigateByUrl('');
  }

  ngAfterViewInit(): void {
    this.store.select(web3Selectors.chainStatus).subscribe(async (value) => {
      this.blockchain_status = value;
      console.log(value);
      if (
        ['fail', 'wallet-not-connected', 'disconnected'].indexOf(value) !== -1
      ) {
        this.router.navigateByUrl('');
      } else {
        this.lensHubContract = this.dappInjectorService.config.defaultContract;
      }
    });

    this.store
      .select(web3Selectors.isNetworkBusy)
      .subscribe((isBusy: boolean) => {
        console.log(isBusy);
        this.blockchain_is_busy = isBusy;
      });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
