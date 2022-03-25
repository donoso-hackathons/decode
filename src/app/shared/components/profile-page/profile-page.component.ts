import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { ProfileStructStruct } from 'src/assets/types/ILensHub';

@Component({
  selector: 'dececode-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss']
})
export class ProfilePageComponent implements OnChanges {

  constructor() { }

  @Input() currentProfile: ProfileStructStruct;
  @Input() availableProfiles:Array<ProfileStructStruct>

  ngOnChanges(): void {
  }

}
