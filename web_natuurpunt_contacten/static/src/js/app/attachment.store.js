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
var Observable_1 = require("rxjs/Observable");
var attachment_backend_service_1 = require('./attachment.backend.service');
require('rxjs/add/observable/from');
require('rxjs/add/operator/mergeMap');
var UploaderService = (function () {
    function UploaderService(attachmentBackendService) {
        this.attachmentBackendService = attachmentBackendService;
        this.progress = new Subject_1.Subject();
        this.visible = new Subject_1.Subject();
        this.storeId = new BehaviorSubject_1.BehaviorSubject("");
    }
    UploaderService.prototype.formatBytes = function (bytes, decimals) {
        if (bytes == 0)
            return '0 Byte';
        var k = 1000;
        var dm = decimals + 1 || 3;
        var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        var i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    };
    UploaderService.prototype.saveToDatabase = function (attachment) {
        var _this = this;
        this.progress.next(75);
        this.attachmentBackendService
            .saveAttachment(this.storeId.value, attachment)
            .subscribe(function (valueArray) {
            var id = JSON.parse(valueArray[2].responseText).result;
            console.log("save attachment : " + id);
            attachment.id = Number(id);
        }, function (e) {
            console.log(e);
        }, function () {
            console.log("upload complete!!!");
            _this.progress.next(100);
        });
    };
    UploaderService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [attachment_backend_service_1.AttachmentBackendService])
    ], UploaderService);
    return UploaderService;
}());
exports.UploaderService = UploaderService;
var AttachmentStore = (function () {
    function AttachmentStore(attachmentBackendService, uploaderService) {
        this.attachmentBackendService = attachmentBackendService;
        this.uploaderService = uploaderService;
        this._attachments = new BehaviorSubject_1.BehaviorSubject([]);
        this.dataStore = { attachments: [] };
    }
    Object.defineProperty(AttachmentStore.prototype, "attachments", {
        get: function () {
            return this._attachments.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    // public
    AttachmentStore.prototype.addFiles = function (files) {
        var _this = this;
        this._attachments.next(this.dataStore.attachments);
        if (this.attachmentBackendService.initialized == false) {
            this.attachmentBackendService
                .initAttachmentBackendService()
                .subscribe(function (valueArray) {
                var storeId = JSON.parse(valueArray[2].responseText).result;
                _this.uploaderService.storeId.next(storeId);
                _this.processFileList(files);
            }, function (e) {
                console.log(e);
            }, function () {
                console.log("Init attachmentBackendService complete");
            });
        }
        else {
            this.processFileList(files);
        }
        return this.uploaderService.storeId;
    };
    AttachmentStore.prototype.removeFile = function (index) {
        var attachment = this.dataStore.attachments[index];
        this.attachmentBackendService.deleteAttachment(attachment.id);
        this.dataStore.attachments.splice(index, 1);
        this._attachments.next(this.dataStore.attachments);
    };
    // private
    AttachmentStore.prototype.processFileList = function (files) {
        var _this = this;
        var fileArray = Array.from(files);
        this.processFiles(fileArray[0], fileArray.slice(1))
            .subscribe(function (attachment) {
            _this.dataStore.attachments.push(attachment);
        }, function (e) {
            console.log(e);
        }, function () {
            console.log("file loading completed!!!");
        });
    };
    AttachmentStore.prototype.processFiles = function (file, fileArray) {
        var _this = this;
        if (fileArray.length > 0) {
            return this.processFiles(fileArray.slice(0, 1)[0], fileArray.slice(1))
                .flatMap(function (attachment) {
                _this.dataStore.attachments.push(attachment);
                return _this.fileReaderObs(file, _this.uploaderService);
            });
        }
        else {
            return this.fileReaderObs(file, this.uploaderService);
        }
    };
    AttachmentStore.prototype.fileReaderObs = function (file, uploaderService) {
        var reader = new FileReader();
        var fileReaderObs = Observable_1.Observable.create(function (observer) {
            reader.onprogress = function (evt) {
                if (evt.lengthComputable) {
                    var percentLoaded = Math.round((evt.loaded / evt.total) * 50);
                    if (percentLoaded < 80) {
                        uploaderService.progress.next(percentLoaded);
                    }
                }
            };
            reader.onloadstart = function (e) {
                uploaderService.visible.next(1);
                uploaderService.progress.next(0);
            };
            reader.onload = function () {
                var data = btoa(reader.result);
                var attachment = {
                    id: 0,
                    name: file.name,
                    data: data,
                    size: uploaderService.formatBytes(data.length, 0)
                };
                uploaderService.saveToDatabase(attachment);
                observer.next(attachment);
                observer.complete();
                uploaderService.visible.next(0);
            };
        });
        reader.readAsBinaryString(file);
        return fileReaderObs;
    };
    AttachmentStore = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [attachment_backend_service_1.AttachmentBackendService, UploaderService])
    ], AttachmentStore);
    return AttachmentStore;
}());
exports.AttachmentStore = AttachmentStore;
//# sourceMappingURL=attachment.store.js.map