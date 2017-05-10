"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var core_2 = require("@angular/core");
var AsyncSubject_1 = require("rxjs/AsyncSubject");
var EmailBackendService = (function () {
    function EmailBackendService(instance) {
        this.instance = instance;
    }
    EmailBackendService.prototype.searchEmail = function (term) {
        var model = new this.instance.web.Model('res.partner');
        var deferred = model.call('search_email', { 'search_for': term });
        return this.DeferredAsObservable(deferred);
    };
    EmailBackendService.prototype.DeferredAsObservable = function (deferred) {
        //Create a new observable.  The AsyncSubject class is a type of Cold observable,
        //which means that when a user subscribes to the observable, they get items that
        //occurred before the subscription.
        var obs = new AsyncSubject_1.AsyncSubject();
        //When the Deferred is complete, push an item through the Observable
        deferred.done(function () {
            //Get the arguments as an array
            var args = Array.prototype.slice.call(arguments);
            //Call the observable OnNext with the same parameters
            console.log('args:' + args);
            obs.next(args);
            //Complete the Observable to indicate that there are no more items.
            obs.complete();
        });
        //If the Deferred errors, push an error through the Observable
        deferred.fail(function () {
            //Get the arguments as an array
            var args = Array.prototype.slice.call(arguments);
            //Call the observable OnError with the args array
            console.log('args:' + args);
            obs.error(args);
            obs.complete();
        });
        return obs;
    };
    return EmailBackendService;
}());
EmailBackendService = __decorate([
    core_1.Injectable(),
    __param(0, core_2.Inject('openerp')),
    __metadata("design:paramtypes", [Object])
], EmailBackendService);
exports.EmailBackendService = EmailBackendService;
//# sourceMappingURL=emailbackendservice.js.map