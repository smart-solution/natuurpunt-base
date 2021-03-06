"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
var forms_1 = require("@angular/forms");
var app_component_1 = require("./app.component");
var ng2_completer_1 = require("ng2-completer");
var capakeybackendservice_1 = require("./capakeybackendservice");
var nodeservice_1 = require("./nodeservice");
var capakey_1 = require("./capakey");
var capakeynode_1 = require("./capakeynode");
var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    core_1.NgModule({
        imports: [
            platform_browser_1.BrowserModule,
            ng2_completer_1.Ng2CompleterModule,
            forms_1.FormsModule,
        ],
        declarations: [
            app_component_1.AppComponent,
            capakey_1.CapakeySearchComponent,
            capakeynode_1.CapakeyNodeComponent,
        ],
        providers: [
            capakeybackendservice_1.CapakeyBackendService,
            nodeservice_1.NodeService,
        ],
        bootstrap: [app_component_1.AppComponent]
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map