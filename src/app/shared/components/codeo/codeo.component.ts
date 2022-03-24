import { Component, Input, OnInit } from '@angular/core';
import { ICODEO } from '../../models/models-codeo';

@Component({
  selector: 'dececode-codeo',
  templateUrl: './codeo.component.html',
  styleUrls: ['./codeo.component.scss']
})
export class CodeoComponent implements OnInit {

  constructor() { }

@Input() codeo:ICODEO

  ngOnInit(): void {
    console.log(this.codeo)
  }

}
