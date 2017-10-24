import { MessengerService } from 'app/shared/services/messenger.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { CraneComponent } from './crane/crane.component';
import { VesselVisitComponent } from './vessel-visit/vessel-visit.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSliderModule} from '@angular/material';
import { StompService } from 'ng2-stomp-service';
import { AddCraneComponent } from './add-crane/add-crane.component';


@NgModule({
  declarations: [
    AppComponent,
    CraneComponent,
    VesselVisitComponent,
    AddCraneComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,  
    HttpModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatSliderModule
  ],
  providers: [StompService, MessengerService],
  bootstrap: [AppComponent]
})
export class AppModule { }
