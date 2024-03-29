import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { Contract, Signer, Wallet } from 'ethers';
import { providers } from 'ethers';
import { AngularContract } from './classes';

import { netWorkById, NETWORKS } from './constants/constants';
import { startUpConfig } from './dapp-injector.module';
//import LensProtocolAddresses from '../../assets/contracts/addresses_localhost.json';
import LensProtocolAddresses from '../../assets/contracts_mumbai/addresses_mumbai.json';
import SuperFluidMetadata from '../../assets/contracts/superFluidFollowModule_metadata.json';

import {
  ICONTRACT_METADATA,
  ISTARTUP_CONFIG,
  ITRANSACTION_DETAILS,
  ITRANSACTION_RESULT,
} from './models';
import { Web3Actions, web3Selectors } from './store';

import { JsonRpcProvider, Web3Provider } from '@ethersproject/providers';
import { Web3ModalComponent } from './web3-modal/web3-modal.component';
import { LensApiService } from '../shared/services/lens-api-service';
import { ProfileStructStruct } from 'src/assets/types/ILensHub';
import { take } from 'rxjs';

interface ab  { run: ()=>{}} 

@Injectable({
  providedIn: 'root',
})
export class DappInjectorService {
  private _dollarExchange!: number;
  config!: ISTARTUP_CONFIG;
  webModal!: Web3ModalComponent;
  lensProtocolAddresses: { [key: string]: string } = LensProtocolAddresses;
  ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
  MATIC_ADDRESS = '0x0000000000000000000000000000000000001010';
  tokens: any;
  currentProfile: ProfileStructStruct;
  availableProfiles: Array<ProfileStructStruct> = [];

  constructor(
    @Inject(DOCUMENT) private readonly document: any,
    @Inject('lensProtocolMetadata')
    public contractMetadata: ICONTRACT_METADATA,
    private store: Store,
    public lensApiservice: LensApiService
  ) {
    //this.store
    this.initChain();
  }

  async createProvider(url_array: string[]) {
    let provider;
    if (url_array.length == 0) {
      provider = new providers.JsonRpcProvider();
    } else {
      const p_race = await Promise.race(
        url_array.map((map) => new providers.JsonRpcProvider(map))
      );
      provider = await p_race;
    }

    //this._signer = this._provider.getSigner();
    return provider;
  }

  async doTransaction(tx: any, signer?: any) {
    let notification_message: ITRANSACTION_RESULT = {
      success: false,
    };

    let transaction_details: ITRANSACTION_DETAILS = {
      txhash: '',
      bknr: 0,
      from: '',
      gas: '',
      to: '',
      value: '',
    };
    try {
      let tx_obj;

      if (!signer) {
        tx_obj = await this.config.signer!.sendTransaction(tx);
      } else {
        tx_obj = await signer.sendTransaction(tx);
      }

      let tx_result = await tx_obj.wait();
      const balance: any = await this.config.signer?.getBalance();
      this.store.dispatch(
        Web3Actions.updateWalletBalance({ walletBalance: balance })
      );

      const result = tx_result;
      transaction_details.txhash = result.transactionHash;
      transaction_details.from = result.from;
      transaction_details.to = result.to;
      transaction_details.gas = result.gasUsed.toString();
      transaction_details.bknr = result.blockNumber;

      tx_obj.value == undefined
        ? (transaction_details.value = '0')
        : (transaction_details.value = tx_obj.value.toString());
      notification_message.success = true;
      notification_message.success_result = transaction_details;
    } catch (e: any) {
      // console.log(e);
      // Accounts for Metamask and default signer on all networks
      let myMessage =
        e.data && e.data.message
          ? e.data.message
          : e.error && JSON.parse(JSON.stringify(e.error)).body
          ? JSON.parse(JSON.parse(JSON.stringify(e.error)).body).error.message
          : e.data
          ? e.data
          : JSON.stringify(e);
      if (!e.error && e.message) {
        myMessage = e.message;
      }

      try {
        let obj = JSON.parse(myMessage);
        if (obj && obj.body) {
          let errorObj = JSON.parse(obj.body);
          if (errorObj && errorObj.error && errorObj.error.message) {
            myMessage = errorObj.error.message;
          }
        }
      } catch (e) {
        //ignore
      }

      notification_message.error_message = myMessage;
    }

    return notification_message;
  }

