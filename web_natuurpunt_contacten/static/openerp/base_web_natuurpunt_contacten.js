/*---------------------------------------------------------
 * removes advanced filter section for natuurpunt contacten
 *---------------------------------------------------------*/

openerp.web_natuurpunt_contacten = function(instance) {

// here you may tweak globals object, if any, and play with on_* or do_* callbacks on them


   instance.web.SearchView.include({
        search_view_loaded: function(data) {
            var ret = this._super.apply(this, arguments);
            var self = this;
            if (this.dataset.context && _.has(this.dataset.context,"addressbook")) {
                console.log('Hiding advanced filter in addressbook');
                self.$('.oe_searchview_advanced').css("display", "none");
            }
            return ret;
        },
    });
};

// vim:et fdc=0 fdl=0:
