import { Component, OnInit, Input, ViewChild, TemplateRef } from '@angular/core';
import { Pin } from '../pin';
import { ModalService } from '../modal.service';
import { Accommodation, AccommodationResponse } from '../accommodation';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {HttpClient, HttpHeaders } from '@angular/common/http';
import {Location, LocationStrategy} from '@angular/common';

@Component({
  selector: 'app-pin',
  templateUrl: './pin.component.html',
  styleUrls: ['./pin.component.css']
})
export class PinComponent implements OnInit {
    @ViewChild('pinContent', {read: TemplateRef}) pinContent: TemplateRef<any>;
	
   accID: Accommodation;
	
   private modalRef: NgbModalRef;
	
  constructor(private http: HttpClient, private modal: ModalService, private modalService: NgbModal, private location : Location)
  { 
	modal.PinModal.subscribe((val)=>{
	  if(val instanceof String)
	  {
		this.open(val.toString());
	  }
	  else
	  {
		this.accID = val;
		this.modalRef = this.modalService.open(this.pinContent);	  
	  }
	});  
  }

  ngOnInit() {
  }

	open(id) {
	this.http.get<AccommodationResponse>('http://kekszallas.uw.hu/php/search.php?id='+ id).subscribe(resp => {
			this.accID = resp.accommodation;
			if (this.modalRef != null || this.modalRef != undefined)
			{
				this.modalRef.close();
			}
			this.modalRef = this.modalService.open(this.pinContent);
			location.assign('/index.html#/szallas/' + id);
	});
	}
	
	edit(content) {
			this.modalRef.close();
			this.modal.EditModal.next(this.accID);
	}
	
	
	feedback() {	
		    this.modalRef.close();
		    this.modal.FeedbackModal.next(new String(this.accID.id));
	}
}
