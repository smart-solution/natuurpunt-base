/*---------------------------------------------------------
 * removes advanced filter section for natuurpunt contacten
 * format IBAN account numbers - override _format / format_value
 * dialog resizer
 *---------------------------------------------------------*/

openerp.web_natuurpunt_contacten = function(instance) {

// here you may tweak globals object, if any, and play with on_* or do_* callbacks on them

   var account_number_format = function (value) {return value.replace(/[^\dA-Z]/g, '').replace(/(.{4})/g, '$1 ').trim()};

   instance.web.form.NatuurpuntAttachments = instance.web.form.FieldChar.extend({
       template: "NatuurpuntAttachments",
       init: function (view, code) {
           this._super.apply(this,arguments);
       },
       start: function() {
           this._super();
           System.import('app/main')
               .then((module) => { module.main(instance); })
               .catch(function(err){ console.error(err); });
           console.log("app loaded " + instance);
       }
   });
   instance.web.form.widgets.add('natuurpunt_attachments', 'instance.web.form.NatuurpuntAttachments');

   instance.web.form.NatuurpuntAlfrescoDropoff = instance.web.form.FieldChar.extend({
       template: "NatuurpuntAlfrescoDropoff",
       init: function (view, code) {
           this._super.apply(this,arguments);
       },
       start: function() {
           this._super();
           System.import('app.alfresco.dropoff/main')
               .then((module) => { module.main(instance); })
               .catch(function(err){ console.error(err); });
       }
   });
   instance.web.form.widgets.add('natuurpunt_alfresco_dropoff', 'instance.web.form.NatuurpuntAlfrescoDropoff');   

   instance.web.form.NatuurpuntEmail = instance.web.form.FieldChar.extend({
       template: "NatuurpuntEmail",
       init: function (view, code) {
           this._super.apply(this,arguments);
       },
       start: function() {
           this._super();
           System.import('app.email/main')
               .then((module) => { module.main(instance); })
               .catch(function(err){ console.error(err); });
       }
   });
   instance.web.form.widgets.add('natuurpunt_email', 'instance.web.form.NatuurpuntEmail');

   instance.web.form.NatuurpuntCapakey = instance.web.form.FieldChar.extend({
       template: "NatuurpuntCapakey",
       init: function (view, code) {
           this._super.apply(this,arguments);
       },
       start: function() {
           this._super();
           System.import('app.capakey/main')
               .then((module) => { module.main(instance); })
               .catch(function(err){ console.error(err); });
       }
   });
   instance.web.form.widgets.add('natuurpunt_capakey', 'instance.web.form.NatuurpuntCapakey');

   instance.web.form.NatuurpuntGeopunt = instance.web.form.FieldChar.extend({
       template: "NatuurpuntGeopunt",
       init: function (view, code) {
           this._super.apply(this,arguments);
       },
       start: function() {
           this._super();
           System.import('app.geopunt/main')
               .then((module) => { module.main(instance); })
               .catch(function(err){ console.error(err); });
       }
   });
   instance.web.form.widgets.add('natuurpunt_geopunt', 'instance.web.form.NatuurpuntGeopunt');

   instance.web.search.CustomFilters.include({
        append_filter: function(filter) {
            this._super.apply(this,arguments);
            // remove delete from public filters
            this.$el.find("ul li.oe_searchview_custom_public a").unbind().empty();
        },
    });
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
        parse_value: function (val, def) {
            if(this.name == "product_qty" && val && val.indexOf('-') > -1) {
                throw new Error(_.str.sprintf(_t("'%s' is not a correct float for product_qty"), value));
            }
            else {
                return instance.web.parse_value(val, this, def);
            }
        },
		format_value: function (val, def) {
            if(this.name == "attachment_ids" && val) {
                val = val;
            }
			if(this.name == "acc_number" && val) {
			    val = account_number_format(val);
			}		    		
			return this._super.apply(this, arguments);
        },
    });
    instance.web.Dialog.include({
        open: function () {
            this.dialog_options.width = 1900
            this._super();
            var self = this;
            this.$extendbutton = $('<a href="#" class="dialog_button_extend"><span class="ui-icon ui-icon-plusthick">+</span>');
            this.$restorebutton = $('<a href="#" class="dialog_button_restore"><span class="ui-icon ui-icon-minusthick">-</span>');

            var dialog = this.$el.dialog("widget");
            dialog.find(".ui-dialog-title").after(this.$extendbutton).after(this.$restorebutton);
            dialog.on("click", "a.dialog_button_extend", {
               max_height: this.dialog_options.max_height
            }, self._extending);
            dialog.on("click", "a.dialog_button_restore", {
               width: dialog.width(),
               left: dialog.offset().left
            }, self._restore);
            dialog.find(".dialog_button_restore").addClass("dialog_button_hide");
            return this;
        },

        _extending: function(event) {
            var self = this;
            var wWidth = $(window).width() - 25;
            var dialog = $(this).closest(".ui-dialog");
            dialog.animate({
                left: 0,
                width: wWidth,
                height: "auto" ,
            }, 100);
            var content = dialog.find(".ui-dialog-content");
            content.width("auto");
            content.height(event.data.max_height);
            $(this).addClass('dialog_button_hide');
            $(this).prev().removeClass('dialog_button_hide');
        },

        _restore: function(event) {
            var self = this;
            var dialog = $(this).closest(".ui-dialog");
            dialog.animate({
                left: event.data.left,
                width: event.data.width,
            }, 100);
            var content = dialog.find(".ui-dialog-content");
            content.width("auto");
            content.height("auto");
            $(this).addClass('dialog_button_hide');
            $(this).next().removeClass('dialog_button_hide');
        },

    });

};

// vim:et fdc=0 fdl=0:
