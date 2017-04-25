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
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var emaildataservice_1 = require("./emaildataservice");
var emailbackendservice_1 = require("./emailbackendservice");
var Subject_1 = require("rxjs/Subject");
var AppComponent = (function () {
    function AppComponent(emailBackendService) {
        this.emailBackendService = emailBackendService;
        this.selected = [];
        this.stringify = new Subject_1.Subject();
        this.dataService = new emaildataservice_1.EmailAutocompleteDataService(emailBackendService);
    }
    AppComponent.prototype.validateEmail = function (emailAddress) {
        var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/;
        if (emailAddress.match(mailformat))
            return true;
        else
            return false;
    };
    AppComponent.prototype.isBlank = function (selected) {
        return /^\s*$/.test(selected);
    };
    AppComponent.prototype.pushSelected = function (partner) {
        this.selected.push(partner);
        this.stringify.next(JSON.stringify(this.selected));
    };
    AppComponent.prototype.onEmailSelected = function (selected) {
        if (selected && !this.isBlank(selected.title)) {
            // selected from openerp database?
            if (selected.originalObject && selected.originalObject.email) {
                var partner = {
                    id: selected.originalObject.id,
                    email: selected.originalObject.email,
                    name: selected.originalObject.name,
                    value: selected.title.replace(/\[.*\]/, "").trim() // remove id for readabilty
                };
                this.pushSelected(partner);
            }
            else {
                var value = selected.title.trim();
                if (this.validateEmail(value)) {
                    var partner = {
                        email: value,
                        value: value
                    };
                    this.pushSelected(partner);
                }
                else
                    alert("You have entered an invalid email address!");
            }
        }
    };
    AppComponent.prototype.remove = function (item) {
        this.selected.splice(this.selected.indexOf(item), 1);
        this.stringify.next(JSON.stringify(this.selected));
    };
    return AppComponent;
}());
AppComponent = __decorate([
    core_1.Component({
        selector: 'email',
        template: "<input type=\"hidden\" [attr.value]=\"stringify | async\">\n             <ng2-completer\n                           (selected)=\"onEmailSelected($event)\"\n                           [datasource]=\"dataService\"\n                           [minSearchLength]=\"3\"\n                           [clearSelected]=\"true\"\n                           [overrideSuggested]=\"true\"></ng2-completer>\n             <div *ngFor=\"let item of selected\">\n              <div class=\"selected\">\n                  <span>{{item.value}}</span>\n                  <a (click)=\"remove(item)\"><font color=\"blue\">x</font></a>\n              </div>\n            </div>\n            ",
        styles: ["\n    .selected{\n    \tborder:solid #4CAF50 1px;\n    \tfloat:left;\n    \tmargin:2px;\n    \tpadding:2px 15px;\n    }\n    .completer-input {\n      width: 50%\n    }\n    .completer-dropdown {\n        width: 680px !important;\n    }\n    .selected a{\n    \tcursor:pointer;\n    \tfont-weight:bold;}\n    "]
    }),
    __metadata("design:paramtypes", [emailbackendservice_1.EmailBackendService])
], AppComponent);
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map