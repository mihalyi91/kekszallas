import { Injectable } from '@angular/core';
import { Accommodation } from './accommodation';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap/datepicker/ngb-date';

@Injectable()
export class UtilsService {

  VoucherCardStringGenerator(otp: boolean, mkb: boolean, kh: boolean): string {
    return `${otp ? '1' : '0'}|${mkb ? '1' : '0'}|${kh ? '1' : '0'}`;
  }

  NgbDateConverter(date: NgbDate): string {
    return `${date.year}-${date.month}-${date.day}`;
  }

  IsNameRequested(oldAcc: Accommodation, newAcc: Accommodation): boolean {
    return newAcc.phone !== oldAcc.phone
        || newAcc.price  !== oldAcc.price
        || newAcc.address  !== oldAcc.address
        || newAcc.lng !== oldAcc.lng
        || newAcc.lat !== oldAcc.lat
        || newAcc.voucherCard !== oldAcc.voucherCard;
  }
  constructor() { }
}
