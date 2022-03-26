import { AfterContentInit, Component } from '@angular/core';
import { IpfsService } from './shared/services/ipfs-service';
import { LitProtocolService } from './shared/services/lit-protocol-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterContentInit {
  title = 'desource';

  constructor(private ipfsService:IpfsService,private litProtocolService:LitProtocolService){

    

  }

  async asyncStuff(){
    await   this.ipfsService.init()
    await  this.litProtocolService.init()
    const result = await this.litProtocolService.encrypt({profile:4, description:'ahora que clarooooooi'})

    // const { cid } = await this.ipfsService.add(JSON.stringify(result));
    // const result2 =  await this.ipfsService.getFile(cid)
 
    // const result3 = await this.litProtocolService.decrypt(result2)
    // console.log(result3)

  }

  ngAfterContentInit(): void {
   this.asyncStuff()
    
  }


}
