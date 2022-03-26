import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'dececode-menu-bar',
  templateUrl: './menu-bar.component.html',
  styleUrls: ['./menu-bar.component.scss']
})
export class MenuBarComponent implements OnInit {

  constructor(private router:Router) { }
  goMembers(){
    this.router.navigateByUrl('/members')
  }

  ngOnInit(): void {
  }

}
