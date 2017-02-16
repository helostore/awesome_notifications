{style src="addons/awesome_notifications/backend.less"}
{style src="addons/awesome_notifications/animate.css"}
{style src="addons/awesome_notifications/styles.less"}

{* We call this in styles.post.tpl so it can run before the fn_get_notifications() in common/notifaction.tpl. fn_get_notifications() once called, removes the transient notifications *}
{if !"AJAX_REQUEST"|defined}
    <script type="text/javascript">
        var awesomeNotifications = {json_encode(fn_get_notifications()) nofilter};
    </script>
{/if}