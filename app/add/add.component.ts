import { Component, OnInit, Input, NgZone, ViewChild, TemplateRef } from '@angular/core';
import { Pin, PinsResponse } from '../pin';
import {HttpClient, HttpHeaders } from '@angular/common/http';
import { Status, StatusResponse } from '../nav/status';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {debounceTime} from 'rxjs/operator/debounceTime';
import {Subject} from 'rxjs/Subject';
import { ModalService } from '../modal.service';

declare var google: any;

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {
  @Input() pins: Pin[];
  @ViewChild('addcontent', {read: TemplateRef}) addcontent: TemplateRef<any>;
	
  private modalRef: NgbModalRef;

  name: string;
  address: string;  
  website: string; 
  phone: string;
  mail: string;
  price: number;
  trail: string;
  otp: boolean;
  mkb: boolean;
  kh: boolean;
  
  nameError: boolean;
  nameErrorMessage: string;
  addressError: boolean;
  phoneError: boolean;
  urlError: boolean;
  
  successMessage: string;
  private _success = new Subject<string>();
  
  constructor(private http: HttpClient, private zone:NgZone, private modalService: NgbModal, modal: ModalService) 
  { 
  	this._success.subscribe((message) => this.successMessage = message);
	debounceTime.call(this._success, 5000).subscribe(() => this.successMessage = null);
	
	modal.AddModal.subscribe((val)=>{
	 if(val === 'open') {
	  this.modalRef = this.modalService.open(this.addcontent);
	 }
	});
  }

  ngOnInit() {
  }

  select(value)
  {
	this.trail = value;
  }
  
  SzepKartyaStringGenerator() : string
  {
	return (this.otp ? "1" : "0") + "|" + (this.mkb ? "1" : "0") + "|" + (this.kh ? "1" : "0");
  }
  
    add(content) {
	this.nameError = this.name == "" || this.name == undefined;
	this.addressError = this.address == "" || this.address == undefined;
	this.phoneError = this.phone == "" || this.phone == undefined || !new RegExp('^[\+]?[0]{0,2}[36]?[06]?[\/ (-]?[0-9]{2}[)]?[\/ \.-]?[0-9]{3}[ \.-]?[0-9]{3,4}$').test(this.phone.trim());
	this.nameErrorMessage = "Ez a mező kötelező!";
	this.urlError = (this.website != "" && this.website != undefined ) && !new RegExp('^http').test(this.website);
	
	if(!this.nameError && !this.addressError && !this.phoneError && !this.urlError)	
	{
		 var geocoder = new google.maps.Geocoder();
	     var latitude = "";
		 var longitude = "";
		 geocoder.geocode({ 'address': this.address }, (results, status) => {
		   if(results.length > 0)
		   {
			   latitude = results[0].geometry.location.lat();
			   longitude = results[0].geometry.location.lng();
			   
			    const body = new URLSearchParams();
				body.set('name', this.name);
				body.set('phone', this.phone.trim());
				body.set('address', this.address);
				body.set('lat', latitude);
				body.set('lng', longitude);
				body.set('price', this.price == undefined ? "0" : this.price.toString());
				body.set('web', this.website);
				body.set('mail', this.mail == undefined ? this.mail : this.mail.trim());
				body.set('tura', this.trail);
				body.set('szepKartya', this.SzepKartyaStringGenerator());
				
				let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded; charset=utf-8');
				this.http.post<StatusResponse>('http://kekszallas.uw.hu/php/search.php', body.toString(), {
				  headers: headers
				}).subscribe(x => 
				{
				 if (x.result[0].status == 'error')
				 {
					this.zone.run(() => {
						this.nameError = true;
						this.nameErrorMessage = x.result[0].message;
					});
				 }
				 else
				 {
					this.name = this.phone = this.address = this.website = this.mail = this.price = undefined;
					this.otp = this.mkb = this.kh = false;
					this._success.next("blabla");
					this.modalRef.close();
					this.pins.push(new Pin(x.result[0].message, longitude, latitude));
				 } 		
				});
				
				
		   }
		});
	}
  
  }
}
