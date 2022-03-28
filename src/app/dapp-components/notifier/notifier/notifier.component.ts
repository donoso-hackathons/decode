import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';

import {
  MAT_SNACK_BAR_DATA,
  MatSnackBarRef,
} from '@angular/material/snack-bar';

// .cJnnvO > div {
//   box-shadow: rgb(188 195 207) 0px 0px 0px inset, rgb(130 146 173 / 16%) 0px 8px 16px 0px !important;
// }

// .Notification_wrapper__14AQK {
//   box-sizing: border-box;
//   width: 400px;
//   max-height: 152px;
//   border: 1px solid #e0e8f8;
//   border-radius: 4px;
//   background-color: #fff;
//   box-shadow: inset 1px 0 0 #bcc3cf, 0 8px 16px 0 rgb(130 146 173 / 16%);
// }
// <svg width="40px" height="40px" viewBox="0 0 40 40" version="1.1" xmlns="http://www.w3.org/2000/svg"><g id="Notifications" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g transform="translate(-104.000000, -320.000000)" id="Temporary"><g transform="translate(80.000000, 81.000000)"><g id="Notification/Temporary/Positive" transform="translate(0.000000, 215.000000)"><g id="icon" transform="translate(24.000000, 24.000000)"><path d="M0,4.37160459 L0,35.6283954 C0,38.0425651 1.95715486,40 4.37160459,40 L35.6283954,40 C38.0428451,40 40,38.0425651 40,35.6283954 L40,4.37160459 C40,1.95715486 38.0428451,0 35.6283954,0 L4.37160459,0 C1.95715486,0 0,1.95715486 0,4.37160459 L0,4.37160459 Z" id="Path" fill="#10BB34"></path><path d="M27.6066017,10.7573593 L31.8492424,15 L19.185022,27.6623593 L17.2191281,29.8435798 L17.106022,29.7413593 L17,29.8492424 L14.929022,27.7783593 L8.76302196,22.2191281 L12.7808719,17.763022 L16.893022,21.4703593 L27.6066017,10.7573593 Z" id="Combined-Shape" fill="#FFFFFF" fill-rule="nonzero"></path></g></g></g></g></g></svg>

// <div class="Notification_message__1dpsJ"><div class="Title_wrapper__1M0ZE"><h1 class="Title_h4__2Vakp Title_medium__zzETA Title_left__S2mjG Title_default__1PPrv">Done</h1></div><div class="Title_wrapper__1M0ZE"><h1 class="Title_regular__3JAeE Title_body__fA6cP Title_left__S2mjG Title_default__1PPrv">0x979b…6054 Stream has been canceled.</h1></div></div>

// .Notification_wrapper__14AQK .Notification_message_box__By-wX .Notification_message__1dpsJ {
//   margin-left: 16px;
// }

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