  async handleContractError(e: any) {
    // console.log(e);
    // Accounts for Metamask and default signer on all networks
    let myMessage =
      e.data && e.data.message
        ? e.data.message
        : e.error && JSON.parse(JSON.stringify(e.error)).body
        ? JSON.parse(JSON.parse(JSON.stringify(e.error)).body).error.message
        : e.data
        ? e.data
        : JSON.stringify(e);
    if (!e.error && e.message) {
      myMessage = e.message;
    }

    try {
      let obj = JSON.parse(myMessage);
      if (obj && obj.body) {
        let errorObj = JSON.parse(obj.body);
        if (errorObj && errorObj.error && errorObj.error.message) {
          myMessage = errorObj.error.message;
        }
      }
    } catch (e) {
      //ignore
    }

    return myMessage;
  }

  async launchWenmodal() {
    if (
      this.config.defaultNetwork == 'localhost' &&
      this.config.wallet !== 'wallet'
    ) {
      this.connectLocalWallet();
    } else {
      await this.webModal.connectWallet();
    }
  }

  async connectLocalWallet() {
    this.store.dispatch(Web3Actions.chainBusy({ status: true }));
    try {
      const hardhatProvider = await this.createProvider([
        NETWORKS[this.config.defaultNetwork].rpcUrl,
      ]);

      let wallet: Wallet;

      switch (this.config.wallet) {
        // case 'burner':
        //   const currentPrivateKey =
        //     window.localStorage.getItem('metaPrivateKey');
        //   if (currentPrivateKey) {
        //     wallet = new Wallet(currentPrivateKey);
        //   } else {
        //     wallet = Wallet.createRandom();
        //     const privateKey = wallet._signingKey().privateKey;
        //     window.localStorage.setItem('metaPrivateKey', privateKey);
        //   }
        //   break;

        default: //environment.privKey
          let privKey =
            '0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f19c30a34926a';
          wallet = new Wallet(privKey);
          break;
      }

      ////// local wallet
      const hardhatSigner = await wallet.connect(hardhatProvider);

      console.log(hardhatSigner.address);

      this.dispatchInit({ signer: hardhatSigner, provider: hardhatProvider });
    } catch (error: any) {
      console.log(error);

      // this.notifierService.showNotificationTransaction({
      //   success: false,
      //   error_message: error.toString(),
      // });
      this.store.dispatch(Web3Actions.chainStatus({ status: 'fail' }));
      this.store.dispatch(Web3Actions.chainBusy({ status: false }));
    }
  }

  async getLensProfilebyAddress() {
    const signerAddress = await this.config.signer.getAddress();
    let profilesBalancebyAdress = 0;
    profilesBalancebyAdress = +(
      await this.config.defaultContract.contract.balanceOf(signerAddress)
    ).toString();
    let pub = 0;
    let maxpubIndex = 0;
    for (let i = 0; i < profilesBalancebyAdress; i++) {
      const token =
        await this.config.defaultContract.contract.tokenOfOwnerByIndex(
          signerAddress,
          i
        );
      const profile = (await this.config.defaultContract.contract.getProfile(
        +token.toString()
      )) as ProfileStructStruct;
      this.availableProfiles.push(profile);
      if (profile.pubCount > pub) {
        maxpubIndex = i;
      }
    }
    this.currentProfile = this.availableProfiles[0];
    switch (profilesBalancebyAdress) {
      case 0:
        this.store.dispatch(Web3Actions.chainStatus({ status: 'success' }));
        break;

      default:
        this.store.dispatch(
          Web3Actions.chainStatus({ status: 'lens-profiles-found' })
        );
        break;
    }

    this.store.dispatch(Web3Actions.chainBusy({ status: false }));
  }

