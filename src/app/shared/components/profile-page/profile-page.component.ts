import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileStructStruct } from 'src/assets/types/ILensHub';

@Component({
  selector: 'dececode-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss']
})
export class ProfilePageComponent implements OnChanges {

  constructor(private router:Router) { }

  @Input() currentProfile: ProfileStructStruct;
  @Input() availableProfiles:Array<ProfileStructStruct>

  ngOnChanges(): void {
  }
  goProfile(){
  this.router.navigateByUrl(`/app/create-profile`)
  }
  gotoPub(){
    this.router.navigateByUrl('/app/create-publication')
  }

}
