import { Component, Input, OnInit } from '@angular/core';
import { ISUGGESTION } from '../../models/models-suggestions';

@Component({
  selector: 'dececode-follow-suggestions',
  templateUrl: './follow-suggestions.component.html',
  styleUrls: ['./follow-suggestions.component.scss']
})
export class FollowSuggestionsComponent implements OnInit {

  constructor() { }
  @Input() suggestion:any
  ngOnInit(): void {
  }

}
