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
var Observable_1 = require("rxjs/Observable");
var attachment_store_1 = require('./attachment.store');
var attachment_store_2 = require('./attachment.store');
var AttachmentInputComponent = (function () {
    function AttachmentInputComponent(uploaderService) {
        this.uploaderService = uploaderService;
        this.multiple = true;
        this.onSelectAttachments = new core_1.EventEmitter();
    }
    AttachmentInputComponent.prototype.addFiles = function () {
        var fi = this.attachmentInput.nativeElement;
        if (fi.files.length == 0)
            return;
        var files = fi.files;
        this.onSelectAttachments.emit(files);
    };
    __decorate([
        core_1.ViewChild("attachmentInput"), 
        __metadata('design:type', Object)
    ], AttachmentInputComponent.prototype, "attachmentInput", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Observable_1.Observable)
    ], AttachmentInputComponent.prototype, "storeId", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], AttachmentInputComponent.prototype, "multiple", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], AttachmentInputComponent.prototype, "onSelectAttachments", void 0);
    AttachmentInputComponent = __decorate([
        core_1.Component({
            selector: 'attachmentinput',
            styles: ["\n    input[type=\"file\"] {\n        display: none;\n    }\n    .custom-file-upload {\n        border: 1px solid #ccc;\n        color: black;\n        background: #8bbe41;\n        display: inline-block;\n        padding: 6px 12px;\n        cursor: pointer;\n    }\n  "],
            template: "\n            <input type=\"hidden\" [attr.value]=\"uploaderService.storeId | async\">\n            <label for=\"file-upload\" class=\"custom-file-upload\">\n              <i class=\"fa fa-cloud-upload\"></i> Extra bijlages\n            </label>\n            <input #attachmentInput id=\"file-upload\"\n            type=\"file\" [attr.multiple]=\"multiple ? true : null\"\n            (change)=\"addFiles()\">\n            ",
        }), 
        __metadata('design:paramtypes', [attachment_store_2.UploaderService])
    ], AttachmentInputComponent);
    return AttachmentInputComponent;
}());
exports.AttachmentInputComponent = AttachmentInputComponent;
var AttachmentComponent = (function () {
    function AttachmentComponent(attachmentStore, uploaderService) {
        this.attachmentStore = attachmentStore;
        this.uploaderService = uploaderService;
    }
    AttachmentComponent.prototype.removeAttachment = function (index) {
        console.log(index);
        this.attachmentStore.removeFile(index);
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], AttachmentComponent.prototype, "attachment", void 0);
    AttachmentComponent = __decorate([
        core_1.Component({
            selector: 'attachments',
            template: "\n            <ul id=\"attachment-list\" style=\"list-style: none;\">\n            <li *ngFor=\"let attachment of attachmentStore.attachments | async; let i = index\">\n            <button (click)=\"removeAttachment(i)\">X</button>\n            <label>{{attachment.name}}</label>\n            <label>({{attachment.size}})</label>\n            </li>\n            </ul>\n            <progress-bar\n              [currentProgress]=\"uploaderService.progress\"\n              [visible]=\"uploaderService.visible\">\n            </progress-bar>\n            ",
        }), 
        __metadata('design:paramtypes', [attachment_store_1.AttachmentStore, attachment_store_2.UploaderService])
    ], AttachmentComponent);
    return AttachmentComponent;
}());
exports.AttachmentComponent = AttachmentComponent;
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
//# sourceMappingURL=attachments.component.js.map