import {
  Component,
  OnInit,
  AfterViewInit,
  Input,
  OnChanges,
  Output,
  EventEmitter,
} from '@angular/core';
import { styles_editor } from './who-is-who-styles';

import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ReplaySubject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { DialogService } from 'src/app/dapp-components';
import { IPHOTO_STATE, IUSER_POST_BLOG } from 'src/app/shared/models';
import { convertMstoNiceString, convertMstoTimeString } from 'src/app/shared/helpers/time';



declare const ClassicEditor:any;

const myCss = styles_editor.split('<br>').join('').split('\n').join('');

@Component({
  selector: 'blog-editor',
  templateUrl: './blog-editor.component.html',
  styleUrls: ['./blog-editor.component.scss'],
})
export class BlogEditorComponent implements AfterViewInit, OnChanges {
  myEditor: any;
  imageCtrl = new FormControl(false);
  photo_state: IPHOTO_STATE = {
    available: false,
    local: false,
    download: false,
    path: '',
    src: '',
    mode: 'edit',
  };
  flags = {
    status: {
      currentSelection: 0,
      currentMeta: '',
      currentDisplay: '',
      blog: {
        0: { name: { es: 'Editando' }, meta: 'draft' },
        1: { name: { es: 'Publicado' }, meta: 'published' },
        2: { name: { es: 'Archivado' }, meta: 'archived' },
      },
      profile: {
        0: { name: { es: 'Editando' }, meta: 'draft' },
        1: { name: { es: 'Publicado' }, meta: 'published' },
      },
    },
  };
  status_List = [];
  loaded = false;
  save_ready = false;
  fireChangeContentSubject: ReplaySubject<boolean> = new ReplaySubject();
  select_status = 'leave';
  public blogForm: FormGroup = new FormGroup({
    keywords: new FormControl('', [
      Validators.required,
      Validators.maxLength(255),
    ]),
    description: new FormControl('', [
      Validators.required,
      Validators.maxLength(255),
    ]),
    status: new FormControl([{}]),
    rating_value: new FormControl(0),
    rating_nr:new FormControl(0),
    call_out: new FormControl(''),
  });
  size!: number;
  constructor(
    private dialogService: DialogService,

  ) {
    this.blogForm.valueChanges.pipe(debounceTime(200)).subscribe((val) => {
      this.blog.payload.description = this.blogForm.controls['description'].value;
      this.blog.payload.keywords = this.blogForm.controls['keywords'].value;
      if(this.blog.payload.aggregateRating !== undefined) {
        this.blog.payload.aggregateRating = {
          value: this.blogForm.controls['rating_value'].value,
          nr:this.blogForm.controls['rating_nr'].value}
      }
   
      this.calculateSize();
      this.save_ready = true;
    });

    this.fireChangeContentSubject.pipe(debounceTime(200)).subscribe((val) => {
      if (this.loaded === true) {
        const str = this.myEditor.getData();
        this.blog.payload.title = this.getTitle(str);
        this.blog.payload.content = str;
        this.calculateSize();
      }
      this.save_ready = true;
    });
  }
  @Input()
  public action!: 'new' | 'edit';
  @Input() public blog!: IUSER_POST_BLOG;
  @Output() public editorChanged: EventEmitter<boolean> = new EventEmitter();

  convertMstoNiceString = convertMstoNiceString;
  convertMstoTimeString = convertMstoTimeString;

  initStatus(status_meta:any) {
    const my_stat_filter = this.status_List.filter(
      (fil) => fil['meta'] == status_meta
    );
    let statusObject:any;
    if (my_stat_filter.length == 1) {
      statusObject = my_stat_filter[0];
      this.flags.status.currentSelection = +statusObject.key;
    } else {
      this.flags.status.currentSelection = 0;
      statusObject = my_stat_filter[0];
    }

    this.blogForm.controls['status'].setValue(statusObject);

    this.flags.status.currentDisplay = statusObject['name']['es'];
  }

  getTitle(scr: string) {
    const init = scr.indexOf('<h1>');
    const fint = scr.indexOf('</h1>');
    if (init === -1 || fint === -1) {
      return '';
    } else {
      return scr.slice(4, fint);
    }
  }

  calculateSize() {
    let all = new Blob([JSON.stringify(this.blog)]).size / 100;



    if (this.blog.payload.image.available === true) {
      const imageBlob = new Blob([this.blog.payload.image.image]).size / 100;

      const base64String = this.blog.payload.image.image;

      const stringLength =
        base64String.length - 'data:image/png;base64,'.length;

      const sizeInBytes = 4 * Math.ceil(stringLength / 3) * 0.5624896334383812;
      const sizeInKb = sizeInBytes / 1000;

      all = all - imageBlob + sizeInKb;
    }

    this.size = all;
  }

