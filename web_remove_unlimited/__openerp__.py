{
    'name': 'remove unlimited',
    'category': 'Hidden',
    'author': 'Joeri Belis',
    'description':"""
OpenERP Web module
===========================
removes unlimited pager option on res_partner list views

""",
    'version': '1.0',
    'depends': [],
    'js': ['static/*/*.js', 'static/*/js/*.js'],
    'css': [],
    'auto_install': False,
    'web_preload': False,
    'css': ['static/css/quickfilter.css'],
    'qweb': ['static/xml/searchview_filters.xml'],
}
