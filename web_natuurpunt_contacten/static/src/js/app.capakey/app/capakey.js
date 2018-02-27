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
var capakeybackendservice_1 = require("./capakeybackendservice");
var nodeservice_1 = require("./nodeservice");
var Subject_1 = require("rxjs/Subject");
var CapakeySearchComponent = (function () {
    function CapakeySearchComponent(capakeyBackendService, nodeService) {
        this.capakeyBackendService = capakeyBackendService;
        this.nodeService = nodeService;
        this.capakeyObs = new Subject_1.Subject();
    }
    CapakeySearchComponent.prototype.onFocus = function () { };
    CapakeySearchComponent.prototype.onSelected = function (selected) {
        if (selected) {
            this.capakey = this.nodeService.addSelectedToNode(selected);
            this.capakeyObs.next(this.capakey.value);
        }
    };
    CapakeySearchComponent.prototype.ngOnInit = function () {
        this.capakey = {
            foundCapakey: false,
            value: ''
        };
    };
    return CapakeySearchComponent;
}());
CapakeySearchComponent = __decorate([
    core_1.Component({
        selector: 'capakey-search',
        template: "<input type=\"hidden\" [attr.value]=\"capakeyObs | async\">\n             <ng2-completer\n                (selected)=\"onSelected($event)\"\n                (focus)=\"onFocus($event)\"\n                [autofocus]=\"true\"\n                [clearSelected]=\"true\"\n                [autoMatch]=\"this.nodeService.getAutoMatch()\"\n                [datasource]=\"capakeyBackendService\"\n                [minSearchLength]=\"this.nodeService.getSearchLenght()\"></ng2-completer>\n              <div>\n                <capakey-node [node]=this.nodeService.node></capakey-node>\n              </div>\n              <label><br><br><br>\n                <div *ngIf=\"this.capakey.foundCapakey == true\">\n                    <b>Capakey gevonden : {{this.capakey.value}}</b>\n                </div>\n                <div *ngIf=\"this.capakey.foundCapakey == false\">\n                    <b>Meerdere capakey mogelijkheden, verfijn verder met {{this.capakey.nextField}}</b>\n                </div>\n              </label>",
    }),
    __metadata("design:paramtypes", [capakeybackendservice_1.CapakeyBackendService,
        nodeservice_1.NodeService])
], CapakeySearchComponent);
exports.CapakeySearchComponent = CapakeySearchComponent;
//# sourceMappingURL=capakey.js.map