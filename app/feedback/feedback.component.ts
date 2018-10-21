import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Feedback, FeedbackResponse } from '../feedback';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {Location} from '@angular/common';
import { ModalService } from '../modal.service';
import {HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit {
  @ViewChild('feedbackContent', {read: TemplateRef}) feedbackContent: TemplateRef<any>;
  private modalRef: NgbModalRef;
  feedbackID: Feedback;
	
  constructor(private http: HttpClient, private modalService: NgbModal,private location : Location, private modal: ModalService) { 
  		modal.FeedbackModal.subscribe((val)=>{
			if(val instanceof String)
			{
				this.feedback(val.toString());
			}
			else
			{
				this.feedbackID = val;
				this.modalRef = this.modalService.open(this.feedbackContent);
			}
		});
  }

  ngOnInit() {
  }
	
	feedback(id) {	
	this.http.get<FeedbackResponse>('http://kekszallas.uw.hu/php/search.php?feedback='+ id).subscribe(resp => {
			this.feedbackID = resp.feedback[0];
		   	if (this.modalRef != null || this.modalRef != undefined)
			{
				this.modalRef.close();
			}
		    this.modalRef = this.modalService.open(this.feedbackContent);
			location.assign('/index.html#/feedback/' + id);
	});
	}
	
	newfeedback() {	
		    this.modalRef.close();
		    this.modal.NewFeedbackModal.next(this.feedbackID);
	}
	
	open(id) {	
			this.modalRef.close();
		    this.modal.PinModal.next(new String(id));
	}

}
