import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
//import { HttpModule }    from '@angular/http'
import { AppComponent }  from './app.component'

import { AttachmentInputComponent } from './attachments.component.js'
import { AttachmentComponent } from './attachments.component.js'
import { ProgressBarComponent } from './attachments.component.js'
import { AttachmentBackendService } from './attachment.backend.service.js'
import { AttachmentStore } from './attachment.store.js'
import { UploaderService } from './attachment.store.js'

@NgModule({
  imports: [
    BrowserModule
    //HttpModule
  ],
  declarations: [
    AppComponent,
    AttachmentInputComponent,
    AttachmentComponent,
    ProgressBarComponent
  ],
  providers : [AttachmentBackendService,
               AttachmentStore,
               UploaderService
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {}
