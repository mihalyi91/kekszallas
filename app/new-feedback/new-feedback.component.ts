import { Component, OnInit, TemplateRef, ViewChild, OnDestroy } from '@angular/core';
import { ModalService } from '../modal.service';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import { Feedback, FeedbackEntry } from '../feedback';
import { Subscription } from 'rxjs';
import { HttpService } from '../http.service';
import { Router } from '@angular/router';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap/datepicker/ngb-date';
import { UtilsService } from '../utils.service';

@Component({
  selector: 'app-new-feedback',
  templateUrl: './new-feedback.component.html',
  styleUrls: ['./new-feedback.component.css']
})
export class NewFeedbackComponent implements OnInit, OnDestroy {
@ViewChild('newFeedbackContent', {read: TemplateRef}) newFeedbackContent: TemplateRef<any>;

  feedbackID: Feedback;

  name: string;
  feedbackText: string;
  feedbackType: string;
  visitDate: NgbDate;

  nameError: boolean;
  feedbackTextError: boolean;
  feedbackTypeError: boolean;

    private modalRef: NgbModalRef;

    subscription: Subscription;

  constructor(private http: HttpService, private modalService: NgbModal,
    private modal: ModalService, private router: Router, private utils: UtilsService) {
    this.subscription = this.modal.NewFeedbackModal.subscribe((val) => {
    this.feedbackID = val;
    this.modalRef = this.modalService.open(this.newFeedbackContent);
    });
  }

    back() {
        this.modalRef.close();
        this.router.navigate(['/velemeny', this.feedbackID.id]);
    }

    ngOnInit() {
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

      newFeedbackSend() {
        this.nameError = this.name === '' || this.name === undefined;
        this.feedbackTextError = this.feedbackText === '' || this.feedbackText === undefined;
        this.feedbackTypeError = this.feedbackType === '' || this.feedbackType === undefined;

        if (!this.nameError && !this.feedbackTextError && !this.feedbackTypeError) {

            const httpSubscription = this.http
            .AddFeedback(this.feedbackID.id, this.name, this.feedbackText, this.feedbackType, this.utils.NgbDateConverter(this.visitDate))
            .subscribe(x => {
                    const timeNow = new Date().toLocaleDateString().toString();
                    const feedbackEntry = new FeedbackEntry(this.feedbackText, Number(this.feedbackType),
                                               this.name, timeNow, this.utils.NgbDateConverter(this.visitDate));
                    this.feedbackID.feedbacks.push(feedbackEntry);
                    this.name = this.feedbackText = this.feedbackType = this.visitDate = undefined;
                    this.back();
                });
            this.subscription.add(httpSubscription);
        }
    }
}
