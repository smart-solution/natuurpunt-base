import {Injectable} from '@angular/core'
import {Inject} from '@angular/core'
import {AsyncSubject} from 'rxjs/AsyncSubject'
import {Observable} from "rxjs/Observable"
import { Subject } from "rxjs/Subject"
import { CompleterData, CompleterItem } from "ng2-completer"
import 'rxjs/add/observable/of'
import { NodeService } from './nodeservice'

@Injectable()
export class CapakeyBackendService extends Subject<CompleterItem[]> implements CompleterData {

  public search(term: string): void {
    this.searchCapakey(term)
        .subscribe(
        (valueArray) => {
            let data = JSON.parse(valueArray[2].responseText).result
            let matches: CompleterItem[] = data.map((result) => ({
              title:Object.keys(result)[0],
              originalObject:result
            }))
            this.next(matches)
          },
          (e) => {
            console.log(e)
          },
          () => {
            console.log("search complete!!!")
          })
  }

  public cancel() {
      // Handle cancel
  }

  constructor(@Inject('openerp') private instance: any,
              private nodeService : NodeService) {
    super()
  }

  public searchCapakey(term : string) {
      let model = new this.instance.web.Model('res.partner')

      let deferred = model.call('search_capakey',
        [this.nodeService.getSearchQuery(term)]
       )
      return this.DeferredAsObservable(deferred)
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
  		obs.next(args)
  		//Complete the Observable to indicate that there are no more items.
  		obs.complete()
  	})
  	//If the Deferred errors, push an error through the Observable
  	deferred.fail(function(){
  		//Get the arguments as an array
  		var args = Array.prototype.slice.call(arguments)
  		//Call the observable OnError with the args array
  		obs.error(args)
  		obs.complete()
  	})

  	return obs
  }

}
