{
    'name': 'web extend for natuurpunt contacten',
    'category': 'Hidden',    
    'author' : 'Natuurpunt (joeri.belis@natuurpunt.be)',
    'description':"""
OpenERP Web module
===========================
removes sidebar section for natuurpunt contacten
custom IBAN account number format 
dialog resize

""",
    'version': '1.0',
    'depends': ['web'],
    'js': [
        'static/lib/node_modules/core-js/client/shim.min.js',
        'static/lib/node_modules/zone.js/dist/zone.js',
        'static/lib/node_modules/reflect-metadata/Reflect.js',
        'static/lib/node_modules/systemjs/dist/system.src.js',
        'static/src/js/systemjs.config.js',

        'static/src/js/base_web_natuurpunt_contacten.js'],

    'css': ['static/src/css/web_dialog_size.css',
            'static/src/css/font-awesome.min.css'],
    'qweb': ['static/src/xml/uploader_template.xml',
             'static/src/xml/dropoff_template.xml',
             'static/src/xml/email_template.xml'],
    'auto_install': False,
}
