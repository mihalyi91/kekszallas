import { Injectable } from '@angular/core';
import {Subject} from 'rxjs/Subject';
import { Accommodation } from './accommodation';
import { Feedback } from './feedback';

@Injectable()
export class ModalService {
  public SearchModal: Subject<any> = new Subject<any>();
  public AddModal: Subject<any> = new Subject<any>();
  public EditModal: Subject<Accommodation> = new Subject<Accommodation>();
  public PinModal: Subject<Accommodation | String> = new Subject<Accommodation | String>();
  public NewFeedbackModal: Subject<Feedback> = new Subject<Feedback>();
  public FeedbackModal: Subject<Feedback | String> = new Subject<Feedback | String>();
  constructor() { }
}
