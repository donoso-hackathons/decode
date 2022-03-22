import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ViewChild,
  Output,
  EventEmitter,
  Input,
  Renderer2,
  ChangeDetectorRef,
  OnChanges,
} from '@angular/core';


import { fromEvent, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { ImageSnippet, PHOTO_STATUS, IPHOTO_STATE } from 'src/app/shared/models';



@Component({
  selector: 'inci-photo-wrapper',
  templateUrl: './photo.component.html',
  styleUrls: ['./photo.component.scss'],
})
export class PhotoComponent implements OnChanges {
  cropper:any;
  selectedFile!: ImageSnippet;
  photoStatus: PHOTO_STATUS;
  downloadUrl!: string;
  show_move = false;
  actualX!: number;
  actualY!: number;
  startx: any;
  starty: any;
  photoElement!: HTMLImageElement;
  show_crop = false;
  moveSubscription!: Subscription;
  srcEncoded!: string;
  constructor(
    private renderer: Renderer2,
    private cd: ChangeDetectorRef,) {
    this.photoStatus = PHOTO_STATUS.NONE;
  }
  @ViewChild('imageInput')
  public imageBtn!: HTMLInputElement;
  @Input()
  public photo_state!: IPHOTO_STATE;

  @Output() public photoLoaded: EventEmitter<{available: boolean, image:string}> = new EventEmitter();

  ngOnChanges(): void {

    if (this.photo_state.available === true) {
      if (this.photo_state.local === true) {
        if (this.selectedFile === undefined) {
          this.selectedFile = new ImageSnippet(this.photo_state.src);
        } else {
          this.selectedFile.src = this.photo_state.src;
        }
        this.photoStatus = PHOTO_STATUS.SELECTED;
      } else  {
        this.selectedFile = new ImageSnippet(this.photo_state.src);
        this.srcEncoded = this.photo_state.src;
        this.photoStatus = PHOTO_STATUS.SELECTED;
      }

      if (this.photo_state.download === true) {
        this.downloadFile(this.photo_state.path);
      }
    }
  }

  async downloadFile(src:any) {
    // try {
    //   this.photoStatus = PHOTO_STATUS.DOWNLOADING;
    //   this.firebaseStorageService.getDownloadUrl(src).then((url) => {
    //     this.photoStatus = PHOTO_STATUS.DOWNLOADED;

    //     this.downloadUrl = url;
    //     //this.renderer.setAttribute(this.elemRef.nativeElement, 'src', url);
    //   });
    // } catch (error) {
    //   this.photoStatus = PHOTO_STATUS.NONE;
    // }
  }

  async uploadFile(path:any,file:any) {
    // const urlPhotoUpload = `business/${this.userService.buId}/logo/logo-image.png`;
  

    // const metadata: UploadMetadata = {
    //   contentType: "image/png",
    //   customMetadata: {
    //     type: 'blog',
    //   },
    // };
 
 
    // const task = await this.firebaseStorageService.uploadString(
    //   path,
    //   file,
    //   metadata
    // );

   
    // await  this.alertService.showAlertOK('OK', 'El Logo se ha guardado con éxito');
    // this.sendUploaded.emit(true);
    this.photoStatus = PHOTO_STATUS.UPLOADED;
  }


  sendPhoto(object:{available:boolean, image:string}) {

    this.photoLoaded.emit({available: object.available, image:object.image});
    if (object.available == true) {
      this.uploadFile(this.photo_state.path, object.image)
    }


  }


  clearPicture() {
    // this.sendBizValid.emit(this.bizForm.valid && true)

    this.photoStatus = PHOTO_STATUS.NONE;
    this.sendPhoto({available: false, image:''});
    this.selectedFile = { src: '', pending: false };
  }



  croppResult(event:any){
    if (event.state == true) {
    this.selectedFile.src = event.image
    this.sendPhoto({available: true, image:this.selectedFile.src});
    }
    this.show_crop = false
  }


  processFile(imageInput: any) {
    const file: File = imageInput.files[0];
    const reader = new FileReader();

    reader.addEventListener('load', (event: any) => {
  
      let img = new Image()
      img.src = event.target.result;
      img.onload = (el:any) => {

   

      let height;
      let width;

      const aspectRatio = el['target']['width'] / el.target['height']
  

      if (aspectRatio > 1.33) {
        height= 240;
        width = 240 * aspectRatio
      } else {
        width=  320;
        height =  320 / aspectRatio;
      }


      const elem = document.createElement('canvas');//create a canvas


      elem.width = width
      elem.height = height

      //draw in canvas
      var ctx = elem.getContext('2d') as CanvasRenderingContext2D;
      ctx.drawImage(img, 0, 0, elem.width, elem.height);

      //get the base64-encoded Data URI from the resize image
      this.srcEncoded = ctx.canvas.toDataURL('image/png', 0);



      this.selectedFile = new ImageSnippet(this.srcEncoded, file);




      this.srcEncoded = event.target.result;
      this.photoStatus = PHOTO_STATUS.SELECTED;
      this.sendPhoto({available: true, image:this.selectedFile.src});

      }
    });

    reader.readAsDataURL(file);
  }
}
