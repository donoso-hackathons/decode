import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';


declare global {
  interface Window {
    webRTMP: any;
  }
}

@Injectable({
  providedIn: 'root',
})
export class LivePeerService {
  livepeer_client: any;
  loading = true;
  constructor(  @Inject(DOCUMENT) private readonly document: any) {}

  // async getFileObervable(hash:string){
  //   let myObject = '';
  //   from(this.ipfs.cat(hash)).pipe( 
  //     switchMap((buffer: Buffer) => {

  //     })
  //   )
  // }

 

  
  loadTagToPromise(options:{name:string, type:'script' | 'link',  args:Array<{name:string, value:string}>}){
    if (document.getElementById(options.name) !== null) { 
        return true
    }
    const promiseTag = new Promise<void>((resolve, reject) => {
      let tag = this.document.createElement(options.type);
      try {
        
    
        for (const attribute of options.args) {
          tag[attribute.name]= attribute.value
        
      }
      console.log(tag)
        tag.onload = () => {
      
          resolve();
        };
        this.document.body.appendChild(tag);
      } catch (error) {
        reject();
        console.log(error);
      }
    });
    return promiseTag
  }

  async start() {
    const streamKey = '320aabde-ce60-4538-a43d-e79924af8467'
  
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    })
  
    const session = this.livepeer_client.cast(stream, streamKey)
  
    session.on('open', () => {
      console.log('Stream started.')
    })
  
    session.on('close', () => {
      console.log('Stream stopped.')
    })
  
    session.on('error', (err) => {
      console.log('Stream error.', err.message)
    })
  }

  async init() {
    if (this.loading == true) {
      // await this.loadTagToPromise({
      //   name: 'jsoneditor_css',
      //   type: 'link',
      //   args: [
      //     { name: 'rel', value: 'stylesheet' },
      //     {
      //       name: 'href',
      //       value: 'https://unpkg.com/jsoneditor@9.6.0/dist/jsoneditor.min.css',
      //     },
      //   ],
      // });
      console.log('doen');
      await this.loadTagToPromise({
        name: 'livepeer_client',
        type: 'script',
        args: [
          {
            name: 'src',
            value:
              "https://unpkg.com/@livepeer/webrtmp-sdk@0.2.3/dist/index.js",
          },
          { name: 'type', value: 'text/javascript' },
        ],
      });
      console.log('doen');
      this.livepeer_client =  window.webRTMP
   
      this.loading = false;
    }
  }
}
