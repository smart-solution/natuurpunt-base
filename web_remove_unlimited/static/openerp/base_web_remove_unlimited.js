/*---------------------------------------------------------
 * remove unlimited option on listview for res_partner
 *---------------------------------------------------------*/

openerp.web_remove_unlimited = function(instance) {

// here you may tweak globals object, if any, and play with on_* or do_* callbacks on them

    instance.web.ListView.include({
        init: function(parent, dataset, view_id, options) {
           var self = this;
           if (dataset.model=='res.partner'||dataset.model=='res.organisation.function') {
              this.defaults.selectable = false
           }
           else {
              this.defaults.selectable = true
           }
           var ret = this._super.apply(this, arguments);
        },
        load_list: function(data) {
            var self = this;
            var ret = this._super.apply(this, arguments); 
            if (this.dataset.model=='res.partner') {
              this.$pager.find('.oe_list_pager_state')
                    .click(function (e) {
                        e.stopPropagation();
                        var $this = $(this);

                        var $select = $('<select>')
                            .appendTo($this.empty())
                            .click(function (e) {e.stopPropagation();})
                            .append('<option value="80">80</option>' +
                                    '<option value="200">200</option>' +
                                    '<option value="500">500</option>' +
                                    '<option value="2000">2000</option>' +
                                    '<option value="5000">5000</option>' +
                                    '<option value="10000">10000</option>' +
                                    '<option value="15000">15000</option>')
                            .change(function () {
                                var val = parseInt($select.val(), 10);
                                self._limit = (isNaN(val) ? null : val);
                                self.page = 0;
                                self.reload_content();
                            }).blur(function() {
                                $(this).trigger('change');
                            })
                            .val(self._limit || 'NaN');
                    });
            }
            return ret;
        },
    });
};

// vim:et fdc=0 fdl=0:
