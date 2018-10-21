import { Component, OnInit, Input, TemplateRef, ViewChild } from '@angular/core';
import { Pin, PinsResponse } from '../pin';
import { Settings } from '../settings';
import {HttpClient, HttpHeaders } from '@angular/common/http';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from '../modal.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
	@Input() pins: Pin[];
	@Input() settings: Settings;

	@ViewChild('searchContent', {read: TemplateRef}) searchContent: TemplateRef<any>;
	
  private modalRef: NgbModalRef;
  minAr: number;
  maxAr: number;
  otp: boolean;
  mkb: boolean;
  kh: boolean;
  
  constructor(private modalService: NgbModal, private http: HttpClient, modal: ModalService) 
  { 
	  modal.SearchModal.subscribe((val)=>{
		 if(val === 'open') {
		  this.modalRef = this.modalService.open(this.searchContent);
		 }
	   });
  }

  ngOnInit() {
  }

    search(content) {
	this.pins.splice(0,this.pins.length);
	this.http.get<PinsResponse>(
	'http://kekszallas.uw.hu/php/search.php?min=' + this.minAr + "&max=" + this.maxAr + "&ak=" + this.settings.showAK + "&okt=" + this.settings.showOKT + "&ddk=" + this.settings.showDDK + "&otp=" + this.otp + "&mkb=" + this.mkb + "&kh=" + this.kh
	).subscribe(resp => {
		for (var pin in resp.coordinates) {
		   this.pins.push(resp.coordinates[pin]);
		} 
	});
	this.modalRef.close();
	}
  
}
