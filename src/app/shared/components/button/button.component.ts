import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'dececode-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit {

  constructor() { }

  @Input() outline;
  @Output() public onClick  = new EventEmitter<any>();

  emitClick() {
    this.onClick.emit()
  }

  ngOnInit(): void {
    console.log(this.outline)
  }

}
