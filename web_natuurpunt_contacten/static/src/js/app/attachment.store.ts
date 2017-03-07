import {Injectable} from '@angular/core'
import {Attachment} from './attachments.component'
import {Inject} from '@angular/core'
import {BehaviorSubject} from 'rxjs/BehaviorSubject'
import {Subject} from 'rxjs/Subject'
import {Observable} from "rxjs/Observable";
import {AttachmentBackendService} from './attachment.backend.service'
import 'rxjs/add/observable/from'
import 'rxjs/add/operator/mergeMap'

@Injectable()
export class UploaderService {
  progress: Subject<number> = new Subject();
  visible: Subject<number> = new Subject();
  storeId: BehaviorSubject<string> = new BehaviorSubject<string>("")

  constructor(private attachmentBackendService: AttachmentBackendService) {}

  formatBytes(bytes,decimals) {
    if(bytes == 0) return '0 Byte'
    var k = 1000
    var dm = decimals + 1 || 3
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    var i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
  }

  saveToDatabase(attachment : Attachment) {
    this.progress.next(75)
    this.attachmentBackendService
      .saveAttachment(this.storeId.value, attachment)
      .subscribe(
        (valueArray) => {
            let id = JSON.parse(valueArray[2].responseText).result
            console.log("save attachment : " + id)
            attachment.id = Number(id)
          },
          (e) => {
            console.log(e)
          },
          () => {
            console.log("upload complete!!!")
            this.progress.next(100)
          })
  }
}

@Injectable()
export class AttachmentStore {
  private _attachments: BehaviorSubject<Attachment[]> = new BehaviorSubject<Attachment[]>([])
  private dataStore : {
    attachments : Attachment[]
  }

  constructor(private attachmentBackendService: AttachmentBackendService,
              private uploaderService : UploaderService) {
    this.dataStore = { attachments : [] }
  }

  get attachments() {
    return this._attachments.asObservable()
  }

  // public
  addFiles(files: FileList) {
    this._attachments.next(this.dataStore.attachments)
    if (this.attachmentBackendService.initialized == false) {
      this.attachmentBackendService
        .initAttachmentBackendService()
        .subscribe(
          (valueArray) => {
            let storeId = JSON.parse(valueArray[2].responseText).result
            this.uploaderService.storeId.next(storeId)            
            this.processFileList(files)
          },
          (e) => {
            console.log(e)
          },
          () => {
            console.log("Init attachmentBackendService complete")
        })
    }
    else {
      this.processFileList(files)
    }
    return this.uploaderService.storeId
  }

  removeFile(index: number) {
    let attachment = this.dataStore.attachments[index]
    this.attachmentBackendService.deleteAttachment(attachment.id)
    this.dataStore.attachments.splice(index, 1)
    this._attachments.next(this.dataStore.attachments)
  }

  // private
  private processFileList(files : FileList) {
    let fileArray = Array.from(files)
    this.processFiles(
          fileArray[0],
          fileArray.slice(1))
        .subscribe(
          (attachment) => {
            this.dataStore.attachments.push(attachment)
          },
          (e) => {
            console.log(e)
          },
          () => {
            console.log("file loading completed!!!")
          })
  }

  private processFiles(file : File, fileArray : File[]) {
    if (fileArray.length > 0) {
      return this.processFiles(
                    fileArray.slice(0,1)[0],
                    fileArray.slice(1))
                 .flatMap( (attachment) => {
                   this.dataStore.attachments.push(attachment)
                   return this.fileReaderObs(file,this.uploaderService)
                 })
    } else {
      return this.fileReaderObs(file,this.uploaderService)
    }
  }

  private fileReaderObs(
    file : File,
    uploaderService : UploaderService)
  {
    let reader = new FileReader()
    let fileReaderObs = Observable.create((observer: any) => {
      reader.onprogress = function(evt) {
        if (evt.lengthComputable) {
          var percentLoaded = Math.round((evt.loaded / evt.total) * 50)
          if (percentLoaded < 80) {
            uploaderService.progress.next(percentLoaded)
          }
        }
      }
      reader.onloadstart = function(e) {
        uploaderService.visible.next(1)
        uploaderService.progress.next(0)
      }
      reader.onload = function() {
        let data = btoa(reader.result)
        let attachment : Attachment = {
          id : 0,
          name : file.name,
          data : data,
          size : uploaderService.formatBytes(data.length,0)
        }
        uploaderService.saveToDatabase(attachment)
        observer.next(attachment)
        observer.complete()
        uploaderService.visible.next(0)
      }
    })
    reader.readAsBinaryString(file)
    return fileReaderObs
  }

}
