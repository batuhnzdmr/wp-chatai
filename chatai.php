<?php

/*
 * Plugin Name:         ChatAI
 * Plugin URI:          https://hostibu.com
 * Description:         ChatAI adds a GPT5 AI-powered virtual assistant to your website.
 * Version:             1.0
 * Author:              batuhnzdmr
 * Author URI:          https://batuhnzdmr.me
 */

// Güvenlik kontrolü
if(!defined('ABSPATH')) exit;

// Include files
require_once plugin_dir_path(__FILE__) . 'includes/activation.php';
require_once plugin_dir_path(__FILE__) . 'includes/deactivation.php';

// Hooks
register_activation_hook(__FILE__, 'chatai_activate');
register_deactivation_hook(__FILE__, 'chatai_deactivate');

// Frontend CSS & JS
add_action('wp_enqueue_scripts', function()
{
    // Custom CSS
    wp_enqueue_style('chatai-style', plugin_dir_url(__FILE__) . 'assets/css/style.css');

    // Custom JS
    wp_enqueue_script('chatai-js', plugin_dir_url(__FILE__) . 'assets/js/chat.js', array('jquery'), null, true);

    // FontAwesome Support
    wp_enqueue_script(
        'fontawesome-kit', // Scriptin adı (id)
        'https://kit.fontawesome.com/d298d7997d.js', // Link
        array(), // Bağımlılıklar (yok)
        null, // Versiyon (yok)
        false // False = Head'e ekle, True = Footer'a ekle
    );
});

// Add interface to the footer
function add_chat_box()
{
?>
    
    <div id="toggle-chat-box">
        <i class="fa-solid fa-comments"></i>
    </div>

    <div id="chat-box" style="display: none;">
        <div class="chat-header">
            <h3>Canlı Sohbet</h3>
            <span class="chat-close-button"><i class="fa-solid fa-xmark"></i></span>
        </div>
        
        <div id="chat-message-box">
            <div class="message bot-message">Merhaba! Size nasıl yardımcı olabiliriz?</div>
        </div>

        <div class="chat-input-box">
            <input type="text" id="chat-input" placeholder="Bir şeyler yaz...">
            <button id="chat-submit-button"><i class="fa-solid fa-paper-plane"></i></button>
        </div>
    </div>

<?php
}

// Bu fonksiyonu footer'a kancalıyoruz
add_action('wp_footer', 'add_chat_box');






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