/*global openerp, _, $ */

openerp.web_natuurpunt_multi_attach = function (session) {
    var QWeb = session.web.qweb;
    var _t  = session.web._t;

    session.web.Sidebar.include({

        on_attachment_changed: function (event) {
            event.preventDefault();
            var self = this;
            var session_id = this.session.session_id
            this.$el.find('form.oe_form_binary_form').bind('submit', function (e, data) {
                 var form = e.currentTarget;
                 var multipleFiles = form.querySelector('input[type=file]');

                 // only if there is something to do ...
                 if (multipleFiles.files.length) {
                     var submit = form.querySelector('[type=file]');
                     var callback = form.querySelector('[name=callback]');
                     var model = form.querySelector('[name=model]');
                     var id = form.querySelector('[name=id]');
                     var request = new XMLHttpRequest();
                     var formData = Array.prototype.reduce.call(
                         multipleFiles.files,
                         function (formData, file, i) {
                            formData.append('callback', callback.defaultValue);
                            formData.append('model', model.defaultValue);
                            formData.append('id', id.defaultValue);
                            formData.append('session_id', session_id);
                            formData.append(multipleFiles.name + i, file);
                            return formData;
                         },
                         new FormData()
                     );
                 };
                 // avoid multiple repeated uploads
                 // (histeric clicks on slow connection)
                 submit.disabled = true;

                 request.onreadystatechange = function(e) {
                   if (request.readyState === 4) {
                     if (request.status === 200) {
                     // Code here for the server answer when successful
                         var response = jQuery.parseJSON(this.response);
                         $(window).trigger(callback.defaultValue,response);
                     } else {
                     // Code here for the server answer when not successful
                         console.log(e);
                     }
                   }
                 };

                 // do the request using form info
                 request.open(form.method, form.action);
                 // want to distinguish from non-JS submits?
                 request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
                 self.$('.oe_sidebar_add_attachment span').text(_t('Uploading...'));
                 request.send(formData);
            });
            self._super(event);
        },
    });
}
