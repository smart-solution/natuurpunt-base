/*---------------------------------------------------------
 * removes advanced filter section for natuurpunt contacten
 * format IBAN account numbers - override _format / format_value
 *---------------------------------------------------------*/

openerp.web_natuurpunt_contacten = function(instance) {

// here you may tweak globals object, if any, and play with on_* or do_* callbacks on them

   var account_number_format = function (value) {return value.replace(/[^\dA-Z]/g, '').replace(/(.{4})/g, '$1 ').trim()};

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
   instance.web.list.Column.include({
        _format: function (row_data, options) {
        	if(this.id == "acc_number") {
        	    row_data[this.id].value = account_number_format(row_data[this.id].value);
        	}
            return this._super.apply(this, arguments);
        },
    });
    instance.web.form.FieldChar.include({
		format_value: function (val, def) {
			if(this.name == "acc_number" && val) {
			    val = account_number_format(val);
			}		    		
			return this._super.apply(this, arguments);
        },
    });
};

// vim:et fdc=0 fdl=0:
