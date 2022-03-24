import { Component, OnInit } from '@angular/core';
import { INEWS } from '../../models';
import MockNews from '../../../../assets/data/news.json';
import { ISUGGESTION } from '../../models/models-suggestions';

@Component({
  selector: 'dececode-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  suggestionsArray:Array<ISUGGESTION> = [
    { name:"Wuldku Kizon",nickname:"@wkizon"},
    { name:"Oriny Figash",nickname:"@OrinyFi22"},
    { name:"Maxe Nenial",nickname:"@maxe_nenial"},
  ]
  newsArray:Array<INEWS>
  constructor() {
    this.newsArray = MockNews;
   }

  ngOnInit(): void {
  }

}
