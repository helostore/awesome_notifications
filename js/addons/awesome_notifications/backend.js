// var awesomeNotificationsQueue = [];
// var awesomeNotificationsQueueTimeout = 0;
// var awesomeNotificationsQueueTimeoutId = null;

function AwesomeNotificationsPreviewer () {
    this.queue = [];
    this.timeout = 0;
    this.timeoutId = null;
    this.getInfo = function() {
        return this.color + ' ' + this.type + ' apple';
    };

    this.delete = function (notification) {
        for (var i in this.queue) {
            var n = this.queue[i];
            if (n == notification) {
                this.queue.splice(i, 1);
            }
        }
    };
    this.push = function (notification) {
        this.queue.push(notification);
    };
    this.previewAll = function (clickedElement) {
        var self = this;
        if ( self.queue.length == 0 || self.timeout > 4000 ) {
            self.timeout = 0;
        } else {
            if (self.timeoutId !== null) {
                return false;
            }
            $.noty.closeAll();

            var delay = 100;
            self.timeout += delay;
            self.timeoutId = setTimeout(function() {
                self.timeoutId = null;
                self.previewAll(clickedElement);
            }, delay );
            return false;
        }

        $.noty.closeAll();
        $.noty.clearQueue();
        var types = ['S', 'N', 'W', 'E'];
        for (var i in types) {
            var type = types[i];
            setTimeout(self.preview.bind(self, clickedElement, type), i * 100);
        }
    };
    this.preview = function (clickedElement, type) {
        var self = this;
        var $clickedElement = $(clickedElement);
        var $form = $clickedElement.closest('form');
        var easeIn = $form.find(':input[id*="ease_in"]').val();
        var easeOut = $form.find(':input[id*="ease_out"]').val();
        var theme = $form.find(':input[id*="_theme"]').val();

        var params = {
            'dismissQueue': true,
            // 'maxVisible': 1,
            // 'killer': true,
            'timeout': 3000,
            // 'timeout': false,
            'animation': {
                'open': 'animated ' + easeIn,
                'close': 'animated ' + easeOut, // Animate.css class names
                'easing': 'swing', // unavailable - no need
                'speed': 200 // unavailable - no need
            },
            'customTheme': {
                'info': {
                    'backgroundColor': $form.find(':input[id="addon_option_awesome_notifications_info_background_color"]').val(),
                    'textColor': $form.find(':input[id="addon_option_awesome_notifications_info_text_color"]').val()
                },
                'warning': {
                    'backgroundColor': $form.find(':input[id="addon_option_awesome_notifications_warning_background_color"]').val(),
                    'textColor': $form.find(':input[id="addon_option_awesome_notifications_warning_text_color"]').val()
                },
                'success': {
                    'backgroundColor': $form.find(':input[id="addon_option_awesome_notifications_success_background_color"]').val(),
                    'textColor': $form.find(':input[id="addon_option_awesome_notifications_success_text_color"]').val()
                },
                'error': {
                    'backgroundColor': $form.find(':input[id="addon_option_awesome_notifications_error_background_color"]').val(),
                    'textColor': $form.find(':input[id="addon_option_awesome_notifications_error_text_color"]').val()
                }
            },
            theme: theme,
            'previewer': self,
            'callback': {
                'beforeShow': function () {
                    var previewer = null;
                    previewer = this.previewer || previewer;
                    previewer = (this.options && this.options.previewer) ?  this.options.previewer : previewer;
                    if (previewer) {
                        previewer.push(this);
                    } else {
                        console.error('Previewer not found: ', this);
                    }
                },
                'afterClose': function () {
                    var previewer = null;
                    previewer = this.previewer || previewer;
                    previewer = (this.options && this.options.previewer) ?  this.options.previewer : previewer;
                    if (previewer) {
                        previewer.delete(this);
                    } else {
                        console.error('Previewer not found: ', this);
                    }
                }
            }
        };

        var title = '';
        var message = "Work so hard, reminiscin' bout the old days";
        if (type === 'N') {
            title = "Success";
            message = "Congratulations for getting rid of those ugly fugly default notifications!";
        } else if (type === 'W') {
            title = "Warning";
            message = "Choose your effects smartly - you don't want to steal too much focus of your customers.";
        } else if (type === 'S') {
            title = "Info";
            message = "Go ahead in choose your entrance/exit effects for your new awesome notifications.";
        } else {
            title = "Error";
            message = "Okay, okay, \"fugly\" is not a real word, but you get it!";
        }

        $.ceNotification('show', {
            type: type || 'W',
            title: title || "Preview",
            message: message,
            message_state: 'I'
        }, null, params);
    };
}

var awesomeNotificationsPreviewer = null;

function fn_awesome_notifications_preview_all(clickedElement) {
    awesomeNotificationsPreviewer = awesomeNotificationsPreviewer || new AwesomeNotificationsPreviewer();
    awesomeNotificationsPreviewer.previewAll(clickedElement);

    return true;
}


(function(_, $) {
    $(document).ready(function(){
        var $settings = $('#content_awesome_notifications_settings');
        if ($settings) {
            // $('#collapsable_addon_option_awesome_notifications_header_custom').css('overflow', 'visible');
            // Grab custom colors elements and transform them into pickers
            $settings.find('input[id*="color"]').data('caView', 'palette').addClass('cm-colorpicker');
        }
    });

}(Tygh, Tygh.$));
