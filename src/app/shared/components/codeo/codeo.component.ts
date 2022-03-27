import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ICODEO } from '../../models/models-codeo';

@Component({
  selector: 'dececode-codeo',
  templateUrl: './codeo.component.html',
  styleUrls: ['./codeo.component.scss']
})
export class CodeoComponent implements OnInit {

  constructor() { }

@Input() codeo:any
@Output() onDecrypt =  new EventEmitter();
@Output() onCollect =  new EventEmitter();
  ngOnInit(): void {
    console.log(this.codeo.id)
  }

  collect() {
    this.onCollect.emit(this.codeo)
  }

  decrypt(){
    console.log('decrp')
    console.log(this.codeo)
    this.onDecrypt.emit(this.codeo.id)
  }

}
