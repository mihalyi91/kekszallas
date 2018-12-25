import { Component, OnInit, OnDestroy } from '@angular/core';
import { Pin } from './pin';
import { Settings } from './settings';
import { ModalService } from './modal.service';
import { Subscription } from 'rxjs';
import { HttpService } from './http.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})


export class AppComponent implements OnInit, OnDestroy {
  lat = 47.49801;
  lng = 19.03991;
  public pins: Pin[];
  public settings: Settings;
  subscription: Subscription;

/*
https://heyjoe.hu/ddk/cgpx/ddk.gpx
https://heyjoe.hu/ak/cgpx/ak.gpx
https://heyjoe.hu/okt/cgpx/okt.gpx
*/
   constructor(private http: HttpService, private router: Router, private modal: ModalService) {
   }

    ngOnInit(): void {
        this.subscription = this.http.GetAllPin().subscribe(resp => {
            this.pins = resp;
        });

        this.settings = new Settings(true, true, true);
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    public convertStringToNumber(value: string): number {
        return Number(value);
    }

    open(id) {
        this.router.navigate(['/szallas', id]);
    }

    placeMarker($event) {
        this.modal.PinSelection.next(new Pin(0, $event.coords.lng, $event.coords.lat));
    }

    pinsUpdate($pins) {
        this.pins = $pins;
    }
}
