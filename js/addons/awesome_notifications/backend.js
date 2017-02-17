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

        var params = {
            'dismissQueue': true,
            // 'maxVisible': 1,
            // 'killer': true,
            'timeout': 3000,
            'animation': {
                'open': 'animated ' + easeIn,
                'close': 'animated ' + easeOut, // Animate.css class names
                'easing': 'swing', // unavailable - no need
                'speed': 200 // unavailable - no need
            },
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

        $.ceNotification('show', {
            type: type || 'W',
            title: "Preview",
            message: "Work so hard, reminiscin' bout the old days",
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
        // (some of) your code goes here
    });

}(Tygh, Tygh.$));
