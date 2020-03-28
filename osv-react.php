<?php
// This file enqueues scripts and styles

defined( 'ABSPATH' ) or die( 'Direct script access disallowed.' );

add_action( 'init', function() {
    add_action('wp_head', function() {
        ?>
        <script>
        var osv_react_wp = {
            user_id: '<?php echo get_current_user_id(); ?>',
            post_id: '<?php echo get_the_ID(); ?>',
        };
    </script>
        <?php
    });


    add_filter( 'script_loader_tag', function( $tag, $handle ) {
        if ( ! preg_match( '/^erw-/', $handle ) ) { return $tag; }
        return str_replace( ' src', ' async defer src', $tag );
    }, 10, 2 );

    add_action( 'wp_enqueue_scripts', "osv_react_enqueue_scripts");
    add_action( 'admin_enqueue_scripts', "osv_react_enqueue_scripts");


    add_shortcode( 'osv-guide-quotes-admin', function( $atts ) {
        $default_atts = array(
            'user_id' => get_current_user_id()
        );
        $args = shortcode_atts( $default_atts, $atts );
        return "<div id='osv-guide-quotes-admin' data-user_id='{$args['user_id']}'></div>";
    });

    add_shortcode( 'osv-garage', function( $atts ) {
        $default_atts = array(
            'user_id' => get_current_user_id()
        );
        $args = shortcode_atts( $default_atts, $atts );
        return "<div id='osv-garage' data-user_id='{$args['user_id']}'></div>";
    });

    add_shortcode( 'osv-guide-quotes', function( $atts ) {
        $default_atts = array(
            'user_id' => get_current_user_id(),
            'seomake' => '',
            'seomodel' => '',
        );
        $args = shortcode_atts( $default_atts, $atts );
        return "<div id='osv-guide-quotes' data-seomake='{$args['seomake']}' data-seomodel='{$args['seomodel']}'></div>";
    });

});


function osv_react_enqueue_scripts() {
    $asset_manifest = json_decode( file_get_contents( __DIR__ . '/build/asset-manifest.json' ), true )['files'];

    if ( isset( $asset_manifest[ 'main.css' ] ) ) {
        wp_enqueue_style( 'erw', get_site_url() . $asset_manifest[ 'main.css' ] );
    }

    wp_enqueue_script( 'erw-runtime', get_site_url() . $asset_manifest[ 'runtime-main.js' ], array(), null, true );

    wp_enqueue_script( 'erw-main', get_site_url() . $asset_manifest[ 'main.js' ], array('erw-runtime'), null, true );

    foreach ( $asset_manifest as $key => $value ) {
        if ( preg_match( '@static/js/(.*)\.chunk\.js@', $key, $matches ) ) {
            if ( $matches && is_array( $matches ) && count( $matches ) === 2 ) {
                $name = "erw-" . preg_replace( '/[^A-Za-z0-9_]/', '-', $matches[1] );
                wp_enqueue_script( $name, get_site_url() . $value, array( 'erw-main' ), null, true );
            }
        }

        if ( preg_match( '@static/css/(.*)\.chunk\.css@', $key, $matches ) ) {
            if ( $matches && is_array( $matches ) && count( $matches ) == 2 ) {
                $name = "erw-" . preg_replace( '/[^A-Za-z0-9_]/', '-', $matches[1] );
                wp_enqueue_style( $name, get_site_url() . $value, array( 'erw' ), null );
            }
        }
    }
    echo __FILE__ . "\n";
echo plugin_dir_url(__FILE__);
    die;
    wp_register_script('osv-react-script', plugin_dir_url(__FILE__) . 'osv-react.js' , []);
    wp_enqueue_script('osv-react-script');

    wp_localize_script( 'osv-react-script', 'osv_wp_auth', [
        'post_id' => get_the_ID(),
        'user' => wp_get_current_user(),
        'ajaxurl' => admin_url( 'admin-ajax.php' ),
        'redirecturl' => home_url(),
        'loadingmessage' => __('Sending user info, please wait...')
    ]);

    add_action( 'wp_ajax_nopriv_osvajaxlogin', 'osv_ajax_login' );
}

function osv_ajax_login(){

    // First check the nonce, if it fails the function will break
    check_ajax_referer( 'ajax-login-nonce', 'security' );

    // Nonce is checked, get the POST data and sign user on
    $info = array();
    $info['user_login'] = $_POST['username'];
    $info['user_password'] = $_POST['password'];
    $info['remember'] = true;

    $user_signon = wp_signon( $info, false );
    if ( is_wp_error($user_signon) ){
        echo json_encode(array('loggedin'=>false, 'message'=>__('Wrong username or password.')));
    } else {
        echo json_encode(array('loggedin'=>true, 'message'=>__('Login successful, redirecting...')));
    }

    die();
}