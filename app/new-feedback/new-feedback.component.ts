import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Status, StatusResponse } from '../nav/status';
import {HttpClient, HttpHeaders } from '@angular/common/http';
import { ModalService } from '../modal.service';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import { Feedback, FeedbackEntry } from '../feedback';

@Component({
  selector: 'app-new-feedback',
  templateUrl: './new-feedback.component.html',
  styleUrls: ['./new-feedback.component.css']
})
export class NewFeedbackComponent implements OnInit {
@ViewChild('newFeedbackContent', {read: TemplateRef}) newFeedbackContent: TemplateRef<any>;

  feedbackID: Feedback;

  name: string;
  feedbackText: string;  
  feedbackType: string; 
  
  nameError: boolean;
  feedbackTextError: boolean;
  feedbackTypeError: boolean;
  
    private modalRef: NgbModalRef;
  
  constructor(private http: HttpClient, private modalService: NgbModal,private modal: ModalService) 
  { 
  	this.modal.NewFeedbackModal.subscribe((val)=>{
	  this.feedbackID = val;
	  this.modalRef = this.modalService.open(this.newFeedbackContent);
	});
  }
  
  back()
  {
  	this.modalRef.close();
	this.modal.FeedbackModal.next(this.feedbackID);
  }
  
  ngOnInit() {
  }

  	newFeedbackSend(content, id){
		this.nameError = this.name == "" || this.name == undefined;
		this.feedbackTextError = this.feedbackText == "" || this.feedbackText == undefined;
		this.feedbackTypeError = this.feedbackType == "" || this.feedbackType == undefined;
		
		if(!this.nameError && !this.feedbackTextError && !this.feedbackTypeError)	
		{
			const body = new URLSearchParams();
			body.set('name', this.name);
			body.set('feedbackText', this.feedbackText);
			body.set('feedbackType', this.feedbackType);
			body.set('id', id);

			let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded; charset=utf-8');
			this.http.post<StatusResponse>('http://kekszallas.uw.hu/php/search.php', body.toString(), {
			  headers: headers
			}).subscribe(x => 
				{
				 if (x.result[0].status == 'error')
				 {
					//shall never happend
				 }
				 else
				 {
					this.feedbackID.feedbacks.push(new FeedbackEntry(this.feedbackText, Number(this.feedbackType), this.name, new Date().toLocaleDateString().toString()));
					this.name = this.feedbackText = this.feedbackType = undefined;
					this.back();
				 } 		
				});
		}
	}
}
