import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'dececode-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  constructor() { }

  @Input()  title:string
  @Input()  elements:Array<any>
  @Input()  listType: 'suggestion' | 'news'
  ngOnInit(): void {
  }

}
