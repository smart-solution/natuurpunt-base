import {Injectable} from '@angular/core'
import {Attachment} from './attachments.component'
import {Inject} from '@angular/core'
import {AsyncSubject} from 'rxjs/AsyncSubject'
import {Observable} from "rxjs/Observable"
import 'rxjs/add/operator/mergeMap'
import 'rxjs/add/observable/of'

@Injectable()
export class AttachmentBackendService {
  private _initialized = false
  private model

  constructor(@Inject('openerp') private instance: any) {}

  get initialized() {
    return this._initialized
  }

  initAttachmentBackendService() {
    if (this.initialized == false) {
      this.model = new this.instance.web.Model('memory.ir.attachment')
      let deferred = this.model.call('get_store_id')
      this._initialized = true
      return this.DeferredAsObservable(deferred)
      //return Observable.of('100')
    }
  }

  saveAttachment(storeId : string, attachment : Attachment) {
      let deferred = this.model.call(
          'upload_attachment', {
            'filename':attachment.name,
            'data':attachment.data,
            'store_id':storeId})
      return this.DeferredAsObservable(deferred)
  }

  deleteAttachment(attachmentId : number) {
    let deferred = this.model.call(
      'delete_attachment', {
        'attachment_id':attachmentId})
    this.DeferredAsObservable(deferred).subscribe(
      (value) => {
        console.log("delete attachment : " +
          JSON.parse(value[2].responseText).result)
      },
      (e) => {
        console.log(e)
      },
      () => {
        console.log("call complete!!!")
      })
  }

  DeferredAsObservable(deferred) {
  	//Create a new observable.  The AsyncSubject class is a type of Cold observable,
  	//which means that when a user subscribes to the observable, they get items that
  	//occurred before the subscription.
  	var obs = new AsyncSubject()

  	//When the Deferred is complete, push an item through the Observable
  	deferred.done(function(){
  		//Get the arguments as an array
  		var args = Array.prototype.slice.call(arguments)
  		//Call the observable OnNext with the same parameters
      console.log('args:' + args)
  		obs.next(args)
  		//Complete the Observable to indicate that there are no more items.
  		obs.complete()
  	})
  	//If the Deferred errors, push an error through the Observable
  	deferred.fail(function(){
  		//Get the arguments as an array
  		var args = Array.prototype.slice.call(arguments)
  		//Call the observable OnError with the args array
      console.log('args:' + args)
  		obs.error(args)
  		obs.complete()
  	})

  	return obs
  }

}
