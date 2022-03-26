import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AngularContract, DappInjectorService, randomString, web3Selectors } from 'angular-web3';
import { utils } from 'ethers';


import { Subject } from 'rxjs';

import { IUSER_POST_BLOG } from 'src/app/shared/models';
import { IMetadata_ERC721, MetadataVersions } from 'src/app/shared/models/metadata';
import { IpfsService } from 'src/app/shared/services/ipfs-service';
import { CreateProfileDataStruct } from 'src/assets/types/ILensHub';

@Component({
  selector: 'app-create-publication',
  templateUrl: './create-publication.component.html',
  styleUrls: ['./create-publication.component.scss']
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
  nft_src: any;
  constructor(
    public formBuilder: FormBuilder,
    private dappInjectorService: DappInjectorService,
    private store: Store,
    private cd: ChangeDetectorRef,
    private ipfsService: IpfsService,
    public router: Router
  ) {
    this.collectModuleOptions[0].address =  this.dappInjectorService.lensProtocolAddresses['empty collect module'];
    this.collectModuleOptions[1].address =
      this.dappInjectorService.lensProtocolAddresses['fee collect module'];


      this.publicationForm = this.formBuilder.group({
        handleCtrl: ['', [Validators.required, Validators.maxLength(20)]],
        descriptionCtrl: [
          'my Description',
          [Validators.required, Validators.maxLength(200)],
        ],
        twitterCtrl: [],
        webCtrl: [''],
        followModuleCtrl: [0],
      });


  }


  editorChanged() {}
  async createProfile() {
    this.clicked = true;

    if (this.publicationForm.invalid) {
      alert('please fill');
      return;
    }

    console.log('now is time');
    await this.ipfsService.init();
    const result = await this.ipfsService.add(this.nft_src);

    if (!result || !result.path) {
      alert('error profileimagublicatione');
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
      description: this.publicationForm.controls.descriptionCtrl.value,
      name: this.publicationForm.controls.handleCtrl.value,
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
      handle: this.publicationForm.controls.handleCtrl.value,
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
      const newBlog: IUSER_POST_BLOG = {
        status: 'draft',
        timeStamp: new Date().getTime(),
        updateTimeStamp: new Date().getTime(),
        type: 'blog',
        uid: 'this.user.uid',
        id: 'randomString(20)',
        likes: 0,
        payload: {
          title: '',
          description: '',
          keywords: '',
          tags: [],
          content: `<h1>Un título claro y conciso</h1><figure class="image"><img src="https://storage.googleapis.com/inci-public/members/PfBCYRA0yrZOES4Iy1XzEMnd2re2/profile/S4IWFNCd6j.png"></figure><p>Luego escogerás una foto que indique lo que mñas quieras resaltar de tu perfil, si eres divulgador@, si tienes una tienda Online, etc..</p><p>Siempre es importante una ‘bullet’ list para que conozcan rápidamente tus servicios:</p><ul><li>Tienda Online</li><li>Marcas Exclusivas</li><li>Comsñetica para todos los bolsillos</li></ul><p>Si quieres resaltar alguna información puedes hacerlo utilizando la bombilla:</p><aside class="success-box"><span class="success-title">Aqui quiero dar una <strong>idea</strong>, comentar algun <strong>éxito</strong></span></aside><aside class="alert-box"><span class="alert-title"><strong>OJO </strong>aqui escribiremos algún peligro o cosa a tener en cueta</span></aside><p>Para información utiliza el <strong>azul</strong></p><p>Tabién puedo escribir reseñas que nos han dejado, los clientes dicen</p><blockquote><p>"Un lugar espectacular, en cuanto pueda volveré!,</p></blockquote><p>&nbsp;</p><p>Puedes hacer muchas cosas con el editor, insertar links, cambiar el color de la letra o el tamaño, pero no lo ovides que lo mñas importante es lo que digas sobre ti para que te cnozcan.</p>`,
          category: { available: false, meta: '' },
          image: { available: false, image: '' },
        },
      };
      //this.initStatus();
      this.blog_state = { action: 'new', blog: newBlog };
  
      this.cd.detectChanges();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
