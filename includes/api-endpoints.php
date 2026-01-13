<?php

// Güvenlik kontrolü
if (!defined('ABSPATH')) exit;

add_action('rest_api_init', function ()
{
    // Test endpoint
    register_rest_route('chatai/v1', '/test', array(
        'methods' => 'GET',
        'callback' => function() {
            return array(
                'status' => 'success',
                'message' => 'ChatAI API çalışıyor!'
            );
        },
        'permission_callback' => '__return_true',
    ));

    // Örnek: ürün listeleme endpoint
    register_rest_route('chatai/v1', '/products', array(
        'methods' => 'GET',
        'callback' => function() {
            $products = chatai_get_products(); // product-functions.php içinden
            return $products;
        },
        'permission_callback' => '__return_true',
    ));
});

?>