  async dispatchInit(dispatchObject: {
    signer: Signer;
    provider: JsonRpcProvider | Web3Provider;
  }) {
    this.config.signer = dispatchObject.signer;
    this.config.defaultProvider = dispatchObject.provider;

    const contract = new AngularContract({
      metadata: this.contractMetadata,
      provider: dispatchObject.provider,
      signer: dispatchObject.signer,
    });
    console.log(this.contractMetadata)
    await contract.init();

    this.config.defaultContract = contract;


    const fluidumContract = new AngularContract({
      metadata: SuperFluidMetadata,
      provider: dispatchObject.provider,
      signer: dispatchObject.signer,
    });
    await fluidumContract.init();
    this.config.contracts['superfluid'] = fluidumContract;

    const providerNetwork = await dispatchObject.provider.getNetwork();

    const networkString = netWorkById(providerNetwork.chainId)?.name as string;

    this.config.connectedNetwork = networkString;
    this.store.dispatch(
      Web3Actions.setSignerNetwork({ network: networkString })
    );

    this.getLensProfilebyAddress();
  }

  async initChain() {
    this.config = startUpConfig;

    const hardhatProvider = await this.createProvider([
      NETWORKS[this.config.defaultNetwork].rpcUrl,
    ]);
    const contract = new AngularContract<ab>({
      metadata: this.contractMetadata,
      provider: hardhatProvider,
      signer: hardhatProvider,
    });

 


    await contract.init();

    this.config.defaultViewContract = contract;
    this.store.dispatch(
      Web3Actions.viewContract({ status:true })
    );

    try {
      await hardhatProvider.getNetwork();
    } catch (error) {
      this.store.dispatch(Web3Actions.chainStatus({ status: 'fail' }));
      this.store.dispatch(Web3Actions.chainBusy({ status: false }));
      return;
    }

    if (this.config.wallet == 'wallet') {
      console.log('Check if 🦊 injected provider');
      let ethereum = (window as any).ethereum;
      if (!!(window as any).ethereum) {
        const metamaskProvider = new providers.Web3Provider(ethereum, 'any');

        const addresses = await metamaskProvider.listAccounts();
        console.log(addresses);
        if (addresses.length > 0) {
          const providerNetwork =
            metamaskProvider && (await metamaskProvider.getNetwork());
          const metamaskSigner = await metamaskProvider.getSigner();

          this.dispatchInit({
            signer: metamaskSigner,
            provider: metamaskProvider,
          });

          this.webModal = new Web3ModalComponent(
            {
              document: this.document,
              provider: ethereum,
            },
            this.store
          );
        } else {
          this.webModal = new Web3ModalComponent(
            { document: this.document },
            this.store
          );
          this.store.dispatch(
            Web3Actions.chainStatus({ status: 'wallet-not-connected' })
          );
          this.store.dispatch(Web3Actions.chainBusy({ status: false }));
          console.log('ethereum no connecte');
        }
      } else {
        this.webModal = new Web3ModalComponent(
          { document: this.document },
          this.store
        );
        this.store.dispatch(
          Web3Actions.chainStatus({ status: 'wallet-not-connected' })
        );
        this.store.dispatch(Web3Actions.chainBusy({ status: false }));
        console.log('wallet no connecte');
      }
      await this.webModal.loadWallets();
      console.log('i should change');
      this.webModal.onConnect.subscribe(async (walletConnectProvider) => {
        this.store.dispatch(Web3Actions.chainStatus({ status: 'fail' }));
        this.store.dispatch(Web3Actions.chainBusy({ status: true }));

        const webModalProvider = new providers.Web3Provider(
          walletConnectProvider
        );
        const webModalSigner = await webModalProvider.getSigner();
        this.dispatchInit({
          signer: webModalSigner,
          provider: webModalProvider,
        });
      });

      this.webModal.onDisConnect.subscribe(() => {
        console.log('i am disconnecting');
        this.availableProfiles = [];
        this.currentProfile = undefined;
        this.store.dispatch(Web3Actions.chainStatus({ status: 'fail' }));
        this.store.dispatch(Web3Actions.chainBusy({ status: false }));
      });
    } else {
      this.connectLocalWallet();
      // this.store.dispatch(Web3Actions.chainStatus({ status: 'disconnected' }));
      // this.store.dispatch(Web3Actions.chainBusy({ status: false }));
      this.store.pipe(web3Selectors.pleaseDisconnect).subscribe(() => {
        console.log('i amdisconencting manually');
        this.store.dispatch(
          Web3Actions.chainStatus({ status: 'disconnected' })
        );
        this.store.dispatch(Web3Actions.chainBusy({ status: false }));
        this.config.signer = undefined;
        this.config.contracts = {};
        this.config.defaultContract = null;
        this.config.defaultProvider = null;
      });
    }
  }
}
