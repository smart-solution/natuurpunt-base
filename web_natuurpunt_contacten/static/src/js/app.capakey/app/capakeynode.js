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
var CapakeyNodeComponent = (function () {
    function CapakeyNodeComponent() {
    }
    CapakeyNodeComponent.prototype.ngOnInit = function () { };
    return CapakeyNodeComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], CapakeyNodeComponent.prototype, "node", void 0);
CapakeyNodeComponent = __decorate([
    core_1.Component({
        selector: 'capakey-node',
        template: "\n  <ul>\n    <li *ngFor=\"let node of node.children\">\n      <div [ngClass]=\"node.children.length > 0 ? 'tree': 'endtree'\">\n      {{node.name}}:{{node.value}}</div>\n      <capakey-node [node]=\"node\"></capakey-node>\n    </li>\n  </ul>",
        styles: [".clt, {\n              font-family: sans-serif;\n              position: relative;\n            }\n            .endtree {\n              text-indent: 0em;\n            }\n            .tree {\n              border-left: .2em solid gray;\n              border-bottom: .2em solid gray;\n              position: relative;\n              left: -1.3em;\n              height: 3em;\n              width: 2em;\n            }\n            ul ul {\n              margin-top: -1em;\n              list-style-type: none;\n            }\n            li {\n              list-style-type: none;\n              font-family: sans-serif;\n              position: relative;\n              bottom: -0.4em;\n              text-indent: 1em;\n            }\n            li:after {\n              content: '';\n              width: 1em;\n              height: 1em;\n              position: absolute;\n              background: salmon;\n              border: .125em solid white;\n              top: -0.1em;\n              left: -1.9em;\n            }\n"]
    })
], CapakeyNodeComponent);
exports.CapakeyNodeComponent = CapakeyNodeComponent;
//# sourceMappingURL=capakeynode.js.map