<?php

// Güvenlik kontrolü
if(!defined('ABSPATH')) exit;

function chatai_get_products() : Array
{
    if(!class_exists('WooCommerce'))
    {
        return array('Ürün bulunamadı.');
    }

    $args = array(
        'limit' => 10, // test amaçlı
    );

    $products = wc_get_products($args);
    $result = array();

    foreach ($products as $product)
    {
        $result[] = array(
            'id' => $product->get_id(),
            'name' => $product->get_name(),
            'price' => $product->get_price(),
        );
    }

    return $result;
}

?>