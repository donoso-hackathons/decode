import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';


import { saveAs } from 'file-saver';
import { ICROPP_DIM } from 'src/app/shared/models';

declare const Cropper;

@Component({
  selector: 'app-cropp',
  templateUrl: './cropp.component.html',
  styleUrls: ['./cropp.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class CroppComponent implements AfterViewInit {
  cropper: any;
  image: any;
  constructor() {}
  @Input() public src;
  @Input() public dimensions: ICROPP_DIM;
  @Output() public result_cropp: EventEmitter<{
    state: boolean;
    image?: any;
  }> = new EventEmitter();

  close(): void {
    this.result_cropp.emit({ state: false });
  }

  downloadPicture() {
    const b = this.cropper
      .getCroppedCanvas(this.dimensions)
      .toDataURL('image/png');
    const blob = this.dataURItoBlob(b);
    saveAs(blob, 'pretty_image.png');
  }

  savePicture() {
    const b = this.cropper
      .getCroppedCanvas(this.dimensions)
      .toDataURL('image/png');
    this.result_cropp.emit({ state: true, image: b });
  }

  reset() {
    this.cropper.reset();
  }

  dataURItoBlob(dataURI): Blob {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    var byteString = atob(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length);

    // create a view into the buffer
    var ia = new Uint8Array(ab);

    // set the bytes of the buffer to the correct values
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    // write the ArrayBuffer to a blob, and you're done
    var blob = new Blob([ab], { type: mimeString });
    return blob;
  }

  loadScript() {
    return new Promise((resolve, reject) => {
    

      if (document.getElementById('cropper_script') === null) {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'assets/js/cropper.min.js';
        script.id = 'cropper_script';
        script.onload = () => {
          this.scriptLoaded();
          resolve({ script: name, loaded: true, status: 'Loaded' });
        };
        script.onerror = (error: any) => {
      
          resolve({ script: name, loaded: false, status: 'Loaded' });
        };
        document.getElementsByTagName('head')[0].appendChild(script);
      } else {
        this.scriptLoaded();
      }
    });
  }

  scriptLoaded() {
    this.image = document
      .querySelector('app-cropp')
      .shadowRoot.querySelector('#cropp');
    this.image.style.display = 'none';
    // console.log(this.image)
    const options = {
      aspectRatio: this.dimensions.width / this.dimensions.height,
      ready: (e) => {
        console.log(e.type);
        this.image.style.display = 'block';
      },
      cropstart: (e) => {
        // console.log(e.type, e.detail.action);
      },
      cropmove: (e) => {
        // console.log(e.type, e.detail.action);
      },
      cropend: (e) => {
        // console.log(e.type, e.detail.action);
      },
      crop: (e) => {
        var data = e.detail;
        // console.log(data)
        // console.log(e.type);
        // dataX.value = Math.round(data.x);
        // dataY.value = Math.round(data.y);
        // dataHeight.value = Math.round(data.height);
        // dataWidth.value = Math.round(data.width);
        // dataRotate.value = typeof data.rotate !== 'undefined' ? data.rotate : '';
        // dataScaleX.value = typeof data.scaleX !== 'undefined' ? data.scaleX : '';
        // dataScaleY.value = typeof data.scaleY !== 'undefined' ? data.scaleY : '';
      },
      zoom: (e) => {
      
      },
    };

    setTimeout(() => {
      
      this.cropper = new Cropper(this.image, options);
    }, 50);
  }

  ngAfterViewInit(): void {
  
    this.loadScript();
  }
}
