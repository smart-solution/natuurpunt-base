var packages = {
  "app": { main: "main.js",  defaultExtension: "js" },
  "rxjs": { defaultExtension: "js" },
  "angular2-in-memory-web-api": { defaultExtension: "js" },
};

// Tell Angular how normalize path and package aliases.
 var map = {
     '@angular/core': 'npm:@angular/core/bundles/core.umd.js',
     '@angular/common': 'npm:@angular/common/bundles/common.umd.js',
     '@angular/compiler': 'npm:@angular/compiler/bundles/compiler.umd.js',
     '@angular/platform-browser': 'npm:@angular/platform-browser/bundles/platform-browser.umd.js',
     '@angular/platform-browser-dynamic': 'npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
     'angular2-in-memory-web-api': 'npm:angular2-in-memory-web-api',
     'rxjs/Observable': 'npm:rxjs/bundles/Rx.min.js',
	 'rxjs/BehaviorSubject': 'npm:rxjs/bundles/Rx.min.js',
	 'rxjs/Subject': 'npm:rxjs/bundles/Rx.min.js',
	 'rxjs/AsyncSubject': 'npm:rxjs/bundles/Rx.min.js',
     'rxjs/add/operator/mergeMap': 'npm:rxjs/bundles/Rx.min.js',
     'rxjs/add/observable/from': 'npm:rxjs/bundles/Rx.min.js',
	 'rxjs/add/observable/of': 'npm:rxjs/bundles/Rx.min.js',
     'rxjs': 'npm:rxjs/bundles/Rx.min',

	 //"rxjs": "npm:rxjs/bundles/Rx.min",
     //"rxjs": "npm:rxjs",
     //"ts": "npm:plugin-typescript/lib/plugin.js",
     //"tsconfig.json": "tsconfig.json",
     //"typescript": "npm:typescript/lib/typescript.js",
     //"traceur": "npm:traceur/bin/traceur.js"
 };

var packageNames = [
  '@angular/common',
  '@angular/compiler',
  '@angular/core', // <--------
  '@angular/platform-browser',
  '@angular/platform-browser-dynamic',
];

packageNames.forEach(function(pkgName) {
  packages[pkgName] = { main: 'index.js', defaultExtension: 'js' };
});

var config = {
  defaultJSExtensions: true,
  paths: {
	"npm:": "web_natuurpunt_contacten/static/lib/node_modules/",
    "app/*":"./web_natuurpunt_contacten/static/src/js/app/*.js",
  },
  map: map,
  packages: packages
}
System.config(config);
