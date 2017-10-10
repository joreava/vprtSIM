import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { CraneComponent } from './crane/crane.component';
import { VesselVisitComponent } from './vessel-visit/vessel-visit.component';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatSliderModule} from '@angular/material';

@NgModule({
  declarations: [
    AppComponent,
    CraneComponent,
    VesselVisitComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,  
    HttpModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatSliderModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
