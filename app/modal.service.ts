import { Injectable } from '@angular/core';
import {Subject} from 'rxjs/Subject';
import { Accommodation } from './accommodation';
import { Feedback } from './feedback';
import { Pin } from './pin';

@Injectable()
export class ModalService {
  public SearchModal: Subject<any> = new Subject<any>();
  public AddModal: Subject<any> = new Subject<any>();
  public EditModal: Subject<Accommodation> = new Subject<Accommodation>();
  public NewFeedbackModal: Subject<Feedback> = new Subject<Feedback>();
  public PinSelection: Subject<Pin> = new Subject<Pin>();
  constructor() { }
}
