/*---------------------------------------------------------
 * remove unlimited option on listview for res_partner
 *---------------------------------------------------------*/

openerp.web_remove_unlimited = function(instance) {

// here you may tweak globals object, if any, and play with on_* or do_* callbacks on them

    var _t = instance.web._t;

    instance.web.search.Input.include({
        quick_filter: function () {
           if (this.attrs.context) {
              // preserve newlines, etc - use valid JSON
              s = this.attrs.context.replace(/\\n/g, "\\n")  
                   .replace(/\\'/g, "\\'")
                   .replace(/\'/g, '"')
                   .replace(/\\&/g, "\\&")
                   .replace(/\\r/g, "\\r")
                   .replace(/\\t/g, "\\t")
                   .replace(/\\b/g, "\\b")
                   .replace(/\\f/g, "\\f");
              // remove non-printable and other non-valid JSON chars
              s = s.replace(/[\u0000-\u0019]+/g,""); 
              var regex = /True/gi;
              // replace True => 1
              s = s.replace(regex, '1')
	      regex = /False/gi;
              s = s.replace(regex, '0')
              return JSON.parse(s).quick_filter;
           }
        },
        now: function () {
           var today = new Date();
           return today.toISOString().substring(0, 7);
        },
    });

    instance.web.search.FilterGroup.include({
            start: function () {
                var self = this
                this.$el.on('click', 'li', function(event){                   
                   event.stopPropagation();
                   self.toggle_filter(event);
                });
                return $.when(null);
            },
            toggle_filter: function (e) {
               if ($(e.target).is('li'))
                  if ($(e.target).is('.quickfilter')) {  
                     if ($(e.target).data('type') && $(e.target).data('type') == 'period') {
                       var self = this;
                       e.target.childNodes.forEach(function(currentValue, currentIndex, listObj){ 
                         //var period = currentValue.value.split("-").reverse().join("/");
                         var period = currentValue.value;
                         var domain = [new Array("period_id", "ilike", period)];
                         var advanced_filter = [];
                         advanced_filter.label = 'Periode bevat ' + period;
                         advanced_filter.value = domain;
                         var propositions = [advanced_filter];
                         self.view.query.add({
                           category: _t("Advanced"),
                           values: propositions,
                           field: {
                              get_context: function () { },
                              get_domain: function () { return domain;},
                              get_groupby: function () { }
                           }
                         });
                       });
	             } /* period */
                  } else this.toggle(this.filters[Number($(e.target).data('index'))]);
            },
    });

    instance.web.View.include({
	    init: function(parent, dataset, view_id, options) {
                var self = this;
                this._super.apply(this, arguments);
	    },

            /**
             * Fetches and executes the action identified by ``action_data``.
             *
             * @param {Object} action_data the action descriptor data
             * @param {String} action_data.name the action name, used to uniquely identify the action to find and execute it
             * @param {String} [action_data.special=null] special action handlers (currently: only ``'cancel'``)
             * @param {String} [action_data.type='workflow'] the action type, if present, one of ``'object'``, ``'action'`` or ``'workflow'``
             * @param {Object} [action_data.context=null] additional action context, to add to the current context
             * @param {instance.web.DataSet} dataset a dataset object used to communicate with the server
             * @param {Object} [record_id] the identifier of the object on which the action is to be applied
             * @param {Function} on_closed callback to execute when dialog is closed or when the action does not generate any result (no new action)
             */
            do_execute_action: function (action_data, dataset, record_id, on_closed) {
                var self = this;
                var result_handler = function () {
                    if (on_closed) { on_closed.apply(null, arguments); }
                    if (self.getParent() && self.getParent().on_action_executed) {
                        return self.getParent().on_action_executed.apply(null, arguments);
                    }
                };
                var context = new instance.web.CompoundContext(dataset.get_context(), action_data.context || {});
                var handler = function (action) {
                    if (action && action.constructor == Object) {
                        // simple client side template functionality
                        // replace string in domain that start with $
                        if (action.domain && typeof action.domain.map === 'function')
                            action.domain = action.domain.map(function (nested){
                               value = nested[2];
                               if (typeof value === 'string' || value instanceof String && value.startsWith('$')){
                                  var key = value.slice(1).toLowerCase();
                                  if (self.fields[key])
                                      nested.splice(2,2,Object.keys(self.fields[key].display_value)[0]);
                               }
                               return nested;
                            });
                        // filter out context keys that are specific to the current action.
                        // Wrong default_* and search_default_* values will no give the expected result
                        // Wrong group_by values will simply fail and forbid rendering of the destination view
                        var ncontext = new instance.web.CompoundContext(
                            _.object(_.reject(_.pairs(dataset.get_context().eval()), function(pair) {
                              return pair[0].match('^(?:(?:default_|search_default_).+|.+_view_ref|group_by|group_by_no_leaf|active_id|active_ids)$') !== null;
                            }))
                        );
                        ncontext.add(action_data.context || {});
                        ncontext.add({active_model: dataset.model});
                        if (record_id) {
                            ncontext.add({
                                active_id: record_id,
                                active_ids: [record_id],
                            });
                        }
                        ncontext.add(action.context || {});
                        action.context = ncontext;
                        return self.do_action(action, {
                            on_close: result_handler,
                        });
                    } else {
                        self.do_action({"type":"ir.actions.act_window_close"});
                        return result_handler();
                    }
                };
                if (action_data.special === 'cancel') {
                    return handler({"type":"ir.actions.act_window_close"});
                } else if (action_data.type=="object") {
                    var args = [[record_id]], additional_args = [];
                    if (action_data.args) {
                        try {
                            // Warning: quotes and double quotes problem due to json and xml clash
                            // Maybe we should force escaping in xml or do a better parse of the args array
                            additional_args = JSON.parse(action_data.args.replace(/'/g, '"'));
                            args = args.concat(additional_args);
                        } catch(e) {
                            console.error("Could not JSON.parse arguments", action_data.args);
                        }
                    }
                    args.push(context);
                    return dataset.call_button(action_data.name, args).then(handler).then(function () {
                        if (instance.webclient) {
                            instance.webclient.menu.do_reload_needaction();
                        }
                    });
                } else if (action_data.type=="action") {
                    return this.rpc('/web/action/load', {
                        action_id: action_data.name,
                        context: instance.web.pyeval.eval('context', context),
                        do_not_eval: true
                    }).then(handler);
                } else  {
                    return dataset.exec_workflow(record_id, action_data.name).then(handler);
                }
            },
    });

    instance.web.form.WidgetButton.include({
        init: function(field_manager, node) {
            var self = this;
            var ret = this._super.apply(this, arguments);
        },
        execute_action: function() {
            var self = this;
            var exec_action = function() {
                if (self.node.attrs.confirm) {
                    var def = $.Deferred();
                    var dialog = instance.web.dialog($('<div/>').text(self.node.attrs.confirm), {
                        title: _t('Confirm'),
                        modal: true,
                        buttons: [
                            {text: _t("Cancel"), click: function() {
                                    $(this).dialog("close");
                                }
                            },
                            {text: _t("Ok"), click: function() {
                                    var self2 = this;
                                    self.on_confirmed().always(function() {
                                        $(self2).dialog("close");
                                    });
                                }
                            }
                        ],
                        beforeClose: function() {
                            def.resolve();
                        },
                    });
                    return def.promise();
                } else {
                    return self.on_confirmed();
                }
            };
            if (!this.node.attrs.special) {
                if (this.node.attrs.name == 'redirect_to_purchase_order')
                    return exec_action();
                else
                    return this.view.recursive_save().then(exec_action);
            } else {
                return exec_action();
            }
        },
    });

    instance.web.Sidebar.include({
        init: function(parent) {
            var self = this;
            var ret = this._super.apply(this, arguments);
            $(window).on(this.fileupload_id, function() {
                var args = [].slice.call(arguments).slice(1);
                self.do_attachement_update(self.dataset, self.model_id,args);
                instance.web.unblockUI();
                if (self.dataset.model=='sale.order') {
                    self.getParent().reload();
                }
            });
        },
        on_attachment_delete: function(e) {
            e.preventDefault();
            e.stopPropagation();
            var self = this;
            var $e = $(e.currentTarget);
            if (confirm(_t("Do you really want to delete this attachment ?"))) {
                (new instance.web.DataSet(this, 'ir.attachment')).unlink([parseInt($e.attr('data-id'), 10)]).done(function() {
                    self.do_attachement_update(self.dataset, self.model_id);
                    if (self.dataset.model=='sale.order') {
                        self.getParent().reload();
                    }
                });
            }
        },
        add_items: function(section_code, items) {
            var self = this;
            if ((self.getParent().model != 'sale.order' || section_code != 'print') && items) {
                this.items[section_code].push.apply(this.items[section_code],items);
                this.redraw();
            }
        },
        remove_export: function() {
            if (this.items['other']) {
                var items_without_export = this.items['other'].filter(d => d.label != _t("Export"));
                this.items['other'] = items_without_export;
                this.redraw();
            }
        }
    });

    instance.web.ListView.include({
        init: function(parent, dataset, view_id, options) {
           var self = this;
           if (dataset.model=='res.organisation.function') {
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
              if ( this.sidebar )
                 this.sidebar.remove_export();
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
