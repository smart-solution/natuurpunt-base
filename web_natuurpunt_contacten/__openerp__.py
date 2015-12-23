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
    'depends': [],
    'js': ['static/*/*.js', 'static/*/js/*.js'],
    'css': ['static/css/web_dialog_size.css'],
    'auto_install': False,
    'web_preload': False,
}
