import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { NETWORK_STATUS, web3Selectors } from 'angular-web3';
import { AlertService } from '../alerts/alert.service';

@Component({
  selector: 'dececode-menu-bar',
  templateUrl: './menu-bar.component.html',
  styleUrls: ['./menu-bar.component.scss']
})
export class MenuBarComponent implements AfterViewInit {
  blockchain_status: NETWORK_STATUS = 'loading'

  constructor(
    public alertService: AlertService,
    private store: Store,
    private router:Router) { }
  async goMembers(){
    if (['fail', 'wallet-not-connected', 'disconnected'].indexOf(this.blockchain_status)!== -1){
     await this.alertService.showAlertERROR('OOPS', 'Plase connect first your wallet to be member!!')
    } else {
      this.router.navigateByUrl('/members') 
    }
   
  }

  ngAfterViewInit(): void {
    this.store.select(web3Selectors.chainStatus).subscribe(async (value) => {
      this.blockchain_status = value;
      console.log(value);
      if (
        ['fail', 'wallet-not-connected', 'disconnected'].indexOf(value) !== -1
      ) {
      }
    })
  }

}
