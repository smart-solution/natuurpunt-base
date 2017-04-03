import {Injectable} from '@angular/core'
import {Inject} from '@angular/core'
import {BehaviorSubject} from 'rxjs/BehaviorSubject'
import {Subject} from 'rxjs/Subject'
import 'rxjs/add/observable/from'
import 'rxjs/add/operator/mergeMap'

export interface IDropOffDocument {
  id: string
  name: string
  searchText: string
}

interface ISerializable<T> {
    deserialize(input: Object): T
}

class Entry implements ISerializable<Entry> {
    name: string
    id: string

    deserialize(input) {
        this.name = input.name
        this.id = input.id
        return this
    }
}

class Entries implements ISerializable<Entries> {
    entry: Entry

    deserialize(input) {
        this.entry = new Entry().deserialize(input.entry)
        return this
    }
}

class Pagination implements ISerializable<Pagination> {
    maxItems: number
    skipCount: number
    totalItems: number
    hasMoreItems: boolean
    count: number

    deserialize(input) {
        this.skipCount = input.skipCount
        this.maxItems = input.maxItems
        this.hasMoreItems = input.hasMoreItems
        this.totalItems = input.totalItems
        return this
    }
}

export class List implements ISerializable<List> {
    pagination: Pagination
    files : Array<IDropOffDocument> = []

    deserialize(input) {
        (input.entries as Entries[]).map(data => {
          let obj = new Entries().deserialize(data)
          this.files.push({
                      searchText: obj.entry.name,
                      id: obj.entry.id,
                      name:obj.entry.name,
                    })
        })
        this.pagination = new Pagination().deserialize(input.pagination)
        return this
    }
}

@Injectable()
export class AlfrescoStore {
  private _documents: BehaviorSubject<IDropOffDocument[]>
    = new BehaviorSubject<IDropOffDocument[]>([])
  private _dropOffDocuments: BehaviorSubject<IDropOffDocument[]>
    = new BehaviorSubject<IDropOffDocument[]>([])
  private _dropOffStore : {
    documents : IDropOffDocument[]
  }
  private dataStore : {
    documents : IDropOffDocument[]
  }
  stringify = new Subject<string>()

  constructor() {
    this.dataStore = { documents : [] }
    this._dropOffStore = { documents : [] }
  }

  get alfrescoDocuments() {
    return this._documents.asObservable()
  }

  get dropOffDocuments() {
    return this._dropOffDocuments.asObservable()
  }

  set dropOffStore(dropOffDocuments : IDropOffDocument[])
  {
    this._dropOffStore.documents = dropOffDocuments.sort((a,b) => {
      return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0)
    })
    this._dropOffDocuments.next(this._dropOffStore.documents)
  }

  private sync() {
    this._documents.next(this.dataStore.documents)
    this.stringify.next(JSON.stringify(this.dataStore.documents))
  }

  //public
  addDocument(dropOffDocument : IDropOffDocument) {
    this.dataStore.documents.push(dropOffDocument)
    // remove from dropoff store
    this.dropOffStore = this._dropOffStore.documents.filter(
      docs => docs.id != dropOffDocument.id )
    // sync the new store with ui components
    this.sync()
  }

  removeDocument(index: number) {
      let dropOffDocument = this.dataStore.documents[index]
      this.dataStore.documents.splice(index, 1)
      this.dropOffStore = this._dropOffStore.documents.concat(dropOffDocument)
      this.sync()
  }
}
