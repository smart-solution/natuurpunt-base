import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from "@angular/forms";
import { AppComponent } from './app.component';
import { Ng2CompleterModule } from "ng2-completer";
import { EmailBackendService } from "./emailbackendservice";

@NgModule({
  imports: [
      BrowserModule,
      Ng2CompleterModule,
      FormsModule,
  ],
  declarations: [
    AppComponent
   ],
  providers : [
       EmailBackendService,
   ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
