<?php

/**
 * Plugin Name: OSV Quotes
 * Author: Abraham Bosch <abrahambosch@gmail.com>
 */


// This file enqueues scripts and styles

defined('ABSPATH') or die('Direct script access disallowed.');


new OsvGuideQuotesAdmin();

class OsvGuideQuotesAdmin
{
    public $slug = 'osv-guide-quotes';

    public function __construct()
    {
        $this->init();
    }



    public function admin_menu()
    {
        add_menu_page('OSV Guide Quotes', 'OSV Guide Quotes', 'manage_options', $this->slug, [$this, 'index_page'],
            'dashicons-admin-generic');
        add_submenu_page($this->slug, 'OSV Guide Quotes Page', 'OSV Guide Quotes Page', 'manage_options', $this->slug,
            [$this, 'index_page']);
    }

    protected function getVar(&$arr, $name, $default = "")
    {
        if (isset($arr[$name])) {
            return $arr[$name];
        }
        return $default;
    }

    public function index_page()
    {
        $this->printBootstrap();

        echo <<<__THIS
<div id='osv-guide-quotes-admin'>Guide Quotes Admin</div>
__THIS;

    }

    function init()
    {
        add_action('admin_menu', array($this, 'admin_menu'));
        add_action('wp_ajax_nopriv_osvajaxlogin', [$this, 'osv_ajax_login']);
        add_action('wp_ajax_osvajaxlogin', [$this, 'osv_ajax_login']);
        add_action('wp_enqueue_scripts', [$this, "osv_react_enqueue_scripts"]);
        add_action('admin_enqueue_scripts', [$this, "osv_react_enqueue_scripts"]);

        add_action('init', function () {

            $this->handle_cors();

            add_filter('script_loader_tag', function ($tag, $handle) {
                if (!preg_match('/^erw-/', $handle)) {
                    return $tag;
                }
                return str_replace(' src', ' async defer src', $tag);
            }, 10, 2);

            add_shortcode('osv-guide-quotes-admin', function ($atts) {
                $default_atts = array(
                    'user_id' => get_current_user_id()
                );
                $args = shortcode_atts($default_atts, $atts);
                return "<div id='osv-guide-quotes-admin' data-user_id='{$args['user_id']}'></div>";
            });

            add_shortcode('osv-garage', function ($atts) {
                $default_atts = array(
                    'user_id' => get_current_user_id()
                );
                $args = shortcode_atts($default_atts, $atts);
                return "<div id='osv-garage' data-user_id='{$args['user_id']}'></div>";
            });

            // do_shortcode('[osv-login-button]');
            add_shortcode('osv-login-button', function ($atts) {
                $default_atts = array(
                    'user_id' => get_current_user_id()
                );
                $args = shortcode_atts($default_atts, $atts);
                return "<div id='osv-login-button' data-user_id='{$args['user_id']}'></div>";
            });

            add_shortcode('osv-guide-quotes', function ($atts) {
                $default_atts = array(
                    'user_id' => get_current_user_id(),
                    'seomake' => '',
                    'seomodel' => '',
                );
                $args = shortcode_atts($default_atts, $atts);
                return "<div id='osv-guide-quotes' data-seomake='{$args['seomake']}' data-seomodel='{$args['seomodel']}'></div>";
            });
        });


    }


    function osv_react_enqueue_scripts()
    {
        $asset_manifest = json_decode(file_get_contents(__DIR__ . '/build/asset-manifest.json'), true)['files'];

        if (isset($asset_manifest['main.css'])) {
            wp_enqueue_style('erw', get_site_url() . $asset_manifest['main.css']);
        }

        wp_enqueue_script('erw-runtime', get_site_url() . $asset_manifest['runtime-main.js'], array(), null, true);

        wp_enqueue_script('erw-main', get_site_url() . $asset_manifest['main.js'], array('erw-runtime'), null, true);

        foreach ($asset_manifest as $key => $value) {
            if (preg_match('@static/js/(.*)\.chunk\.js@', $key, $matches)) {
                if ($matches && is_array($matches) && count($matches) === 2) {
                    $name = "erw-" . preg_replace('/[^A-Za-z0-9_]/', '-', $matches[1]);
                    wp_enqueue_script($name, get_site_url() . $value, array('erw-main'), null, true);
                }
            }

            if (preg_match('@static/css/(.*)\.chunk\.css@', $key, $matches)) {
                if ($matches && is_array($matches) && count($matches) == 2) {
                    $name = "erw-" . preg_replace('/[^A-Za-z0-9_]/', '-', $matches[1]);
                    wp_enqueue_style($name, get_site_url() . $value, array('erw'), null);
                }
            }
        }

        wp_register_script('osv-guide-quotes-script', plugin_dir_url(__FILE__) . 'osv-guide-quotes.js', []);
        wp_enqueue_script('osv-guide-quotes-script');

        wp_localize_script('osv-guide-quotes-script', 'osv_guide_quotes_wp', $this->osv_get_wp());

    }

