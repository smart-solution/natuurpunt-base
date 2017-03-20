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
var core_1 = require('@angular/core');
var Observable_1 = require('rxjs/Observable');
var http_1 = require('@angular/http');
var Subject_1 = require('rxjs/Subject');
require('rxjs/add/operator/mergeMap');
require('rxjs/add/observable/forkJoin');
require('rxjs/add/observable/of');
var alfresco_store_1 = require('./alfresco.store');
var alfresco_store_2 = require('./alfresco.store');
var observableList = function (list) { return Observable_1.Observable.of(list); };
var DropOffInputComponent = (function () {
    function DropOffInputComponent(http, alfrescoStore) {
        this.http = http;
        this.alfrescoStore = alfrescoStore;
        this.onSelectDocument = new core_1.EventEmitter();
        this.progress = new Subject_1.Subject();
        this.visible = new Subject_1.Subject();
    }
    DropOffInputComponent.prototype.dropOffDocumentSelected = function (dropOffDocument) {
        if (dropOffDocument) {
            this.alfrescoStore.addDocument(dropOffDocument);
        }
    };
    DropOffInputComponent.prototype.ngOnInit = function () {
        var _this = this;
        //called after the constructor and called  after the first ngOnChanges()
        this.url = 'http://alfresco:8080/alfresco/api/-default-/public/alfresco/versions/1/nodes/ed8c5424-d4a5-4362-bc99-4ea67ba3caf6/children';
        this.loadDocumentsToProcess(50).subscribe(function (totalItems) {
            console.log(totalItems);
            _this.visible.next(0);
        }, function (e) {
            console.log(e);
        }, function () {
            console.log("Alfresco dropoff files are loaded");
        });
    };
    DropOffInputComponent.prototype.httpCall = function (options) {
        var username = 'admin';
        var password = 'HONDSdraf8';
        var headers = new http_1.Headers();
        headers.append("Authorization", "Basic " + btoa(username + ":" + password));
        headers.append("Content-Type", "application/x-www-form-urlencoded");
        options.headers = headers;
        return this.http.get(this.url, options);
    };
    DropOffInputComponent.prototype.createRequestOptions = function (skipCount, maxItems) {
        var data = { 'skipCount': skipCount, 'maxItems': maxItems };
        var params = new http_1.URLSearchParams();
        for (var key in data) {
            params.set(key, data[key]);
        }
        var options = new http_1.RequestOptions({
            search: params
        });
        return options;
    };
    DropOffInputComponent.prototype.optionsQueue = function (list, batchSize) {
        var queue = [];
        for (var i = list.files.length; i < list.pagination.totalItems; i += batchSize) {
            queue.push({
                percentageLoaded: Math.round((100 / list.pagination.totalItems) * batchSize),
                requestOptions: this.createRequestOptions(i, batchSize)
            });
        }
        return queue;
    };
    DropOffInputComponent.prototype.loadDocumentsToProcess = function (batchSize) {
        var _this = this;
        //lees de eerste x aantal dropOffFile (batchSize)
        //Alfresco ondersteund max 100 obj per request
        //en indien er meerdere zijn maak dan meerdere requests
        //en concat deze bij de oorsponkelijke lijst zodat we toch alles kunnen in lezen
        return this.httpCall(this.createRequestOptions(0, batchSize))
            .flatMap(function (res) {
            _this.visible.next(1);
            var list = new alfresco_store_1.List().deserialize(res.json().list);
            var percentageLoaded = Math.round((100 / list.pagination.totalItems) * batchSize);
            _this.progress.next(percentageLoaded);
            return Observable_1.Observable.forkJoin(_this.optionsQueue(list, batchSize)
                .map(function (options) {
                return _this.httpCall(options.requestOptions).flatMap(function (res) {
                    percentageLoaded = percentageLoaded + options.percentageLoaded;
                    _this.progress.next(percentageLoaded);
                    return observableList(new alfresco_store_1.List().deserialize(res.json().list));
                });
            })).flatMap(function (listArray) {
                var files = [].concat.apply(listArray.map(function (l) { return l.files; }));
                _this.alfrescoStore.dropOffStore = [].concat.apply(list.files, files);
                return Observable_1.Observable.of(list.pagination.totalItems);
            });
        });
    };
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], DropOffInputComponent.prototype, "onSelectDocument", void 0);
    DropOffInputComponent = __decorate([
        core_1.Component({
            selector: 'drop-off-input',
            template: "\n              <typeahead autofocus\n                     [(ngModel)]=\"inputValue\"\n                     [list]=\"alfrescoStore.dropOffDocuments | async\"\n                     [searchProperty]=\"'searchText'\"\n                     [displayProperty]=\"'name'\"\n                     [maxSuggestions]=\"8\"\n                     (suggestionSelected)=\"dropOffDocumentSelected($event)\">\n              </typeahead>\n              <progress-bar\n                [currentProgress]=\"progress\"\n                [visible]=\"visible\">\n              </progress-bar>\n              ",
            styles: ["\n            .typeahead-input,\n            .typeahead-typeahead{\n                width: 50px;\n                padding: 5px;\n                border-radius: 5px;\n              }\n            "]
        }), 
        __metadata('design:paramtypes', [http_1.Http, alfresco_store_2.AlfrescoStore])
    ], DropOffInputComponent);
    return DropOffInputComponent;
}());
exports.DropOffInputComponent = DropOffInputComponent;
var ProgressBarComponent = (function () {
    function ProgressBarComponent() {
    }
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Observable_1.Observable)
    ], ProgressBarComponent.prototype, "visible", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Observable_1.Observable)
    ], ProgressBarComponent.prototype, "currentProgress", void 0);
    ProgressBarComponent = __decorate([
        core_1.Component({
            selector: 'progress-bar',
            styles: ["\n      #progress_bar {\n        display: block;\n      \tborder: 1px inset #446;\n      \tborder-radius: 5px;\n        height: 5px;\n        width: 200px;\n        overflow: hidden;\n        position: relative;\n        padding: 0;\n        opacity: 0;\n      }\n      span.bg_fix {\n        display: block;\n        height: 100%;\n        position: absolute;\n        top: 0;\n        left: 0;\n        background: blue;\n        transition: width;\n        width: 0%;\n      }\n    "],
            template: "\n      <div id=\"progress_bar\" [style.opacity]=\"visible | async\">\n        <span class=\"bg_fix\" [style.width.%]=\"currentProgress | async\"></span>\n      </div>\n    ",
        }), 
        __metadata('design:paramtypes', [])
    ], ProgressBarComponent);
    return ProgressBarComponent;
}());
exports.ProgressBarComponent = ProgressBarComponent;
//# sourceMappingURL=alfresco.drop-off.input.js.map