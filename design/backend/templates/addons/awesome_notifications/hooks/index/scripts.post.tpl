{if $addons.awesome_notifications && $addons.awesome_notifications.use_in_backend == 'Y'}
    {script src="js/addons/awesome_notifications/node_modules/noty/js/noty/packaged/jquery.noty.packaged.min.js"}

    {script src="js/addons/awesome_notifications/themes/custom.js"}
    {script src="js/addons/awesome_notifications/themes/materialui.js"}
    {script src="js/addons/awesome_notifications/themes/metroui.js"}
    {script src="js/addons/awesome_notifications/themes/mint.js"}
    {script src="js/addons/awesome_notifications/themes/sunset.js"}

    {script src="js/addons/awesome_notifications/common.js"}
    {script src="js/addons/awesome_notifications/backend.js"}
    {if $addons.awesome_notifications.theme === 'custom'}
        <script type="text/javascript">
            var AN_INFO_BACKGROUND_COLOR = "{$addons.awesome_notifications.info_background_color|default:''}";
            var AN_INFO_TEXT_COLOR = "{$addons.awesome_notifications.info_text_color|default:''}";
            var AN_SUCCESS_BACKGROUND_COLOR = "{$addons.awesome_notifications.success_background_color|default:''}";
            var AN_SUCCESS_TEXT_COLOR = "{$addons.awesome_notifications.success_text_color|default:''}";
            var AN_WARNING_BACKGROUND_COLOR = "{$addons.awesome_notifications.warning_background_color|default:''}";
            var AN_WARNING_TEXT_COLOR = "{$addons.awesome_notifications.warning_text_color|default:''}";
            var AN_ERROR_BACKGROUND_COLOR = "{$addons.awesome_notifications.error_background_color|default:''}";
            var AN_ERROR_TEXT_COLOR = "{$addons.awesome_notifications.error_text_color|default:''}";
        </script>
    {/if}
{/if}