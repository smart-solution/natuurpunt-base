import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { HttpModule }    from '@angular/http'
import { FormsModule }   from '@angular/forms'
import { AppComponent }  from './app.component'

import { DocumentComponent } from './alfresco.component.js'
import { AlfrescoStore } from './alfresco.store.js'
import { DropOffInputComponent } from './alfresco.drop-off.input.js'
import { ProgressBarComponent } from './alfresco.drop-off.input.js'
import { Typeahead } from './ng2-typeahead'

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  declarations: [
    AppComponent,
    DocumentComponent,
    DropOffInputComponent,
    ProgressBarComponent,
    Typeahead,
  ],
  providers : [
    AlfrescoStore,
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {}
