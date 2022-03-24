import { Component, OnInit } from '@angular/core';
import { ICODEO } from '../../models/models-codeo';
import MockCodeos from '../../../../assets/data/data.json';


@Component({
  selector: 'dececode-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})
export class FeedComponent implements OnInit {

  codeos:Array<ICODEO>
  constructor() { 
    this.codeos = MockCodeos

  }

  ngOnInit(): void {
  }

}
