var packages = {
  "rxjs": { defaultExtension: "js" },
  "angular2-in-memory-web-api": { defaultExtension: "js" },
  "app": { defaultExtension: "js" },
  "app.email": { defaultExtension: "js" },
  "app.alfresco.dropoff": { defaultExtension: "js" },
  "app.capakey": { defaultExtension: "js" },
  "app.geopunt": { defaultExtension: "js" },
};

// Tell Angular how normalize path and package aliases.
 var map = {
     'rxjs/observable/fromPromise': 'npm:rxjs/bundles/Rx.js',
     'rxjs/operator/toPromise': 'npm:rxjs/bundles/Rx.js',	 
     '@angular/core': 'npm:@angular/core/bundles/core.umd.js',
     '@angular/common': 'npm:@angular/common/bundles/common.umd.js',
     '@angular/compiler': 'npm:@angular/compiler/bundles/compiler.umd.js',
     '@angular/platform-browser': 'npm:@angular/platform-browser/bundles/platform-browser.umd.js',
     '@angular/platform-browser-dynamic': 'npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
     '@angular/http': 'npm:@angular/http/bundles/http.umd.js',
     '@angular/forms': 'npm:@angular/forms/bundles/forms.umd.js',

	 'angular2-in-memory-web-api': 'npm:angular2-in-memory-web-api',
     'ng2-completer': 'npm:ng2-completer/ng2-completer.umd.js',

     'rxjs/Observable': 'npm:rxjs/bundles/Rx.min.js',
     'rxjs/BehaviorSubject': 'npm:rxjs/bundles/Rx.min.js',
     'rxjs/Subject': 'npm:rxjs/bundles/Rx.min.js',
     'rxjs/AsyncSubject': 'npm:rxjs/bundles/Rx.min.js',
     'rxjs/add/operator/mergeMap': 'npm:rxjs/bundles/Rx.min.js',
     'rxjs/add/observable/from': 'npm:rxjs/bundles/Rx.min.js',
     'rxjs/add/observable/of': 'npm:rxjs/bundles/Rx.min.js',
     'rxjs/add/observable/forkJoin': 'npm:rxjs/bundles/Rx.min.js',
	 'rxjs': 'npm:rxjs',
	 
	 'app': './web_natuurpunt_contacten/static/src/js/app',
     'app.alfresco.dropoff': './web_natuurpunt_contacten/static/src/js/app.alfresco.dropoff',
     'app.email': './web_natuurpunt_contacten/static/src/js/app.email',
     'app.capakey': './web_natuurpunt_contacten/static/src/js/app.capakey',
     'app.geopunt': './web_natuurpunt_contacten/static/src/js/app.geopunt',
 };

var packageNames = [
  '@angular/common',
  '@angular/compiler',
  '@angular/core', // <--------
  '@angular/platform-browser',
  '@angular/platform-browser-dynamic',
];

var config = {
  paths: {
    "npm:": "web_natuurpunt_contacten/static/lib/node_modules/",
  },
  map: map,
  packages: packages
}
System.config(config);
