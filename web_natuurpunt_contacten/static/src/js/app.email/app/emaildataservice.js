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
Object.defineProperty(exports, "__esModule", { value: true });
var Subject_1 = require("rxjs/Subject");
var EmailAutocompleteDataService = (function (_super) {
    __extends(EmailAutocompleteDataService, _super);
    function EmailAutocompleteDataService(emailBackendService) {
        var _this = _super.call(this) || this;
        _this.emailBackendService = emailBackendService;
        return _this;
    }
    EmailAutocompleteDataService.prototype.search = function (term) {
        var _this = this;
        this.emailBackendService
            .searchEmail(term)
            .subscribe(function (valueArray) {
            var data = JSON.parse(valueArray[2].responseText).result;
            var matches = data.map(function (result) {
                return {
                    title: result.name,
                    originalObject: result
                };
            });
            _this.next(matches);
        }, function (e) {
            console.log(e);
        }, function () {
            console.log("search complete!!!");
        });
    };
    EmailAutocompleteDataService.prototype.cancel = function () {
        // Handle cancel
    };
    return EmailAutocompleteDataService;
}(Subject_1.Subject));
exports.EmailAutocompleteDataService = EmailAutocompleteDataService;
//# sourceMappingURL=emaildataservice.js.map