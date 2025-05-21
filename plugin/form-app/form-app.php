<?php
/**
 * Plugin Name:         Form App
 * Plugin URI:          https://yourdomain/wherever-you-keep-the-app-readme-file
 * Description:         Some great app that I made and it's so great it'll make your life great!
 * Version:             1.0.0
 * Author:              Mustafa Al-Jailawi
 * Author URI:          https://stevewhitmore.gitlab.io 
 * 
 * Be sure to rename the folder this file is in and this file to match what your plugin will be called. The names must be the same so WordPress knows where to look.
 */

function load_vuescripts() {
    $plugin_url = plugin_dir_url( __FILE__ ); // Get the URL of the plugin's directory

    // Correct the path to the dist folder and the files inside it
    wp_enqueue_style( 'vue_wp_styles', $plugin_url . 'dist/assets/index-UyR_15CR.css' );
    wp_register_script( 'vue_wp_compiled', $plugin_url . 'dist/assets/index-DPJPKx-b.js', true);
    // wp_register_script( 'vue_wp_dependencies', $plugin_url . 'dist/assets/index-DBe_I43S.js', true );
    
}

add_action( 'wp_enqueue_scripts', 'load_vuescripts' );

function attach_vue() {
    wp_enqueue_script( 'vue_wp_compiled' );
    // wp_enqueue_script( 'vue_wp_dependencies' );

    return "<div id='app'>dev test</div>";
}

add_shortcode( 'vue_wp', 'attach_vue' );

add_filter('script_loader_tag', 'make_vue_script_module', 10, 3);
function make_vue_script_module($tag, $handle, $src) {
    if ($handle === 'vue_wp_compiled') {
        return '<script type="module" src="' . esc_url($src) . '"></script>';
    }
    return $tag;
}

?>