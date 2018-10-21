import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';
import {debounceTime} from 'rxjs/operator/debounceTime';
import {Subject} from 'rxjs/Subject';
import { ModalService } from '../modal.service';

@Component({
  providers:[AppComponent],
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})

export class NavComponent {
 
  hozzaadMessage: string;
  private _toolTipRX = new Subject<string>();
  
  constructor(private modal: ModalService) 
  {
	this._toolTipRX.subscribe((message) => this.hozzaadMessage = message);
	debounceTime.call(this._toolTipRX, 10000).subscribe(() => this.hozzaadMessage = null);
  }

  OpenSearch() {
	this.modal.SearchModal.next('open');
  }

  OpenAdd() {
	this.modal.AddModal.next('open');
  }

}
