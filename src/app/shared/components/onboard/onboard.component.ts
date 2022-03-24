import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { NETWORK_STATUS } from 'angular-web3';

@Component({
  selector: 'dececode-onboard',
  templateUrl: './onboard.component.html',
  styleUrls: ['./onboard.component.scss']
})
export class OnboardComponent implements OnChanges {

  constructor() { }

  @Input() blockchain_status: NETWORK_STATUS 
  @Output() public connect = new EventEmitter<boolean>();

  ngOnChanges(): void {
    console.log(this.blockchain_status)
  }



}
