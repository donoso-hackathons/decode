


export interface AlertServiceCommon {

 showAlertERROR(myTitle: string, message: string): Promise<boolean>;

 showAlertConfirm(myTitle: string, message: string): Promise<boolean>;

 showAlertOK(myTitle: string, message: string): Promise<boolean>;

}
