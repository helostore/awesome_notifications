(function(_, $) {

    /*
     *
     * Notifications
     *
     */
    (function($) {

        var container;
        var timers = {};
        var delay = 0;

        function _duplicateNotification(key)
        {
            var dups = $('div[data-ca-notification-key=' + key + ']');
            if (dups.length) {

                if (!_addToDialog(dups)) {
                    dups.fadeTo('fast', 0.5).fadeTo('fast', 1).fadeTo('fast', 0.5).fadeTo('fast', 1);
                }

                // Restart autoclose timer
                if (timers[key]) {
                    clearTimeout(timers[key]);
                    methods.close(dups, true);
                }

                return true;
            }

            return false;
        }

        function _closeNotification(notification)
        {
            if (notification.find('.cm-notification-close-ajax').length) {
                $.ceAjax('request', fn_url('notifications.close?notification_id=' + notification.data('caNotificationKey')), {
                    hidden: true
                });
            }

            notification.fadeOut('fast', function() {
                notification.remove();
            });

            if (notification.hasClass('cm-notification-content-extended')) {
                var overlay = $('.ui-widget-overlay[data-ca-notification-key=' + notification.data('caNotificationKey') + ']');
                if (overlay.length) {
                    overlay.fadeOut('fast', function() {
                        overlay.remove();
                    });
                }
            }

            if($(".ui-dialog").is(':visible') == false) {
                $('html').removeClass('dialog-is-open');
            }

        }

        function _processTranslation(text)
        {
            if (_.live_editor_mode && text.indexOf('[lang') != -1) {
                text = '<var class="live-edit-wrap"><i class="cm-icon-live-edit icon-live-edit ty-icon-live-edit"></i><var class="cm-live-edit live-edit-item" data-ca-live-edit="langvar::' + text.substring(text.indexOf('=') + 1, text.indexOf(']')) + '">' + text.substring(text.indexOf(']') + 1, text.lastIndexOf('[')) + '</var></var>';
            }

            return text;
        }

        function _pickFromDialog(event) {
            var nt = $('.cm-notification-content', $(event.target));
            if (nt.length) {
                if (!_addToDialog(nt)) {
                    container.append(nt);
                }
            }
            return true;
        }

        function _addToDialog(notification)
        {
            var dlg = $.ceDialog('get_last');
            if (dlg.length) {
                $('.object-container', dlg).prepend(notification);
                dlg.off('dialogclose', _pickFromDialog);
                dlg.on('dialogclose', _pickFromDialog);
                return true;
            }
            return false;
        }

        var methods = {
            show: function (data, key)
            {
                console.log('custom show()', data, key);

                if (!key) {
                    key = $.crc32(data.message);
                }

                if (typeof(data.message) == 'undefined') {
                    return false;
                }

                if (_duplicateNotification(key)) {
                    return true;
                }

                data.message = _processTranslation(data.message);
                data.title = _processTranslation(data.title);

                // Popup message in the screen center - should be only one at time
                if (data.type == 'I') {
                    var w = $.getWindowSizes();

                    $('.cm-notification-content.cm-notification-content-extended').each(function() {
                        methods.close($(this), false);
                    });

                    $(_.body).append(
                        '<div class="ui-widget-overlay" style="z-index:1010" data-ca-notification-key="' + key + '"></div>'
                    );

                    var notification = $('<div class="cm-notification-content cm-notification-content-extended notification-content-extended ' + (data.message_state == "I" ? ' cm-auto-hide' : '') + '" data-ca-notification-key="' + key + '">' +
                        '<h1>' + data.title + '<span class="cm-notification-close close"></span></h1>' +
                        '<div class="notification-body-extended">' +
                        data.message +
                        '</div>' +
                        '</div>');

                    var notificationMaxHeight = w.view_height - 300;

                    $(notification).find('.cm-notification-max-height').css({
                        'max-height': notificationMaxHeight
                    });

                    // FIXME I-type notifications are embedded directly into the body and not into a container, because a container has low z-index and get overlapped by modal dialogs.
                    $(_.body).append(notification);
                    notification.css('top', w.view_height / 2 - (notification.height() / 2));

                } else {
                    var n_class = 'alert';
                    var b_class = '';
                    var type = 'notification';

                    if (data.type == 'N') {
                        n_class += ' alert-success';
                        type = 'success';
                    } else if (data.type == 'W') {
                        n_class += ' alert-warning';
                        type = 'warning';
                    } else if (data.type == 'S') {
                        n_class += ' alert-info';
                        type = 'information';
                    } else {
                        n_class += ' alert-error';
                        type = 'error';
                    }


                    var timeout = false;
                    if (data.message_state == 'I') {
                        n_class += ' cm-auto-hide';
                        timeout = delay;
                    } else if (data.message_state == 'S') {
                        b_class += ' cm-notification-close-ajax';
                    }






                    var notificationObject = container.noty({
                        'text': data.message,
                        'type': type,
                        'progressBar': true,
                        'theme': 'metroui',
                        'timeout': timeout,
                        'force': true,
                        'animation': {
                            'open': 'animated bounceInRight', // Animate.css class names
                            'close': 'animated bounceOutRight', // Animate.css class names
                            'easing': 'swing', // unavailable - no need
                            'speed': 200 // unavailable - no need
                        }
                    });

                    // console.log(notification);
                    // notification.data('caNotificationKey', key);






                    // var notification = $('<div class="cm-notification-content notification-content ' + n_class + '" data-ca-notification-key="' + key + '">' +
                    //     '<button type="button" class="close cm-notification-close ' + b_class + '" data-dismiss="alert">×</button>' +
                    //     '<strong>' + data.title + '</strong>' + data.message +
                    //     '</div>');

                    // if (!_addToDialog(notification)) {
                    //     container.append(notification);
                    // }
                }

                // $.ceEvent('trigger', 'ce.notificationshow', [notification]);

                if (data.message_state == 'I') {
                    // methods.close(notification, true);
                }
            },

            showMany: function(data)
            {
                for (var key in data) {
                    methods.show(data[key], key);
                }
            },

            closeAll: function()
            {
                container.find('.cm-notification-content').each(function() {
                    var self = $(this);
                    if (!self.hasClass('cm-notification-close-ajax')) {
                        methods.close(self, false);
                    }
                })
            },

            close: function(notification, delayed)
            {
                if (delayed == true) {
                    if (delay === 0) { // do not auto-close
                        return true;
                    }

                    timers[notification.data('caNotificationKey')] = setTimeout(function(){
                        methods.close(notification, false);
                    }, delay);

                    return true;
                }

                _closeNotification(notification);
            },

            init: function()
            {
                delay = _.notice_displaying_time * 1000;
                container = $('.cm-notification-container');

                $(_.doc).on('click', '.cm-notification-close', function() {
                    methods.close($(this).parents('.cm-notification-content:first'), false);
                })

                container.find('.cm-auto-hide').each(function() {
                    methods.close($(this), true);
                });
            }
        };


        $.ceNotification = function(method) {
            if (methods[method]) {
                return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
            } else {
                $.error('ty.notification: method ' +  method + ' does not exist');
            }
        };

    }($));



    $(document).ready(function(){

        if (typeof(awesomeNotifications) != 'undefined') {
            $.ceNotification('showMany', awesomeNotifications);
        }
        // (some of) your code goes here
/*

        $.ceNotification('show', {
            type: 'N',
            title: "Notice",
            message: "Suck a cock. Just for a few seconds.",
            message_state: 'I'
        });
        $.ceNotification('show', {
            type: 'N',
            title: "Notice",
            message: "Suck a cock, forever.",
            message_state: 'K'
        });
        $.ceNotification('show', {
            type: 'S',
            title: "Info",
            message: "You may suck a cock. Why not, right?",
            message_state: 'I'
        });
        $.ceNotification('show', {
            type: 'W',
            title: "Warning",
            message: "You cannot not suck a cock!",
            message_state: 'I'
        });
        $.ceNotification('show', {
            type: 'E',
            title: "Error",
            message: "You cannot not suck a cock!",
            message_state: 'I'
        });
*/

    });

}(Tygh, Tygh.$));
