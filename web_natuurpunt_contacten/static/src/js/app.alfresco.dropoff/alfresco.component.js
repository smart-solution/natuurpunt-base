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
var alfresco_store_1 = require('./alfresco.store');
var DocumentComponent = (function () {
    function DocumentComponent(alfrescoStore) {
        this.alfrescoStore = alfrescoStore;
    }
    DocumentComponent.prototype.removeDocument = function (index) {
        this.alfrescoStore.removeDocument(index);
    };
    DocumentComponent = __decorate([
        core_1.Component({
            selector: 'alfresco-documents',
            template: "\n            <ul id=\"alfresco-doc-list\" style=\"list-style: none;\">\n            <li *ngFor=\"let document of alfrescoStore.alfrescoDocuments | async; let i = index\">\n            <button (click)=\"removeDocument(i)\">X</button>\n            <label>{{document.name}}</label>\n            </li>\n            </ul>\n            ",
        }), 
        __metadata('design:paramtypes', [alfresco_store_1.AlfrescoStore])
    ], DocumentComponent);
    return DocumentComponent;
}());
exports.DocumentComponent = DocumentComponent;
//# sourceMappingURL=alfresco.component.js.map