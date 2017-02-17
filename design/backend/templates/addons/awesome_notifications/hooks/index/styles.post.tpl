{if $addons.awesome_notifications && $addons.awesome_notifications.use_in_backend == 'Y'}
    {style src="addons/awesome_notifications/fontello/css/awesomenotifications.css"}
    {style src="addons/awesome_notifications/animate.css"}
    {style src="addons/awesome_notifications/styles.less"}

    {* We call this in styles.post.tpl so it can run before the fn_get_notifications() in common/notifaction.tpl. fn_get_notifications() once called, removes the transient notifications *}
    {if !"AJAX_REQUEST"|defined}
        <script type="text/javascript">
            var awesomeNotifications = {json_encode(fn_get_notifications()) nofilter};
            var awesomeNotificationsConfig = {
                'animation': {
                    'open': 'animated {$addons.awesome_notifications.ease_in}',
                    'close': 'animated  {$addons.awesome_notifications.ease_out}',
                    'easing': 'swing', // unavailable - no need
                    'speed': 200 // unavailable - no need
                }
            };
        </script>
    {/if}
{/if}