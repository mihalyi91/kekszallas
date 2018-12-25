import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { AgmCoreModule, GoogleMapsAPIWrapper } from '@agm/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {HttpClientModule} from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { SearchComponent } from './search/search.component';
import { ModalService } from './modal.service';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';
import { NewFeedbackComponent } from './new-feedback/new-feedback.component';
import { PinComponent } from './pin/pin.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { UtilsService } from './utils.service';
import { RouterModule, Routes } from '@angular/router';
import { HttpService } from './http.service';

const appRoutes: Routes = [
  { path: 'szallas/:id', component: PinComponent },
  { path: 'velemeny/:id', component: FeedbackComponent },
  { path: '', component: AppComponent },
  { path: '**', component: NavComponent }
];


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
    HttpClientModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAfAr0y8KPBbLqcCzzl86aMlAYlohBuz4U'
    }),
    NgbModule.forRoot(),
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: false } // <-- debugging purposes only
    )
  ],
  providers: [GoogleMapsAPIWrapper,
              ModalService,
              UtilsService,
              HttpService],
  bootstrap: [AppComponent]
})
export class AppModule {
 }
