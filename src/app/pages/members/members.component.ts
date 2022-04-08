import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  AngularContract,
  DappInjectorService,
  ICONTRACT_METADATA,
  Web3Actions,
  web3Selectors,
} from 'angular-web3';
import { AlertService } from 'src/app/shared/components/alerts/alert.service';
import { IpfsService } from 'src/app/shared/services/ipfs-service';
import { Framework } from '@superfluid-finance/sdk-core';
import { utils } from 'ethers';
import { ProfileStructStruct } from 'src/assets/types/ILensHub';
import { abi_ERC20 } from 'src/app/dapp-injector/abis/ERC20_ABI';

@Component({
  selector: 'dececode-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss'],
})
export class MembersComponent implements AfterViewInit {
  blockchain_status: string;
  blockchain_is_busy: boolean;
  lensHubContract: AngularContract;
  profileId: string;
  profile: ProfileStructStruct;
  hasSubscription: boolean = false;
  ERC20_METADATA: any;
  daiContract: AngularContract;
  myBalance: any;
  niceBalance: string;
  myaddress: string;
  constructor(
    private dappInjectorService: DappInjectorService,
    private store: Store,
    private cd: ChangeDetectorRef,
    private ipfsService: IpfsService,
    public router: Router,
    public alertService: AlertService
  ) {
    this.ERC20_METADATA = {
      abi: abi_ERC20,
      address: '0x5D8B4C2554aeB7e86F387B4d6c00Ac33499Ed01f',
      network: 'mumbai',
    };
  }

  async startStream() {
    if (this.myBalance == 0) {
      this.alertService.showAlertERROR(
        'OOPS',
        'to Start the subscription uyou require some tokens'
      );
      return;
    }

    try {
      this.store.dispatch(Web3Actions.chainBusy({ status: true }));

      const contractAddress =
        this.dappInjectorService.config.contracts['superfluid'].address;

      const flowRate = '3858024691358';

      const sf = await Framework.create({
        networkName: 'mumbai',
        provider: this.dappInjectorService.config.defaultProvider,
      });

      const encodedData = utils.defaultAbiCoder.encode(['uint256'], [1]);

      const createFlowOperation = sf.cfaV1.createFlow({
        flowRate: flowRate,
        receiver: contractAddress,
        superToken: '0x5D8B4C2554aeB7e86F387B4d6c00Ac33499Ed01f', //environment.mumbaiDAIx,
        userData: encodedData,
        overrides: {
          gasPrice: utils.parseUnits('100', 'gwei'),
          gasLimit: 2000000,
        },
      });
      console.log('Creating your stream...');

      const result = await createFlowOperation.exec(
        this.dappInjectorService.config.signer
      );
      const result2 = await result.wait();

      console.log(
        `Congrats - you've just created a money stream!
View Your Stream At: https://app.superfluid.finance/dashboard/${contractAddress}`
      );
      this.hasSubscription = await this.dappInjectorService.config.contracts[
        'superfluid'
      ].contract.hasSubscription(1, this.myaddress);

      this.store.dispatch(Web3Actions.chainBusy({ status: false }));
    } catch (error) {
      console.log(error);
      this.store.dispatch(Web3Actions.chainBusy({ status: false }));
    }
  }

  async stopStream() {
    try {
      this.store.dispatch(Web3Actions.chainBusy({ status: true }));
      console.log('again');
      const contractAddress =
        this.dappInjectorService.config.contracts['superfluid'].address;
      const flowRate = '0';
      console.log('again');
      const sf = await Framework.create({
        networkName: 'mumbai',
        provider: this.dappInjectorService.config.defaultProvider,
      });

      console.log('again');
      const encodedData = utils.defaultAbiCoder.encode(['uint256'], ['1']);
      console.log(encodedData);
      const myaddress =
        await this.dappInjectorService.config.signer.getAddress();
      const createFlowOperation = sf.cfaV1.deleteFlow({
        sender: myaddress,
        receiver: contractAddress,
        superToken: '0x5D8B4C2554aeB7e86F387B4d6c00Ac33499Ed01f', //environment.mumbaiDAIx,
        userData: encodedData,
        overrides: {
          gasPrice: utils.parseUnits('100', 'gwei'),
          gasLimit: 2000000,
        },
      });
      console.log('stoping your stream...');

      const result = await createFlowOperation.exec(
        this.dappInjectorService.config.signer
      );
      const result2 = await result.wait();

      console.log(result2);

      console.log(
        `Congrats - you've just stoped a money stream  View Your Stream At: https://app.superfluid.finance/dashboard/${contractAddress}`
      );

      this.store.dispatch(Web3Actions.chainBusy({ status: false }));
    } catch (error) {
      console.log(error);
      this.store.dispatch(Web3Actions.chainBusy({ status: false }));
    }
  }

