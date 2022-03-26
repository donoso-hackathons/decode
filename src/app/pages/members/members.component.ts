import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AngularContract, DappInjectorService, web3Selectors } from 'angular-web3';
import { AlertService } from 'src/app/shared/components/alerts/alert.service';
import { IpfsService } from 'src/app/shared/services/ipfs-service';
import { Framework } from '@superfluid-finance/sdk-core';
import { utils } from 'ethers';
import { ProfileStructStruct } from 'src/assets/types/ILensHub';

@Component({
  selector: 'dececode-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss']
})
export class MembersComponent implements AfterViewInit {
  blockchain_status: string;
  blockchain_is_busy: boolean;
  lensHubContract: AngularContract;
  profileId: string;
  profile: ProfileStructStruct;
  hasSubscription:boolean = false;
  constructor(
    private dappInjectorService: DappInjectorService,
    private store: Store,
    private cd: ChangeDetectorRef,
    private ipfsService: IpfsService,
    public router: Router,
    public alertService: AlertService) { }


  async startStream() {
    try {

      console.log('again')
      const contractAddress = this.dappInjectorService.config.contracts['superfluid'].address;
      const flowRate = '3858024691358'
      console.log('again')
      const sf = await Framework.create({
        networkName: 'mumbai',
        provider: this.dappInjectorService.config.defaultProvider,
      });

      console.log('again')
      const encodedData = utils.defaultAbiCoder.encode(['uint256'], ['4']);
      console.log(encodedData)
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

      const result = await createFlowOperation.exec(this.dappInjectorService.config.signer);
      const result2 = await result.wait();
      console.log(result2);

      console.log(
        `Congrats - you've just created a money stream!
View Your Stream At: https://app.superfluid.finance/dashboard/${contractAddress}`)

    } catch (error) {
      console.log(error)
    }

    
  }

  async stopStream() {
    try {

      console.log('again')
      const contractAddress = this.dappInjectorService.config.contracts['superfluid'].address;
      const flowRate = '0'
      console.log('again')
      const sf = await Framework.create({
        networkName: 'mumbai',
        provider: this.dappInjectorService.config.defaultProvider,
      });

      console.log('again')
      const encodedData = utils.defaultAbiCoder.encode(['uint256'], ['4']);
      console.log(encodedData)
      const myaddress = await this.dappInjectorService.config.signer.getAddress()
      const createFlowOperation = sf.cfaV1.deleteFlow({
        flowRate: flowRate,
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

      const result = await createFlowOperation.exec(this.dappInjectorService.config.signer);
      const result2 = await result.wait();
      console.log(result2);

      console.log(
        `Congrats - you've just created a money stream!
View Your Stream At: https://app.superfluid.finance/dashboard/${contractAddress}`)

    } catch (error) {
      console.log(error)
    }

    
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
        // this.profile = this.dappInjectorService.currentProfile;
        const myaddress = await this.dappInjectorService.config.signer.getAddress()
        console.log(myaddress)
         this.hasSubscription =  await this.dappInjectorService.config.contracts['superfluid'].contract.hasSubscription(4, myaddress);
        console.log(this.hasSubscription)
        //   this.profileId = (await this.lensHubContract.contract.getProfileIdByHandle(this.profile.handle)).toString()

        this.dappInjectorService.config.contracts['superfluid'].contract.on('FlowUpdated', (args) => {
          let payload;
          console.log(args);
        });

        this.dappInjectorService.config.contracts['superfluid'].contract.on('ProfileAddress', (args) => {
          let payload;
          console.log(args);
        });


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
