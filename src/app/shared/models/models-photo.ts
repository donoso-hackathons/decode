
export enum PHOTO_STATUS {
    NONE,
    SELECTED,
    UPLOADING,
    UPLOADED,
    DOWNLOADING,
    DOWNLOADED
  }
  
  // Still,
  //   Downloading,
  //   Download,
  //   Selecting,
  //   Selected,
  //   Uploading,
  //   Uploaded
  
  export interface ICROPP_DIM {
    width:number,
    height:number;
  }


  export enum CROPP_DIMENSIONS {
    POST = 'post',
    PROFILE = 'profile'
  }


  export class ImageSnippet {
    pending = false;
    constructor(public src: string, public file?: File) {}
  }
  
  export interface IPHOTO_STATE { 
    available: boolean,
    src:string,
    path:string,
    local: boolean,
    download: boolean,
    mode: 'edit' | 'display'
  }