import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { AgmCoreModule, GoogleMapsAPIWrapper } from '@agm/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {HttpClientModule} from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';
import { SearchComponent } from './search/search.component';
import { ModalService } from './modal.service';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';
import { NewFeedbackComponent } from './new-feedback/new-feedback.component';
import { PinComponent } from './pin/pin.component';
import { FeedbackComponent } from './feedback/feedback.component';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    SearchComponent,
    AddComponent,
    EditComponent,
    NewFeedbackComponent,
    PinComponent,
    FeedbackComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
	AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAfAr0y8KPBbLqcCzzl86aMlAYlohBuz4U'
    }),
	NgbModule.forRoot(),
	HttpClientModule
  ],
  providers: [GoogleMapsAPIWrapper, Location, {provide: LocationStrategy, useClass: PathLocationStrategy}, ModalService],
  bootstrap: [AppComponent]
})
export class AppModule {
 }
