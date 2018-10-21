import { Component, OnInit, ViewChild, TemplateRef, NgZone } from '@angular/core';
import {HttpClient, HttpHeaders } from '@angular/common/http';
import { Status, EditResponse } from '../nav/status';
import { Accommodation } from '../accommodation';
import { ModalService } from '../modal.service';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';

declare var google: any;

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  @ViewChild('editContent', {read: TemplateRef}) editContent: TemplateRef<any>;
  
  name: string;
  accName: string;
  address: string;
  lat: number;
  lng: number;
  trail: string;
  price: number;
  isCoordinate:boolean = false;
  otp: boolean;
  mkb: boolean;
  kh: boolean;
  
  nameError: boolean;
  accNameError: boolean;
  addressError:boolean;
  nameErrorMessage: string;
  
  accID: Accommodation;
  private modalRef: NgbModalRef;
  
  constructor(private zone:NgZone, private http: HttpClient, private modalService: NgbModal,private modal: ModalService) {
	this.modal.EditModal.subscribe((val)=>{
	
	this.modalRef = this.modalService.open(this.editContent);
	
	  this.accID = val;
	  this.trail = val.trail;
	  this.address = val.address;
	  this.accName = val.name;
	  this.lat = val.lat;
	  this.lng = val.lng;
	  this.price = Number(val.price);
	  var splitted = val.szepKartya.split("|");
	  this.otp = splitted[0] == "1";
	  this.mkb = splitted[1] == "1";
	  this.kh = splitted[2] == "1";
	  this.isCoordinate = false;
	  
	  this.accNameError = false
	  this.addressError = false
	  this.nameError = false
	  
	  
	});
  }

  ngOnInit() {
  }

  select(value)
  {
	 this.trail = value;
  }
  
  back()
  {
  	this.modalRef.close();
	this.modal.PinModal.next(this.accID);
  }
  SzepKartyaStringGenerator() : string
  {
	return (this.otp ? "1" : "0") + "|" + (this.mkb ? "1" : "0") + "|" + (this.kh ? "1" : "0");
  }
  
  IsNameRequested() : boolean
  {
	return this.accName != this.accID.name || this.price != Number(this.accID.price) || this.address != this.accID.address || this.lng != this.accID.lng || this.lat != this.accID.lat || this.SzepKartyaStringGenerator() != this.accID.szepKartya;
  }
	send()
	{
		this.accNameError = this.accName == "" || this.accName == undefined;
		this.addressError = this.isCoordinate ? ((this.lat == 0 || this.lat == undefined) || (this.lng == 0 || this.lng == undefined)) : (this.address == "" || this.address == undefined);
		this.nameError = (this.name == "" || this.name == undefined) && this.IsNameRequested()
		this.nameErrorMessage = "Ez a mező kötelező!";
		
		if(!this.accNameError && !this.addressError && !this.nameError)
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
			body.set('id', this.accID.id.toString());
			body.set('trail', this.trail);
			if(this.IsNameRequested())
			{
				body.set('userName', this.name);
			}
			if(this.accName != this.accID.name)
			{
				body.set('name', this.accName);
			}
			if(this.price != Number(this.accID.price))
			{
				body.set('price', this.price.toString());
			}
			if(!this.isCoordinate && this.address != this.accID.address)
			{
				body.set('address', this.address);
				body.set('lat', latitude);
				body.set('lng', longitude);
			}
			if(this.isCoordinate && (this.lng != this.accID.lng || this.lat != this.accID.lat))
			{
				body.set('address', this.lat + ", " + this.lng);
				body.set('lat', this.lat.toString());
				body.set('lng', this.lng.toString());
			}
			if(this.SzepKartyaStringGenerator() != this.accID.szepKartya)
			{
				body.set('szepKartya', this.SzepKartyaStringGenerator());
			}
			let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded; charset=utf-8');
			this.http.post<EditResponse>('http://kekszallas.uw.hu/php/search.php', body.toString(), {
			headers: headers
			}).subscribe(x => 
				{
				if (x.result[0].status == 'error')
				{
					this.zone.run(() => {
						this.accNameError = true;
						this.nameErrorMessage = x.result[0].message;
					});
				}
				else
				{
					this.modalRef.close();
					this.modal.PinModal.next(x.accommodation);
				} 		
				});
				
		   }
		});
		}
	
	}
  
}