  async mockStartStream() {
    try {
      this.store.dispatch(Web3Actions.chainBusy({ status: true }));
      console.log(this.myaddress);
      console.log(
        await this.dappInjectorService.config.contracts['superfluid'].contract
      );
      const mock_tx = await this.dappInjectorService.config.contracts[
        'superfluid'
      ].contract._openSubscription(1, this.myaddress, {
        gasPrice: utils.parseUnits('100', 'gwei'),
        gasLimit: 2000000,
      });

      const tx = await mock_tx.wait();

      this.hasSubscription = await this.dappInjectorService.config.contracts[
        'superfluid'
      ].contract.hasSubscription(1, this.myaddress);
      this.store.dispatch(Web3Actions.chainBusy({ status: false }));
      this.alertService.showAlertOK('OK', 'mock subscription has started');
    } catch (error) {
      console.log(error);
      this.alertService.showAlertERROR('OOOPS', 'Something went wrong');
      this.store.dispatch(Web3Actions.chainBusy({ status: false }));
    }
  }

  async mockStopStream() {
    try {
      this.store.dispatch(Web3Actions.chainBusy({ status: true }));
      const mock_tx = await this.dappInjectorService.config.contracts[
        'superfluid'
      ].contract._cancelSubscription(1, this.myaddress, {
        gasPrice: utils.parseUnits('100', 'gwei'),
        gasLimit: 2000000,
      });

      const tx = await mock_tx.wait();
      this.hasSubscription = await this.dappInjectorService.config.contracts[
        'superfluid'
      ].contract.hasSubscription(1, this.myaddress);
      this.store.dispatch(Web3Actions.chainBusy({ status: false }));
      this.alertService.showAlertOK(
        'OK',
        'mock subscription has been cancelled'
      );
    } catch (error) {
      this.alertService.showAlertOK('OOOPS', 'Something went wrong');
      this.store.dispatch(Web3Actions.chainBusy({ status: false }));
    }
  }
  async checkBalace() {}

  back() {
    this.router.navigateByUrl('');
  }
  ngAfterViewInit(): void {
    console.log('AFTER VIEW INNNNINTINTITNITN');

    this.store.select(web3Selectors.chainStatus).subscribe(async (value) => {
      this.blockchain_status = value;
      console.log(value);
      console.log(
        ['fail', 'wallet-not-connected', 'disconnected'].indexOf(value)
      );
      if (
        ['fail', 'wallet-not-connected', 'disconnected'].indexOf(value) !== -1
      ) {
        this.router.navigateByUrl('');
      } else if (value == 'loading') {
      } else {
        const contractAddress =
          this.dappInjectorService.config.contracts['superfluid'].address;
        console.log(contractAddress);
        this.lensHubContract = this.dappInjectorService.config.defaultContract;
        // this.profile = this.dappInjectorService.currentProfile;
        this.myaddress =
          await this.dappInjectorService.config.signer.getAddress();

        this.hasSubscription = await this.dappInjectorService.config.contracts[
          'superfluid'
        ].contract.hasSubscription(1, this.myaddress);

        this.daiContract = new AngularContract({
          metadata: this.ERC20_METADATA,
          provider: this.dappInjectorService.config.defaultProvider,
          signer: this.dappInjectorService.config.signer,
        });
        await this.daiContract.init();

        this.myBalance = +(
          await this.daiContract.contract.balanceOf(this.myaddress)
        ).toString();
        this.niceBalance = (this.myBalance / 10 ** 18).toFixed(4);

        // this.hasSubscription = await this.dappInjectorService.config.contracts[
        //   'superfluid'
        // ].contract._openSubscription

        //   this.profileId = (await this.lensHubContract.contract.getProfileIdByHandle(this.profile.handle)).toString()

        this.dappInjectorService.config.contracts['superfluid'].contract.on(
          'FlowUpdated',
          (args) => {
            let payload;
            console.log(args);
          }
        );

        this.dappInjectorService.config.contracts['superfluid'].contract.on(
          'ProfileAddress',
          (args) => {
            let payload;
            console.log(args);
          }
        );
      }
    });

    this.store
      .select(web3Selectors.isNetworkBusy)
      .subscribe((isBusy: boolean) => {
        console.log(isBusy);
        this.blockchain_is_busy = isBusy;
      });
  }
}
