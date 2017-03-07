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
var core_1 = require('@angular/core');
var core_2 = require('@angular/core');
var AsyncSubject_1 = require('rxjs/AsyncSubject');
require('rxjs/add/operator/mergeMap');
require('rxjs/add/observable/of');
var AttachmentBackendService = (function () {
    function AttachmentBackendService(instance) {
        this.instance = instance;
        this._initialized = false;
    }
    Object.defineProperty(AttachmentBackendService.prototype, "initialized", {
        get: function () {
            return this._initialized;
        },
        enumerable: true,
        configurable: true
    });
    AttachmentBackendService.prototype.initAttachmentBackendService = function () {
        if (this.initialized == false) {
            this.model = new this.instance.web.Model('memory.ir.attachment');
            var deferred = this.model.call('get_store_id');
            this._initialized = true;
            return this.DeferredAsObservable(deferred);
        }
    };
    AttachmentBackendService.prototype.saveAttachment = function (storeId, attachment) {
        var deferred = this.model.call('upload_attachment', {
            'filename': attachment.name,
            'data': attachment.data,
            'store_id': storeId });
        return this.DeferredAsObservable(deferred);
    };
    AttachmentBackendService.prototype.deleteAttachment = function (attachmentId) {
        var deferred = this.model.call('delete_attachment', {
            'attachment_id': attachmentId });
        this.DeferredAsObservable(deferred).subscribe(function (value) {
            console.log("delete attachment : " +
                JSON.parse(value[2].responseText).result);
        }, function (e) {
            console.log(e);
        }, function () {
            console.log("call complete!!!");
        });
    };
    AttachmentBackendService.prototype.DeferredAsObservable = function (deferred) {
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
    AttachmentBackendService = __decorate([
        core_1.Injectable(),
        __param(0, core_2.Inject('openerp')), 
        __metadata('design:paramtypes', [Object])
    ], AttachmentBackendService);
    return AttachmentBackendService;
}());
exports.AttachmentBackendService = AttachmentBackendService;
//# sourceMappingURL=attachment.backend.service.js.map