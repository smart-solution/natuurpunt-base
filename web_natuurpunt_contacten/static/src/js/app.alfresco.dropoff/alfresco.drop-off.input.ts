import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core'
import {Observable} from 'rxjs/Observable'
import {Http, Response, Headers, RequestOptions, URLSearchParams} from '@angular/http'
import {BehaviorSubject} from 'rxjs/BehaviorSubject'
import {Subject} from 'rxjs/Subject'
import 'rxjs/add/operator/mergeMap'
import 'rxjs/add/observable/forkJoin'
import 'rxjs/add/observable/of'
import {IDropOffDocument} from './alfresco.store'
import {List} from './alfresco.store'
import {AlfrescoStore} from './alfresco.store'

const observableList = (list : List) => Observable.of(list)

interface IRequestOptions {
  percentageLoaded : number
  requestOptions: RequestOptions
}

@Component({
    selector: 'drop-off-input',
    template: `
              <typeahead autofocus
                     [(ngModel)]="inputValue"
                     [list]="alfrescoStore.dropOffDocuments | async"
                     [searchProperty]="'searchText'"
                     [displayProperty]="'name'"
                     [maxSuggestions]="8"
                     (suggestionSelected)="dropOffDocumentSelected($event)">
              </typeahead>
              <progress-bar
                [currentProgress]="progress"
                [visible]="visible">
              </progress-bar>
              `,
    styles: [`
            .typeahead-input,
            .typeahead-typeahead{
                width: 50px;
                padding: 5px;
                border-radius: 5px;
              }
            `]
})
export class DropOffInputComponent implements OnInit {
    @Output() onSelectDocument = new EventEmitter<IDropOffDocument>()

    progress: Subject<number> = new Subject()
    visible: Subject<number> = new Subject()

    private url : string

    public inputValue: string

    public dropOffDocumentSelected(dropOffDocument : IDropOffDocument) {
      if (dropOffDocument) {
        this.alfrescoStore.addDocument(dropOffDocument)
      }
    }

    constructor(private http: Http, private alfrescoStore: AlfrescoStore) {}

    ngOnInit() {
       //called after the constructor and called  after the first ngOnChanges()
       this.url = 'http://alfresco:8080/alfresco/api/-default-/public/alfresco/versions/1/nodes/ed8c5424-d4a5-4362-bc99-4ea67ba3caf6/children'
       this.loadDocumentsToProcess(50).subscribe(
            (totalItems) => {
              console.log(totalItems)
              this.visible.next(0)
            },
            (e) => {
              console.log(e)
            },
            () => {
              console.log("Alfresco dropoff files are loaded")
            })

    }

    private httpCall(options : RequestOptions) : Observable<Response> {
       let username : string = 'admin'
       let password : string = 'HONDSdraf8'
       let headers = new Headers()
       headers.append("Authorization", "Basic " + btoa(username + ":" + password))
       headers.append("Content-Type", "application/x-www-form-urlencoded")
       options.headers = headers
       return this.http.get(this.url,options)
     }

     private createRequestOptions(skipCount : number, maxItems: number) {
       let data = {'skipCount':skipCount, 'maxItems':maxItems}
       let params = new URLSearchParams()
       for(var key in data) {
         params.set(key, data[key])
       }
       let options = new RequestOptions({
         search: params
       })
       return options
     }

     private optionsQueue(list : List, batchSize : number) {
       let queue : Array<IRequestOptions> = []
       for (var i = list.files.length; i < list.pagination.totalItems; i += batchSize) {
         queue.push({
           percentageLoaded: Math.round((100 / list.pagination.totalItems) * batchSize),
           requestOptions: this.createRequestOptions(i,batchSize)
         })
       }
       return queue
     }

     private loadDocumentsToProcess(batchSize : number) {
      //lees de eerste x aantal dropOffFile (batchSize)
      //Alfresco ondersteund max 100 obj per request
      //en indien er meerdere zijn maak dan meerdere requests
      //en concat deze bij de oorsponkelijke lijst zodat we toch alles kunnen in lezen
      return this.httpCall(this.createRequestOptions(0,batchSize))
                 .flatMap((res:Response) => {
                   this.visible.next(1)
                   let list = new List().deserialize(res.json().list)
                   let percentageLoaded = Math.round((100 / list.pagination.totalItems) * batchSize)
                   this.progress.next(percentageLoaded)
                   return Observable.forkJoin(
                     this.optionsQueue(list,batchSize)
                         .map((options:IRequestOptions) => {
                           return this.httpCall(options.requestOptions).flatMap((res:Response) => {
                             percentageLoaded = percentageLoaded + options.percentageLoaded
                             this.progress.next(percentageLoaded)
                             return observableList(new List().deserialize(res.json().list))
                           })
                         })
                   ).flatMap(listArray => {
                     let files = [].concat.apply(listArray.map((l:List) => l.files))
                     this.alfrescoStore.dropOffStore = [].concat.apply(list.files,files)
                     return Observable.of(list.pagination.totalItems)
                   })
     })
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
