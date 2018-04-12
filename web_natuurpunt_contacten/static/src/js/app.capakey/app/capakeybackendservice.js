"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var Subject_1 = require("rxjs/Subject");
require("rxjs/add/observable/of");
var nodeservice_1 = require("./nodeservice");
var CapakeyBackendService = (function (_super) {
    __extends(CapakeyBackendService, _super);
    function CapakeyBackendService(instance, nodeService) {
        var _this = _super.call(this) || this;
        _this.instance = instance;
        _this.nodeService = nodeService;
        return _this;
    }
    CapakeyBackendService.prototype.search = function (term) {
        var _this = this;
        this.searchCapakey(term)
            .subscribe(function (valueArray) {
            var data = JSON.parse(valueArray[2].responseText).result;
            var matches = data.map(function (result) { return ({
                title: Object.keys(result)[0],
                originalObject: result
            }); });
            _this.next(matches);
        }, function (e) {
            console.log(e);
        }, function () {
            console.log("search complete!!!");
        });
    };
    CapakeyBackendService.prototype.cancel = function () {
        // Handle cancel
    };
    CapakeyBackendService.prototype.searchCapakey = function (term) {
        var model = new this.instance.web.Model('res.partner');
        var deferred = model.call('search_capakey', [this.nodeService.getSearchQuery(term)]);
        return this.DeferredAsObservable(deferred);
    };
    CapakeyBackendService.prototype.DeferredAsObservable = function (deferred) {
        //Create a new observable.  The AsyncSubject class is a type of Cold observable,
        //which means that when a user subscribes to the observable, they get items that
        //occurred before the subscription.
        var obs = new AsyncSubject_1.AsyncSubject();
        //When the Deferred is complete, push an item through the Observable
        deferred.done(function () {
            //Get the arguments as an array
            var args = Array.prototype.slice.call(arguments);
            //Call the observable OnNext with the same parameters
            obs.next(args);
            //Complete the Observable to indicate that there are no more items.
            obs.complete();
        });
        //If the Deferred errors, push an error through the Observable
        deferred.fail(function () {
            //Get the arguments as an array
            var args = Array.prototype.slice.call(arguments);
            //Call the observable OnError with the args array
            obs.error(args);
            obs.complete();
        });
        return obs;
    };
    return CapakeyBackendService;
}(Subject_1.Subject));
CapakeyBackendService = __decorate([
    core_1.Injectable(),
    __param(0, core_2.Inject('openerp')),
    __metadata("design:paramtypes", [Object, nodeservice_1.NodeService])
], CapakeyBackendService);
exports.CapakeyBackendService = CapakeyBackendService;
//# sourceMappingURL=capakeybackendservice.js.map