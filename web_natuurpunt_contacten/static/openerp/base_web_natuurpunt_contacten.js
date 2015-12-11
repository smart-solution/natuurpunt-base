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
    instance.web.Dialog.include({
        open: function () {
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
