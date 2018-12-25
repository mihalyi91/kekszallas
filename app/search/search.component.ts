import { Component, Input, TemplateRef, ViewChild, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Pin } from '../pin';
import { Settings } from '../settings';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from '../modal.service';
import { Subscription } from 'rxjs';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnDestroy {
    @Input() pins: Pin[];
    @Input() settings: Settings;
    @Output() newPins = new EventEmitter<Pin[]>();
    @ViewChild('searchContent', {read: TemplateRef}) searchContent: TemplateRef<any>;

  private modalRef: NgbModalRef;
  minPrice: number;
  maxPrice: number;
  otp: boolean;
  mkb: boolean;
  kh: boolean;
  hasFeedback: boolean;

  subscription: Subscription;

  constructor(private modalService: NgbModal, private http: HttpService, modal: ModalService) {
      this.subscription = modal.SearchModal.subscribe((val) => {
         if (val === 'open') {
          this.modalRef = this.modalService.open(this.searchContent);
         }
       });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  search() {
    const httpSubscription = this.http.SearchPin(this.minPrice, this.maxPrice, this.settings, this.otp, this.mkb, this.kh, this.hasFeedback)
    .subscribe(resp => {
      this.newPins.emit(resp);
    });
    this.subscription.add(httpSubscription);
    this.modalRef.close();
  }
}
