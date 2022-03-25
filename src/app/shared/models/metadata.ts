interface MetadataMedia {
    item: string;
    /**
     * This is the mime type of media
     */
    type: string
  }
  
 export enum MetadataVersions {
    one = '1.0.0',
  }
  
  enum MetadataDisplayType {
    number = 'number',
    string = 'string',
    date = 'date',
  }
  
  interface MetadataAttribute {
    displayType?: MetadataDisplayType;
    traitType?: string;
    value: string;
  }
  
  export interface IMetadata_ERC721 {
    /**
     * The metadata version.
     */
    version: MetadataVersions;
  
     /**
     * The metadata lens_id can be anything but if your uploading to ipfs
     * you will want it to be random.. using uuid could be an option!
     */
    metadata_id: string;
  
    /**
     * A human-readable description of the item.
     */
    description?: string;
  
    /**
     * The content of a publication. If this is blank `media` must be defined or its out of spec.
     */
    content?: string;
  
    /**
     * This is the URL that will appear below the asset's image on OpenSea and others etc
     * and will allow users to leave OpenSea and view the item on the site.
     */
    external_url?: string;
  
    /**
     * Name of the item.
     */
    name: string;
  
    /**
     * These are the attributes for the item, which will show up on the OpenSea and others NFT trading websites on the 
    item.
     */
    attributes: MetadataAttribute[];
  
    /**
     * legacy to support OpenSea will store any NFT image here.
     */
    image?: string;
  
    /**
     * This is the mime type of image. This is used if you uploading more advanced cover images
     * as sometimes IPFS does not emit the content header so this solves the pr
     */
    imageMimeType?: MimeType;
  
    /**
     * This is lens supported attached media items to the publication
     */
    media?: MetadataMedia[];
  
    /**
     * Legacy for OpenSea and other providers
     * A URL to a multi-media attachment for the item. The file extensions GLTF, GLB, WEBM, MP4, M4V, OGV,
     * and OGG are supported, along with the audio-only extensions MP3, WAV, and OGA.
     * Animation_url also supports HTML pages, allowing you to build rich experiences and interactive NFTs using JavaScript canvas,
     * WebGL, and more. Scripts and relative paths within the HTML page are now supported. However, access to browser extensions is not supported.
  
     */
    animation_url?: string;
  
    /**
     * This is the appId the content belongs to
     */
    appId?: string;
  }