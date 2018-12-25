import { Component, ViewChild, TemplateRef, NgZone, OnDestroy, Input } from '@angular/core';
import { Accommodation } from '../accommodation';
import { ModalService } from '../modal.service';
import { UtilsService } from '../utils.service';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { Pin } from '../pin';
import { HttpService } from '../http.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnDestroy {
  @Input() pins: Pin[];
  @ViewChild('editContent', {read: TemplateRef}) editContent: TemplateRef<any>;

  name: string;
  isCoordinate = false;
  otp: boolean;
  mkb: boolean;
  kh: boolean;

  nameError: boolean;
  accNameError: boolean;
  addressError: boolean;
  phoneError: boolean;
  nameErrorMessage: string;

  accID: Accommodation;
  newAcc: Accommodation;
  private modalRef: NgbModalRef;

  subscription: Subscription;

  constructor(private zone: NgZone,
         private http: HttpService,
         private modalService: NgbModal,
         private modal: ModalService,
         private utils: UtilsService,
         private router: Router) {
    this.subscription = this.modal.EditModal.subscribe((val) => {

    this.modalRef = this.modalService.open(this.editContent);

      this.accID = val;
      this.newAcc = Object.create(val);
      const splitted = val.voucherCard.split('|');
      this.otp = splitted[0] === '1';
      this.mkb = splitted[1] === '1';
      this.kh = splitted[2] === '1';
      this.isCoordinate = false;

      this.accNameError = false;
      this.addressError = false;
      this.nameError = false;
      this.phoneError = false;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
   }

  select(value) {
     this.newAcc.trail = value;
  }

  back() {
    this.modalRef.close();
    this.router.navigate(['/szallas', this.accID.id]);
  }

  pinSelection() {
    this.modalRef.close();
    const selectionSubscription = this.modal.PinSelection.subscribe((val) => {
        selectionSubscription.unsubscribe();
        this.modalRef = this.modalService.open(this.editContent);
        this.isCoordinate = true;
        this.newAcc.lat = val.lat;
        this.newAcc.lng = val.lng;
    });
  }

    send() {
        this.accNameError = this.newAcc.name === '' || this.newAcc.name === undefined;
        const phoneRegex = new RegExp('^[\+]?[0]{0,2}[36]?[06]?[\/ (-]?[0-9]{2}[)]?[\/ \.-]?[0-9]{3}[ \.-]?[0-9]{3,4}$');
        this.phoneError = this.newAcc.phone === '' || this.newAcc.phone === undefined || !phoneRegex.test(this.newAcc.phone.trim());
        if (this.isCoordinate) {
            this.addressError = (this.newAcc.lat === 0 || this.newAcc.lat === undefined)
             || (this.newAcc.lng === 0 || this.newAcc.lng === undefined);
        } else {
            this.addressError = (this.newAcc.address === '' || this.newAcc.address === undefined);
        }
        this.nameError = (this.name === '' || this.name === undefined) && this.utils.IsNameRequested(this.accID, this.newAcc);
        this.nameErrorMessage = 'Ez a mező kötelező!';

        if (!this.accNameError && !this.addressError && !this.nameError && !this.phoneError ) {
            this.newAcc.voucherCard = this.utils.VoucherCardStringGenerator(this.otp, this.mkb, this.kh);

            const httpSubscriptions = this.http.EditAccomodation(this.accID, this.newAcc, this.isCoordinate, this.name);
            const errorSubscription = httpSubscriptions['error'].subscribe(x => {
                    this.zone.run(() => {
                        this.accNameError = true;
                        this.nameErrorMessage = x;
                    });
                });

            const successSubscription = httpSubscriptions['success'].subscribe(x => {
                this.modalRef.close();
                const pin = this.pins.filter(item => item.id.toString() === x.id).pop();
                pin.lat = x.lat;
                pin.lng = x.lng;
                this.router.navigate(['/szallas', { id: x.id }]);
            });

            this.subscription.add(errorSubscription);
            this.subscription.add(successSubscription);
        }
    }
}
