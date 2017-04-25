import {Injectable} from '@angular/core'
import {Inject} from '@angular/core'
import {AsyncSubject} from 'rxjs/AsyncSubject'
import {Observable} from "rxjs/Observable"

@Injectable()
export class EmailBackendService {

  constructor(@Inject('openerp') private instance: any) {}

  public searchEmail(term : string) {
      let model = new this.instance.web.Model('res.partner')
      let deferred = model.call('search_email', {'search_for':term})
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
