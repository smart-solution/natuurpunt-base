/*---------------------------------------------------------
 * custom email recipienst
 *---------------------------------------------------------*/

openerp.natuurpunt_mail = function(instance) {

// here you may tweak globals object, if any, and play with on_* or do_* callbacks on them

    var _t = instance.web._t;

    instance.mail.MessageCommon.include({
        init: function (parent, datasets, options) {
            this._super(parent, datasets, options);
            if (datasets.email_recipients) {
               var email_recipients = datasets.email_recipients.split(',') || false;
               this.email_to = email_recipients.slice(0,1);
               this.email_cc = email_recipients.slice(1); 
            } else {
               this.email_to = false;
               this.email_cc = false;
            }
        },
    });
};

// vim:et fdc=0 fdl=0:
