import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpHeaders } from '@angular/common/http';
import { Pin, PinsResponse } from './pin';
import { Settings } from './settings';
import { Status } from './nav/status';
import {Location} from '@angular/common';
import { ModalService } from './modal.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})


export class AppComponent implements OnInit {
  lat: number = 47.49801;
  lng: number = 19.03991;
  public pins: Pin[];
  
  public settings: Settings;
  
/*
https://heyjoe.hu/ddk/cgpx/ddk.gpx
https://heyjoe.hu/ak/cgpx/ak.gpx
https://heyjoe.hu/okt/cgpx/okt.gpx		
*/
  
   constructor(private http: HttpClient,private location : Location, private modal: ModalService)
   {	
   }
 
    ngOnInit(): void {
		this.http.get<PinsResponse>('http://kekszallas.uw.hu/php/search.php').subscribe(resp => {
			this.pins = resp.coordinates;
		});
		
		var parameters = location.hash.substring(2).split('/');
		if(parameters.length == 2)
		{
			if(parameters[0] == "szallas")
			{
				this.modal.PinModal.next(new String(parameters[1]));
			}
			else
			{
				this.modal.FeedbackModal.next(new String(parameters[1]));
			}
		}
		this.settings = new Settings(true, true, true);
	}
	
	public convertStringToNumber(value: string): number {
        return Number(value);
    }

	open(id) {	
		    this.modal.PinModal.next(new String(id));
	}

	
	placeMarker($event){
	/*
    console.log("lat:" + $event.coords.lat);
    console.log("lng:" + $event.coords.lng);
	*/
  }
}
