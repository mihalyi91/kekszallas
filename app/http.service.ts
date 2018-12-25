import { Injectable, OnDestroy } from '@angular/core';
import { AccommodationResponse, Accommodation } from './accommodation';
import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';
import { PinsResponse, Pin } from './pin';
import { Settings } from './settings';
import { FeedbackResponse, Feedback } from './feedback';
import { StatusResponse, EditResponse } from './status';
import 'rxjs/add/operator/takeUntil';
import { UtilsService } from './utils.service';

declare var google: any;

@Injectable()
export class HttpService implements OnDestroy {
  private _onDestroy = new Subject();

  constructor(private http: HttpClient, private utils: UtilsService) {}

  public GetAllPin() {
    const AllPins: Subject<Pin[]> = new Subject<Pin[]>();

    this.http.get<PinsResponse>('http://kekszallas.uw.hu/php/search.php')
    .takeUntil(this._onDestroy)
    .subscribe(resp => {
      AllPins.next(resp.coordinates);
    });

    return AllPins;
  }

  public GetAccommodationByID(id) {
    const AccommodationByID: Subject<Accommodation> = new Subject<Accommodation>();

    const params = new HttpParams()
    .set('id', id);

    this.http.get<AccommodationResponse>('http://kekszallas.uw.hu/php/search.php', {params: params})
    .takeUntil(this._onDestroy)
    .subscribe(resp => {
        AccommodationByID.next(resp.accommodation);
    });

    return AccommodationByID;
  }

  public GetFeedbackByID(id) {
      const FoundFeedback: Subject<Feedback> = new Subject<Feedback>();

      const params = new HttpParams()
      .set('feedback', id);

      this.http.get<FeedbackResponse>('http://kekszallas.uw.hu/php/search.php', {params: params})
      .takeUntil(this._onDestroy)
      .subscribe(resp => {
          FoundFeedback.next(resp.feedback[0]);
      });

      return FoundFeedback;
   }
  public SearchPin(minPrice: Number, maxPrice: Number, settings: Settings, otp: boolean, mkb: boolean, kh: boolean, hasFeedback: boolean) {
    const FoundPins: Subject<Pin[]> = new Subject<Pin[]>();

    const params = new HttpParams()
    .set('min', minPrice === undefined ? 'undefined' : minPrice.toString())
    .set('max', maxPrice === undefined ? 'undefined' : maxPrice.toString())
    .set('okt', settings.showOKT.toString())
    .set('ak', settings.showAK.toString())
    .set('ddk', settings.showDDK.toString())
    .set('otp', otp === undefined ? 'false' : otp.toString())
    .set('mkb', mkb === undefined ? 'false' : mkb.toString())
    .set('kh', kh === undefined ? 'false' : kh.toString())
    .set('hasFeedback', hasFeedback === undefined ? 'false' : hasFeedback.toString());

    this.http.get<PinsResponse>('http://kekszallas.uw.hu/php/search.php', {params: params})
    .takeUntil(this._onDestroy)
    .subscribe(resp => {
        FoundPins.next(resp.coordinates);
    });

    return FoundPins;
  }

  public AddAccomodation(acc: Accommodation, needCoordinate: boolean) {
    const AddAccomodation: Subject<any> = new Subject<any>();
    const AddAccomodationError: Subject<any> = new Subject<any>();
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'address': acc.address }, (results, status) => {
      if (results.length > 0) {
        if (!needCoordinate) {
            acc.lat = Number(results[0].geometry.location.lat());
            acc.lng = Number(results[0].geometry.location.lng());
        } else {
            acc.address = `${acc.lat}, ${acc.lng}`;
        }

        const body = new URLSearchParams();
        body.set('name', acc.name);
        body.set('phone', acc.phone.trim());
        body.set('price', acc.price === undefined ? '0' : acc.price.toString());
        body.set('web', acc.web);
        body.set('mail', acc.mail === undefined ? acc.mail : acc.mail.trim());
        body.set('trail', acc.trail);
        body.set('voucherCard', acc.voucherCard);
        body.set('address', acc.address);
        body.set('lat', acc.lat.toString());
        body.set('lng', acc.lng.toString());


        const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded; charset=utf-8');
        this.http.post<StatusResponse>('http://kekszallas.uw.hu/php/search.php', body.toString(), { headers: headers })
        .takeUntil(this._onDestroy)
        .subscribe(x => {
        if (x.result[0].status === 'error') {
            AddAccomodationError.next(x.result[0].message);
        } else {
            AddAccomodation.next(x.result[0].message);
        }
        });
      }
    });

    return {'error': AddAccomodationError, 'success': AddAccomodation};
  }

  public EditAccomodation(oldAcc: Accommodation, newAcc: Accommodation, needCoordinate: boolean, name: string) {
    const EditAccomodation: Subject<Accommodation> = new Subject<Accommodation>();
    const EditAccomodationError: Subject<any> = new Subject<any>();
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'address': newAcc.address }, (results, status) => {
        if (results.length > 0) {
            const body = new URLSearchParams();
            body.set('id', newAcc.id.toString());
            body.set('trail', newAcc.trail);

            if (this.utils.IsNameRequested(oldAcc, newAcc)) {
                body.set('userName', name);
            }

            if (!needCoordinate && newAcc.address !== oldAcc.address) {
                body.set('address', newAcc.address);
                body.set('lat', results[0].geometry.location.lat().toString());
                body.set('lng', results[0].geometry.location.lng().toString());
            }

            if (needCoordinate && (newAcc.lng !== oldAcc.lng || newAcc.lat !== oldAcc.lat)) {
                body.set('address', `${newAcc.lat}, ${newAcc.lng}`);
                body.set('lat', newAcc.lat.toString());
                body.set('lng', newAcc.lng.toString());
            }

            if (newAcc.voucherCard !== oldAcc.voucherCard) {
                body.set('voucherCard', newAcc.voucherCard);
            }

            if (newAcc.price !== oldAcc.price) {
                body.set('price', newAcc.price.toString());
            }

            if (newAcc.phone !== oldAcc.phone) {
                body.set('phone', newAcc.phone.trim());
            }

            if (newAcc.name !== oldAcc.name) {
                body.set('name', newAcc.name);
            }

            const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded; charset=utf-8');
            this.http.post<EditResponse>('http://kekszallas.uw.hu/php/search.php', body.toString(), {headers: headers})
            .takeUntil(this._onDestroy)
            .subscribe(x => {
                if (x.result[0].status === 'error') {
                EditAccomodationError.next(x.result[0].message);
                } else {
                EditAccomodation.next(x.accommodation);
                }
                });
        }
    });
    return {'error': EditAccomodationError, 'success': EditAccomodation};
  }

  public AddFeedback(accommodationId: number, name: string, feedbackText: string, feedbackType: string, visitDate: string) {
    const AddFeedback: Subject<any> = new Subject<any>();

    const body = new URLSearchParams();
    body.set('name', name);
    body.set('feedbackText', feedbackText);
    body.set('feedbackType', feedbackType);
    body.set('id', accommodationId.toString());
    body.set('visitDate', visitDate);

    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded; charset=utf-8');
     this.http.post<StatusResponse>('http://kekszallas.uw.hu/php/search.php', body.toString(), { headers: headers })
     .takeUntil(this._onDestroy)
     .subscribe(x => {
         if (x.result[0].status === 'error') {
            ///shall never happend
         } else {
             console.log(x.result[0].message);
          AddFeedback.next();
         }
        });

    return AddFeedback;
  }

  ngOnDestroy() {
    this._onDestroy.next();
  }
}
