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
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var Subject_1 = require("rxjs/Subject");
var nodeservice_1 = require("./nodeservice");
var http_1 = require("@angular/http");
var GeopuntBackendService = (function (_super) {
    __extends(GeopuntBackendService, _super);
    function GeopuntBackendService(nodeService, http) {
        var _this = _super.call(this) || this;
        _this.nodeService = nodeService;
        _this.http = http;
        _this.api = "http://geoservices.informatievlaanderen.be/capakey/api/v1";
        return _this;
    }
    GeopuntBackendService.prototype.getMunicipality = function (path) {
        return this.http.get(this.api + path)
            .map(function (response) { return response.json(); });
    };
    GeopuntBackendService.prototype.getDepartment = function (path) {
        return this.http.get(this.api + path)
            .map(function (response) { return response.json(); });
    };
    GeopuntBackendService.prototype.getSection = function (path) {
        return this.http.get(this.api + path)
            .map(function (response) { return response.json(); });
    };
    GeopuntBackendService.prototype.getParcel = function (path) {
        return this.http.get(this.api + path)
            .map(function (response) { return response.json(); });
    };
    GeopuntBackendService.prototype.search = function (term) {
        var _this = this;
        switch (this.nodeService.getNodeName()) {
            case "Gemeente": {
                var path_1 = "/Municipality/";
                this.getMunicipality(path_1).subscribe(function (res) {
                    var data = res.municipalities.filter(function (m) { return m.municipalityName.startsWith(term); });
                    var matches = data.map(function (data) { return ({
                        title: data.municipalityName,
                        originalObject: path_1 + data.municipalityCode
                    }); });
                    _this.next(matches);
                }, function (e) {
                    console.log(e);
                }, function () {
                    console.log("search Municipality complete!!!");
                });
                break;
            }
            case "Afdeling": {
                var path_2 = this.nodeService.getPath() + "/department/";
                this.getDepartment(path_2).subscribe(function (res) {
                    var data = res.departments.map(function (d) { return ({
                        'departmentName': d.departmentName.substr(d.departmentName.indexOf(' ') + 1),
                        'departmentCode': d.departmentCode
                    }); }).filter(function (d) { return d.departmentName.startsWith(term); });
                    var matches = data.map(function (data) { return ({
                        title: data.departmentName,
                        originalObject: path_2 + data.departmentCode
                    }); });
                    _this.next(matches);
                }, function (e) {
                    console.log(e);
                }, function () {
                    console.log("search department complete!!!");
                });
                break;
            }
            case "Sectie": {
                var path_3 = this.nodeService.getPath() + "/section/";
                this.getSection(path_3).subscribe(function (res) {
                    var data = res.sections.filter(function (s) { return s.sectionCode.startsWith(term); });
                    var matches = data.map(function (data) { return ({
                        title: data.sectionCode,
                        originalObject: path_3 + data.sectionCode
                    }); });
                    _this.next(matches);
                }, function (e) {
                    console.log(e);
                }, function () {
                    console.log("search section complete!!!");
                });
                break;
            }
            case "Perceel": {
                var path = this.nodeService.getPath() + "/parcel/";
                this.getParcel(path).subscribe(function (res) {
                    var data = res.parcels.filter(function (p) { return p.perceelnummer.startsWith(term); });
                    var matches = data.map(function (data) { return ({
                        title: data.perceelnummer,
                        originalObject: data
                    }); });
                    _this.next(matches);
                }, function (e) {
                    console.log(e);
                }, function () {
                    console.log("search parcel complete!!!");
                });
                break;
            }
            default: {
                console.log("Invalid choice");
                break;
            }
        }
    };
    GeopuntBackendService.prototype.cancel = function () {
        // Handle cancel
    };
    return GeopuntBackendService;
}(Subject_1.Subject));
GeopuntBackendService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [nodeservice_1.NodeService, http_1.Http])
], GeopuntBackendService);
exports.GeopuntBackendService = GeopuntBackendService;
//# sourceMappingURL=geopuntbackendservice.js.map