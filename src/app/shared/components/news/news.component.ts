import { Component, Input, OnInit } from '@angular/core';
import { INEWS } from '../../models';

@Component({
  selector: 'dececode-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {

  constructor() { }

  @Input() news:INEWS

  ngOnInit(): void {
  }

}
