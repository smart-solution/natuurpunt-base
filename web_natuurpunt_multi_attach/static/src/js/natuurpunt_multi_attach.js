/*global openerp, _, $ */

openerp.web_natuurpunt_multi_attach = function (session) {
    var QWeb = session.web.qweb;
    var _t  = session.web._t;

    session.web.Sidebar.include({

        on_attachment_changed: function (event) {
            var self = this;
            var session_id = this.session.session_id
            this.$el.find('form.oe_form_binary_form').bind('submit', function (e, data) {
                 var form = e.currentTarget;
                 var multipleFiles = form.querySelector('input[type=file]');
                 
                 if (multipleFiles.files.length > 1) {
                     var callback = form.querySelector('input[name=callback]').defaultValue;
                     var model = form.querySelector('input[name=model]').defaultValue;
                     var id = form.querySelector('input[name=id]').defaultValue
                     const slicedFileList = Object.keys(multipleFiles.files)
                           .slice(0,multipleFiles.files.length - 1)
                           .reduce((result, key) => {
                             result[key] = multipleFiles.files[key];
                             return result;
                            }, {});
                     _.each(slicedFileList, function(file){
                         var queryData = new FormData();
                         queryData.append('session_id', session_id);
                         queryData.append('callback', callback);
                         queryData.append('ufile', file);
                         queryData.append('model', model);
                         queryData.append('id', id);
                         var request = new XMLHttpRequest();
                         request.onreadystatechange = function(e) {
                           if (request.readyState === 4) {
                             if (request.status === 200) {
                             // Code here for the server answer when successful
                                 console.log(file.name);
                             } else {
                             // Code here for the server answer when not successful
                             }
                           }
                         };
                         // do the request using form info
                         request.open(form.method, form.action);
                         // want to distinguish from non-JS submits?
                         request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
                         request.send(queryData);
                     });
                 }
            });
            self._super(event);
        },
    });
}