  chooseStatus(event:any) {
    const status = event.value;
    this.select_status = 'leave';
    if (+status.key == 1) {



      // if (this.blogForm.controls['description'].value.length > 255) {
      //   this.dialogService.error(
      //     'La descripción no puede extenderse más de 255 carácteres'
      //   );
      //   this.initStatus('draft');
      //   return;
      // }


      // if (this.blogForm.invalid) {
      //   this.dialogService.error(
      //     'Para publicar tienes que rellenar todos los campos'
      //   );
      //   this.initStatus('draft');
      //   return;
      // }

    //   if (this.imageCtrl.value === false) {
    //     this.dialogService.error(
    //       'Para publicar tienes que escoger una imagen de portada'
    //     );
    //     this.initStatus('draft');
    //     return;
    //   }
   }
    this.blog.status = status.meta;
    this.flags.status.currentSelection = +status.key;
    this.flags.status.currentMeta = status.meta;
    this.flags.status.currentDisplay = status['name']['es'];
  }
 
  async photoLoaded(event: { available: boolean; image: string }) {
    if (event.available === true) {
      this.imageCtrl.setValue(true);
      event.image = event.image;



    } else {
      this.imageCtrl.setValue(false);
    }
    this.blog.payload.image = event;
  }



  emitTags(event:any) {
    this.blog.payload.tags = event.tags.tags;
    this.blog.payload.category = event.category;
    this.blog = this.blog;
    this.calculateSize();
  }

  loadScript() {
    // this.scriptLoaded();
    // return

    return new Promise((resolve, reject) => {
      if (document.getElementById('editor_script') === null) {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'assets/js/ckeditor.js';
        script.id = 'editor_script';
        script.onload = () => {
          this.scriptLoaded();
          resolve({ script: name, loaded: true, status: 'Loaded' });
        };
        script.onerror = (error: any) => {
          console.log(error);
          resolve({ script: name, loaded: false, status: 'Loaded' });
        };
        document.getElementsByTagName('head')[0].appendChild(script);
      } else {
        this.scriptLoaded();
      }
    });
  }

  async scriptLoaded() {
    // const editorHTMLa = document
    // .querySelector('nx-inci-who')
    // .shadowRoot.querySelector('#editor');

    const editorHTML = document.querySelector('#editor');

    ClassicEditor.create(editorHTML, {
      // plugins: [ 'SimpleUploadAdapter' ],
      toolbar: {
        items: [
          'heading',
          '|',
          'fontFamily',
          'fontSize',
          'bold',
          'italic',
          'fontColor',
          'fontBackgroundColor',
          'link',
          'bulletedList',
          'numberedList',
          '|',
          'alignment',
          'indent',
          'outdent',
          'horizontalLine',
          '|',
          'successBox',
          'toc',
          'imageUpload',
          'blockQuote',
          'insertTable',
          'mediaEmbed',
          'undo',
          'redo',
        ],
      },
      simpleUpload: {
        // The URL that the images are uploaded to.
        uploadUrl:
          'https://us-central1-my-inci.cloudfunctions.net/HandleImageFunction',

        // Enable the XMLHttpRequest.withCredentials property.
        withCredentials: false,

        // Headers sent along with the XMLHttpRequest to the upload server.
        headers: {
          'X-CSRF-TOKEN': 'CSRF-Token',
         // Authorization: 'Bearer ' + this.authService.token,
        },
      },
      language: 'es',
      image: {
        toolbar: ['imageTextAlternative', 'imageStyle:full', 'imageStyle:side'],
      },
      table: {
        contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells'],
      },
      licenseKey: '',
    })
      .then((editor:any) => {
        this.myEditor = editor;

        this.myEditor.setData(this.blog.payload.content);
        this.blogForm.controls['description'].setValue(
          this.blog.payload.description
        );

        if(this.blog.payload.aggregateRating !== undefined) {
          this.blogForm.controls['rating_value'].setValue(this.blog.payload.aggregateRating.value);
          this.blogForm.controls['rating_nr'].setValue(this.blog.payload.aggregateRating.nr);
        }

 

        this.blogForm.controls['keywords'].setValue(this.blog.payload.keywords);
        this.calculateSize();
        // this.status_List = converterObjectToArray(
        //   this.flags.status[this.blog.type]
        // );
        this.initStatus(this.blog.status);

        if (this.blog.payload.image.available === true) {
          this.photo_state = {
            available: true,
            local: false,
            download: false,
            path: `members/${this.blog.uid}/blogs/${this.blog.id}.png`,
            src: this.blog.payload.image.image,
            mode: 'edit',
          };
          this.imageCtrl.setValue(true)
        } else {
            this.photo_state = {
              available: false,
              local: false,
              download: false,
              path: `members/${this.blog.uid}/blogs/${this.blog.id}.png`,
              src: '',
              mode: 'edit',
            };
        }

        this.loaded = true;
       // this.stateService.routeLoading.next(false);

        this.myEditor.model.document.on('change', () => {
          this.fireChangeContentSubject.next(true);
        });
      })
      .catch((error:any) => {
       // this.stateService.routeLoading.next(false);
        console.error(error);
      });
  }

  ngAfterViewInit(): void {
    if (document.getElementById('editor_css') === null) {
      const style = document.createElement('style');
      document.getElementsByTagName('head')[0].appendChild(style);
      style.id = 'editor_css';

      style.innerText = myCss;
    }
    this.loadScript();
  }

  ngOnChanges() {}
}
