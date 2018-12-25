import { Component, OnInit, ViewChild, TemplateRef, OnDestroy } from '@angular/core';
import { ModalService } from '../modal.service';
import { Accommodation } from '../accommodation';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { HttpService } from '../http.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-pin',
  templateUrl: './pin.component.html',
  styleUrls: ['./pin.component.css']
})
export class PinComponent implements OnInit, OnDestroy {
    @ViewChild('pinContent', {read: TemplateRef}) pinContent: TemplateRef<any>;

   accID: Accommodation;

   private modalRef: NgbModalRef;
   subscription: Subscription;

  constructor(private route: ActivatedRoute, private router: Router,
     private http: HttpService, private modal: ModalService, private modalService: NgbModal) {
  }

  ngOnInit() {
    const subscription = this.route.paramMap.pipe()
     .subscribe(x => this.open(x.get('id')));
     this.subscription.add(subscription);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    }

    open(id) {
      this.subscription = this.http.GetAccommodationByID(id)
      .subscribe(resp => {
              this.accID = resp;
              if (this.modalRef != null || this.modalRef !== undefined) {
                  this.modalRef.close();
              }
              this.modalRef = this.modalService.open(this.pinContent);
      });
    }

    edit() {
            this.router.navigate(['/szerkesztes', this.accID.id]);
            this.modalRef.close();
            this.modal.EditModal.next(this.accID);
    }

    feedback() {
            this.modalRef.close();
            this.router.navigate(['/velemeny', this.accID.id]);
    }

    close() {
        this.modalRef.close();
        this.router.navigate(['/fooldal']);
     }
}
