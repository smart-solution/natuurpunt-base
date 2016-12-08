import {Component, ViewChild} from '@angular/core'
import {AttachmentInputComponent} from './attachments.component'
import {AttachmentComponent} from './attachments.component'
import {AttachmentStore} from './attachment.store'

@Component({
    selector: 'my-app',
    template: `
              <attachmentinput (onSelectAttachments)="addSelectedAttachments($event)"></attachmentinput>
              <attachments></attachments>
              `,
})
export class AppComponent {
  //@ViewChild("storeId") storeId

  constructor(private attachmentStore: AttachmentStore ) {}

  addSelectedAttachments(files : FileList) {
    this.attachmentStore.addFiles(files)
  }
}
