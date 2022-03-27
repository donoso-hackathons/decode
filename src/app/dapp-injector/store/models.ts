export interface Web3State {
    chainStatus: NETWORK_STATUS;
    isNetworkBusy:boolean;
    signerNetwork:string;
    walletBalance:number;
    etherToDollar:number; 
    readingContract:boolean;
  }

  export type NETWORK_STATUS = 'loading' 
  | 'fail' 
  | 'wallet-not-connected'
  | 'lens-profile-not-found' 
  | 'lens-profile-not-dececode'
  | 'lens-profiles-found'
  | 'success' 
  | 'disconnected';