    protected function getUserArr($userObj = null)
    {
        if (empty($userObj)) {
            $userObj = wp_get_current_user();
            if ($userObj->ID === 0) {
                $userObj = null;
            }
        }
        $userArr = null;
        if ($userObj) {
            $userArr = [
                'ID' => $userObj->ID,
                'user_id' => $userObj->ID,
                'user_login' => $userObj->user_login,
                'user_nicename' => $userObj->user_nicename,
                'user_email' => $userObj->user_email,
                'display_name' => $userObj->display_name,
            ];
        }
        return $userArr;
    }


    function osv_get_wp()
    {
        return [
            'nonce' => wp_create_nonce('ajax-login-nonce'),
            'post_id' => get_the_ID(),
            'user' => $this->getUserArr(),
            'ajaxurl' => admin_url('admin-ajax.php'),
            'resturl' => rest_url(''),
            'home_url' => home_url(),
            'logout_url' => wp_logout_url('/'),
            'lostPasswordUrl' => wp_lostpassword_url(),
            'loadingmessage' => __('Sending user info, please wait...')
        ];
    }

    function osv_ajax_login()
    {
        // First check the nonce, if it fails the function will break
        //check_ajax_referer('ajax-login-nonce', 'security');

        // Nonce is checked, get the POST data and sign user on
        $info = array();
        $info['user_login'] = $_POST['username'];
        $info['user_password'] = $_POST['password'];
        $info['remember'] = true;

        $user_signon = wp_signon($info, false);

        if (is_wp_error($user_signon)) {
            $this->osv_json_response([
                'status' => "ERROR",
                "error" => "Wrong username or password",
                'user_signon' => $user_signon
            ]);
        } else {
            $this->osv_json_response([
                'status' => "SUCCESS",
                "data" => [
                    "user" => $this->getUserArr($user_signon)
                ]
            ]);
        }
    }

    function osv_json_response($obj)
    {
        header("Content-Type: application/json");
        echo json_encode($obj);
        die;
    }

    function handle_cors()
    {
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Credentials: true");
        header("Access-Control-Allow-Methods: HEAD, GET, POST, PUT, PATCH, DELETE");
        header("Access-Control-Allow-Headers: Authorization, Origin, X-Requested-With, Content-Type, Accept");
        if ('OPTIONS' == $_SERVER['REQUEST_METHOD']) {
            if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS'])) {
                header("Access-Control-Allow-Headers: " . $_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']);
            }
            if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD'])) {
                header("Access-Control-Allow-Methods: HEAD, GET, POST, PUT, PATCH, DELETE");
            }
        }

        //add_filter( 'wp_headers', function ( $headers ) {
        //    $headers['Access-Control-Allow-Origin']      = get_http_origin(); // Can't use wildcard origin for credentials requests, instead set it to the requesting origin
        //    $headers['Access-Control-Allow-Credentials'] = 'true';
        //
        //    // Access-Control headers are received during OPTIONS requests
        //    if ( 'OPTIONS' == $_SERVER['REQUEST_METHOD'] ) {
        //
        //        if ( isset( $_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD'] ) ) {
        //            $headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS';
        //        }
        //
        //        if ( isset( $_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS'] ) ) {
        //            $headers['Access-Control-Allow-Headers'] = $_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS'];
        //        }
        //
        //    }
        //
        //    return $headers;
        //}, 11, 1 );

        //if ( 'OPTIONS' == $_SERVER['REQUEST_METHOD'] ) {
        //    header("Access-Control-Allow-Origin: *");
        //    header("Access-Control-Allow-Credentials: true");
        //    header("Access-Control-Allow-Headers: Authorization, Origin, X-Requested-With, Content-Type, Accept");
        //    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS'])) {
        //        header("Access-Control-Allow-Headers: " . $_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']);
        //
        //    }
        //    if ( isset( $_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD'] ) ) {
        //        header("Access-Control-Allow-Methods: HEAD, GET, POST, PUT, PATCH, DELETE");
        //    }
        //
        //    die;
        //}

    }

    protected function printBootstrap()
    {
        ?>
        <!-- Latest compiled and minified CSS -->
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"
              integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u"
              crossorigin="anonymous">

        <!-- Optional theme -->
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css"
              integrity="sha384-rHyoN1iRsVXV4nD0JutlnGaslCJuC7uwjduW9SVrLvRYooPp2bWYgmgJQIXwl/Sp"
              crossorigin="anonymous">

        <!-- Latest compiled and minified JavaScript -->
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"
                integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa"
                crossorigin="anonymous"></script>

        <?php

    }


}
