<?php

// Güvenlik kontrolü
if(!defined('WP_UNINSTALL_PLUGIN')) exit;

// Eklenti kaldırıldığında çalışacak fonksiyon
function chatai_uninstall()
{
    //delete_option('chatai_version');
}

?>