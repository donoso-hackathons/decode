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
  constructor(
    private dappInjectorService: DappInjectorService,
    private store: Store,
    private cd: ChangeDetectorRef,
    private ipfsService: IpfsService,
    public router: Router,
    public alertService: AlertService) { }


  async startStream() {
    const contractAddress = this.dappInjectorService.config.contracts['superfluid'].address;
    const flowRate = '3858024691358'
    const sf = await Framework.create({
      networkName: 'mumbai',
      provider: this.dappInjectorService.config.defaultProvider,
    });


    const encodedData = utils.defaultAbiCoder.encode(['uint256'], [this.profileId]);
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
  }


  async stopStream() {
    const contractAddress = this.dappInjectorService.config.contracts['superfluid'].address;
    const flowRate = '3858024691358'
    const sf = await Framework.create({
      networkName: 'mumbai',
      provider: this.dappInjectorService.config.defaultProvider,
    });


    const encodedData = utils.defaultAbiCoder.encode(['uint256'], [this.profileId]);
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
        this.profile = this.dappInjectorService.currentProfile;
  
        this.profileId = (await this.lensHubContract.contract.getProfileIdByHandle(this.profile.handle)).toString()
     
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
