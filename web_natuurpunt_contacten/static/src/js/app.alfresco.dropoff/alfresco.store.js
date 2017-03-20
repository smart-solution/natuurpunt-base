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
var BehaviorSubject_1 = require('rxjs/BehaviorSubject');
var Subject_1 = require('rxjs/Subject');
require('rxjs/add/observable/from');
require('rxjs/add/operator/mergeMap');
var Entry = (function () {
    function Entry() {
    }
    Entry.prototype.deserialize = function (input) {
        this.name = input.name;
        this.id = input.id;
        return this;
    };
    return Entry;
}());
var Entries = (function () {
    function Entries() {
    }
    Entries.prototype.deserialize = function (input) {
        this.entry = new Entry().deserialize(input.entry);
        return this;
    };
    return Entries;
}());
var Pagination = (function () {
    function Pagination() {
    }
    Pagination.prototype.deserialize = function (input) {
        this.skipCount = input.skipCount;
        this.maxItems = input.maxItems;
        this.hasMoreItems = input.hasMoreItems;
        this.totalItems = input.totalItems;
        return this;
    };
    return Pagination;
}());
var List = (function () {
    function List() {
        this.files = [];
    }
    List.prototype.deserialize = function (input) {
        var _this = this;
        input.entries.map(function (data) {
            var obj = new Entries().deserialize(data);
            _this.files.push({
                searchText: obj.entry.name,
                id: obj.entry.id,
                name: obj.entry.name,
            });
        });
        this.pagination = new Pagination().deserialize(input.pagination);
        return this;
    };
    return List;
}());
exports.List = List;
var AlfrescoStore = (function () {
    function AlfrescoStore() {
        this._documents = new BehaviorSubject_1.BehaviorSubject([]);
        this._dropOffDocuments = new BehaviorSubject_1.BehaviorSubject([]);
        this.stringify = new Subject_1.Subject();
        this.dataStore = { documents: [] };
        this._dropOffStore = { documents: [] };
    }
    Object.defineProperty(AlfrescoStore.prototype, "alfrescoDocuments", {
        get: function () {
            return this._documents.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AlfrescoStore.prototype, "dropOffDocuments", {
        get: function () {
            return this._dropOffDocuments.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AlfrescoStore.prototype, "dropOffStore", {
        set: function (dropOffDocuments) {
            this._dropOffStore.documents = dropOffDocuments.sort(function (a, b) {
                return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);
            });
            this._dropOffDocuments.next(this._dropOffStore.documents);
        },
        enumerable: true,
        configurable: true
    });
    AlfrescoStore.prototype.sync = function () {
        this._documents.next(this.dataStore.documents);
        this.stringify.next(JSON.stringify(this.dataStore.documents));
    };
    //public
    AlfrescoStore.prototype.addDocument = function (dropOffDocument) {
        this.dataStore.documents.push(dropOffDocument);
        // remove from dropoff store
        this.dropOffStore = this._dropOffStore.documents.filter(function (docs) { return docs.id != dropOffDocument.id; });
        // sync the new store with ui components
        this.sync();
    };
    AlfrescoStore.prototype.removeDocument = function (index) {
        var dropOffDocument = this.dataStore.documents[index];
        this.dataStore.documents.splice(index, 1);
        this.dropOffStore = this._dropOffStore.documents.concat(dropOffDocument);
        this.sync();
    };
    AlfrescoStore = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], AlfrescoStore);
    return AlfrescoStore;
}());
exports.AlfrescoStore = AlfrescoStore;
//# sourceMappingURL=alfresco.store.js.map