import { AfterContentInit, Component } from '@angular/core';
import { IpfsService } from './shared/services/ipfs-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterContentInit {
  title = 'desource';

  constructor(private ipfsService:IpfsService){

    

  }
  ngAfterContentInit(): void {
    this.ipfsService.init()
  }


}
