import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from "@angular/forms";
import { AppComponent } from './app.component';
import { Ng2CompleterModule } from "ng2-completer";
import { GeopuntBackendService } from "./geopuntbackendservice";
import { NodeService } from "./nodeservice";
import { CapakeySearchComponent } from "./capakey";
import { CapakeyNodeComponent } from "./capakeynode";

@NgModule({
  imports: [
      BrowserModule,
      Ng2CompleterModule,
      FormsModule,
  ],
  declarations: [
    AppComponent,
    CapakeySearchComponent,
    CapakeyNodeComponent,
   ],
  providers : [
       GeopuntBackendService,
       NodeService,
   ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
