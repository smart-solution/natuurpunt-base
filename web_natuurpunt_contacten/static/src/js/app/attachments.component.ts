import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core'
import {Observable} from "rxjs/Observable";
import {AttachmentStore} from './attachment.store'
import {UploaderService} from './attachment.store'

export interface Attachment {
  id: number
  name: string
  data: string
  size: string
}

@Component({
  selector: 'attachmentinput',
  styles: [`
    input[type="file"] {
        display: none;
    }
    .custom-file-upload {
        border: 1px solid #ccc;
        color: black;
        background: #8bbe41;
        display: inline-block;
        padding: 6px 12px;
        cursor: pointer;
    }
  `],
  template: `
            <input type="hidden" [attr.value]="uploaderService.storeId | async">
            <label for="file-upload" class="custom-file-upload">
              <i class="fa fa-cloud-upload"></i> Extra bijlages
            </label>
            <input #attachmentInput id="file-upload"
            type="file" [attr.multiple]="multiple ? true : null"
            (change)="addFiles()">
            `,
})
export class AttachmentInputComponent {
  @ViewChild("attachmentInput") attachmentInput
  @Input() storeId: Observable<string>
  @Input() multiple: boolean = true
  @Output() onSelectAttachments = new EventEmitter<FileList>()

  constructor(private uploaderService: UploaderService) {}

  addFiles() {
    let fi = this.attachmentInput.nativeElement
    if (fi.files.length == 0) return
    let files :FileList = fi.files
    this.onSelectAttachments.emit(files)
  }
}

@Component({
  selector: 'attachments',
  template: `
            <ul id="attachment-list" style="list-style: none;">
            <li *ngFor="let attachment of attachmentStore.attachments | async; let i = index">
            <button (click)="removeAttachment(i)">X</button>
            <label>{{attachment.name}}</label>
            <label>({{attachment.size}})</label>
            </li>
            </ul>
            <progress-bar
              [currentProgress]="uploaderService.progress"
              [visible]="uploaderService.visible">
            </progress-bar>
            `,
})
export class AttachmentComponent {
  @Input() attachment: Attachment

  constructor(private attachmentStore: AttachmentStore,
              private uploaderService: UploaderService) {}

  removeAttachment(index : number) {
    console.log(index)
    this.attachmentStore.removeFile(index)
  }
}

@Component({
    selector: 'progress-bar',
    styles: [`
      #progress_bar {
        display: block;
      	border: 1px inset #446;
      	border-radius: 5px;
        height: 5px;
        width: 200px;
        overflow: hidden;
        position: relative;
        padding: 0;
        opacity: 0;
      }
      span.bg_fix {
        display: block;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: blue;
        transition: width;
        width: 0%;
      }
    `],
    template: `
      <div id="progress_bar" [style.opacity]="visible | async">
        <span class="bg_fix" [style.width.%]="currentProgress | async"></span>
      </div>
    `,
})
export class ProgressBarComponent {
    @Input() visible: Observable<number>
    @Input() currentProgress: Observable<number>
}
