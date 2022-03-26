import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';

import {
  MAT_SNACK_BAR_DATA,
  MatSnackBarRef,
} from '@angular/material/snack-bar';

const styles_snack = `.green-snackbar {
  background:white;
  color: white;
}

.green-snackbar  .head {
  color:var(--twitter)
}

mat-icon {
  color:var(--primary)
}
.ng-star-inserted {
  color:var(--primary)
}
.red-snackbar  .head {
  color:var(--like)
}

.red-snackbar {
  background:white;
  color: white;
}
`;

@Component({
  selector: 'transactor-notifier',
  templateUrl: './notifier.component.html',
  styleUrls: ['./notifier.component.css'],
})
export class NotifierComponent implements OnInit, AfterViewInit {
  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: any,
    public snackBarRef: MatSnackBarRef<NotifierComponent>
  ) {}
  ngAfterViewInit(): void {
    if (document.getElementById('snack_css') === null) {
      const style = document.createElement('style');
      document.getElementsByTagName('head')[0].appendChild(style);
      style.id = 'snack_css';
      const myCss = styles_snack.split('<br>').join('').split('\n').join('');
      style.innerText = myCss;
    }
  }

  ngOnInit(): void {}
}
