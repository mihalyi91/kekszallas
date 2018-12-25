import { Component } from '@angular/core';
import { AppComponent } from '../app.component';
import { ModalService } from '../modal.service';

@Component({
  providers: [AppComponent],
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})

export class NavComponent {

  constructor(private modal: ModalService) {
  }

  OpenSearch() {
    this.modal.SearchModal.next('open');
  }

  OpenAdd() {
    this.modal.AddModal.next('open');
  }

}
