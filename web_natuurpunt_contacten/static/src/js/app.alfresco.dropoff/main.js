"use strict";
var core_1 = require('@angular/core');
var platform_browser_dynamic_1 = require('@angular/platform-browser-dynamic');
var app_module_1 = require('./app.module');
if (String('<%= ENV %>') === 'prod') {
    core_1.enableProdMode();
}
// http://stackoverflow.com/questions/38948463/passing-server-parameters-to-ngmodule-after-rc5-upgrade
function main(instance) {
    platform_browser_dynamic_1.platformBrowserDynamic([{ provide: 'openerp', useValue: instance }])
        .bootstrapModule(app_module_1.AppModule);
}
exports.main = main;
//# sourceMappingURL=main.js.map