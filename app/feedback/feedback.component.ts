import { Component, OnInit, ViewChild, TemplateRef, OnDestroy } from '@angular/core';
import { Feedback } from '../feedback';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from '../modal.service';
import { Subscription } from 'rxjs';
import { HttpService } from '../http.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit, OnDestroy {
  @ViewChild('feedbackContent', {read: TemplateRef}) feedbackContent: TemplateRef<any>;
  private modalRef: NgbModalRef;
  feedbackID: Feedback;

  subscription: Subscription;

  constructor(private http: HttpService, private modalService: NgbModal,
     private router: Router, private modal: ModalService, private route: ActivatedRoute) {}

  ngOnInit() {
    const subscription = this.route.paramMap.pipe()
    .subscribe(x => this.feedback(x.get('id')));
    this.subscription.add(subscription);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
 }
    feedback(id) {
        this.subscription = this.http.GetFeedbackByID(id)
        .subscribe(resp => {
                this.feedbackID = resp;
                if (this.modalRef != null || this.modalRef !== undefined) {
                    this.modalRef.close();
                }
                this.modalRef = this.modalService.open(this.feedbackContent);
        });
    }

    newfeedback() {
            this.router.navigate(['/velemeny/szerkesztes', this.feedbackID.id]);
            this.modalRef.close();
            this.modal.NewFeedbackModal.next(this.feedbackID);
    }

    open(id) {
            this.modalRef.close();
            this.router.navigate(['/szallas', id]);
    }

}
