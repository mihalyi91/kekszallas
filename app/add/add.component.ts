import { Component, OnInit, Input, NgZone, ViewChild, TemplateRef, OnDestroy } from '@angular/core';
import { Pin } from '../pin';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {debounceTime} from 'rxjs/operator/debounceTime';
import {Subject} from 'rxjs/Subject';
import { ModalService } from '../modal.service';
import {UtilsService} from '../utils.service';
import { Subscription } from 'rxjs';
import { HttpService } from '../http.service';
import { Accommodation } from '../accommodation';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnDestroy {
  @Input() pins: Pin[];
  @ViewChild('addcontent', {read: TemplateRef}) addcontent: TemplateRef<any>;

  private modalRef: NgbModalRef;
  private acc: Accommodation;

  otp: boolean;
  mkb: boolean;
  kh: boolean;

  nameError: boolean;
  nameErrorMessage: string;
  addressError: boolean;
  phoneError: boolean;
  urlError: boolean;
  isCoordinate = false;

  successMessage: string;
  private _success = new Subject<string>();

  subscription: Subscription;

  constructor(private http: HttpService,
            private zone: NgZone,
            private modalService: NgbModal,
            modal: ModalService,
            private utils: UtilsService) {
    this.subscription =  this._success.subscribe((message) => this.successMessage = message);
    const lateCall = debounceTime.call(this._success, 5000).subscribe(() => this.successMessage = null);
    this.subscription.add(lateCall);

    const modalSubscription = modal.AddModal.subscribe((val) => {
     if (val === 'open') {
      this.modalRef = this.modalService.open(this.addcontent);
     }
    });

    this.subscription.add(modalSubscription);

    this.acc = new Accommodation(undefined, undefined, undefined, undefined, undefined, undefined,
         undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined);
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    select(value) {
        this.acc.trail = value;
    }

    add() {
    this.nameError = this.acc.name === '' || this.acc.name === undefined;
    this.addressError = this.acc.address === '' || this.acc.address === undefined;
    const phoneRegex = new RegExp('^[\+]?[0]{0,2}[36]?[06]?[\/ (-]?[0-9]{2}[)]?[\/ \.-]?[0-9]{3}[ \.-]?[0-9]{3,4}$');
    this.phoneError = this.acc.phone === '' || this.acc.phone === undefined || !phoneRegex.test(this.acc.phone.trim());
    this.nameErrorMessage = 'Ez a mező kötelező!';
    this.urlError = (this.acc.web !== '' && this.acc.web !== undefined ) && !new RegExp('^http').test(this.acc.web);

    if (!this.nameError && !this.addressError && !this.phoneError && !this.urlError) {
        this.acc.voucherCard = this.utils.VoucherCardStringGenerator(this.otp, this.mkb, this.kh);

        const httpSubscriptions = this.http.AddAccomodation(this.acc, this.isCoordinate);
        const errorSubscription = httpSubscriptions['error'].subscribe(x => {
            this.zone.run(() => {
                this.nameError = true;
                this.nameErrorMessage = x;
            });
        });

        const successSubscription = httpSubscriptions['success'].subscribe(x => {
            this.pins.push(new Pin(x, Number(this.acc.lng), Number(this.acc.lat)));
            this.acc = new Accommodation(undefined, undefined, undefined, undefined, undefined, undefined,
                undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined);
            this.otp = this.mkb = this.kh = false;
            this._success.next('Siker');
            this.modalRef.close();
        });

        this.subscription.add(errorSubscription);
        this.subscription.add(successSubscription);
    }
    }
}
