<?php
/**
 * HELOstore
 *
 * This source file is part of a commercial software. Only users who have purchased a valid license through
 * https://helostore.com/ and accepted to the terms of the License Agreement can install this product.
 *
 * @category   Add-ons
 * @package    HELOstore
 * @copyright  Copyright (c) 2017 HELOstore. (https://helostore.com/)
 * @license    https://helostore.com/legal/license-agreement/   License Agreement
 * @version    $Id$
 */

use Tygh\Registry;

if (!defined('BOOTSTRAP')) { die('Access denied'); }

function fn_awesome_notifications_settings_preview()
{

    $html = <<<EOD
<div id="container_addon_option_awesome_notifications_ease_out" class="control-group setting-wide awesome_notifications ">
    <label class="control-label "></label>
    <div class="controls">
        <a href="javascript:void(0);" onclick="return (typeof fn_awesome_notifications_preview === 'function' ? fn_awesome_notifications_preview(this) : false);">Preview</a>
    </div>
</div>
EOD;


    return $html;
};