import { Injectable } from '@angular/core';



import Swal from 'sweetalert2';
import { AlertServiceCommon } from './alerts.common';

@Injectable({
  providedIn: 'root'
})
export class AlertService implements AlertServiceCommon {
  constructor() {}

  async showAlertERROR(myTitle: string, message: string): Promise<boolean> {
    return new Promise(resolve => {
      Swal.fire({
        title: myTitle,
        text: message,
        icon: 'error',
        showClass: {
          popup: 'animate__animated animate__zoomInDown'
        },
        hideClass: {
          popup: 'animate__animated animate__zoomOut'
        },
        confirmButtonText: 'OK'
      })
        .then(x => resolve(false))
        .catch(x => resolve(false));
    });
  }

  async showAlertConfirm(myTitle: string, message: string): Promise<boolean> {
    return new Promise(resolve => {
      Swal.fire({
        title: myTitle,
        text: message,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si!',
        cancelButtonText: 'Cancelar',
        showClass: {
          popup: 'animate__animated animate__zoomInDown'
        },
        hideClass: {
          popup: 'animate__animated animate__zoomOut'
        },
      }).then(result => {
        if (result.value) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }

  async showAlertOK(myTitle: string, message: string): Promise<boolean> {
    return new Promise(resolve => {
      Swal.fire({
        title: myTitle,
        text: message,
        icon: 'success',
        confirmButtonText: 'OK',
        showClass: {
          popup: 'animate__animated animate__zoomInDown'
        },
        hideClass: {
          popup: 'animate__animated animate__zoomOut'
        },
      }).then(result => {
        if (result.value) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }


  
}
