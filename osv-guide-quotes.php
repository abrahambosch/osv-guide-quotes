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
        add_action('admin_enqueue_scripts', [$this, "osv_admin_scripts"]);

        add_action('show_user_profile', [$this, 'my_show_extra_profile_fields']);
        add_action('edit_user_profile', [$this, 'my_show_extra_profile_fields']);
        add_action('personal_options_update', [$this, 'my_save_extra_profile_fields']);
        add_action('edit_user_profile_update', [$this, 'my_save_extra_profile_fields']);

        add_action('init', function () {

            $this->handle_cors();

            add_filter('script_loader_tag', function ($tag, $handle) {
                if (!preg_match('/^erw-/', $handle)) {
                    return $tag;
                }
                return str_replace(' src', ' async defer src', $tag);
            }, 10, 2);

            add_shortcode('osv-guide-quotes-admin', function ($atts) {
                $default_atts = array();
                $args = shortcode_atts($default_atts, $atts);
                return "<div id='osv-guide-quotes-admin'></div>";
            });

            add_shortcode('osv-garage', function ($atts) {
                $default_atts = array();
                $args = shortcode_atts($default_atts, $atts);
                return "<div id='osv-garage'></div>";
            });

            // do_shortcode('[osv-login-button]');
            add_shortcode('osv-login-button', function ($atts) {
                $default_atts = array();
                $args = shortcode_atts($default_atts, $atts);
                return "<div id='osv-login-button'></div>";
            });

            add_shortcode('osv-guide-quotes', function ($atts) {
                $default_atts = array(
                    'seomake' => '',
                    'seomodel' => '',
                );
                $args = shortcode_atts($default_atts, $atts);
                return "<div id='osv-guide-quotes' data-seomake='{$args['seomake']}' data-seomodel='{$args['seomodel']}'></div>";
            });

            // don't show admin bar for subscriber level users.
            if (get_current_user_id() && $wp_user_level = get_user_meta(get_current_user_id(), 'wp_user_level',
                        true) == 0) {
                add_filter(‘show_admin_bar’, ‘__return_false’);
            }
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
            $phone = get_user_meta($userObj->ID, 'phone', true);
            $userArr = [
                'ID' => $userObj->ID,
                'user_id' => $userObj->ID,
                'user_login' => $userObj->user_login,
                'user_nicename' => $userObj->user_nicename,
                'user_email' => $userObj->user_email,
                'display_name' => $userObj->display_name,
                'phone' => $phone
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
            'lost_password_url' => wp_lostpassword_url(),
            'loadingmessage' => __('Sending user info, please wait...')
        ];
    }

    function get_password_reset_url($user_id)
    {
        $url = home_url('', 'http');
        $user = new WP_User((int)$user_id);
        $adt_rp_key = get_password_reset_key($user);
        $user_login = $user->user_login;
        return network_site_url("wp-login.php?action=rp&key=$adt_rp_key&login=" . rawurlencode($user_login), 'login');
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
    }

    public function osv_admin_scripts()
    {
        wp_register_style('osv-bootstrap', "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css");
        wp_enqueue_style('osv-bootstrap');
        wp_register_style('osv-bootstrap-theme',
            "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css", ['osv-bootstrap']);
        wp_enqueue_style('osv-bootstrap-theme');
        wp_enqueue_script('osv-bootstrap-js', "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js",
            array('jquery'), null, true);
    }

    function my_show_extra_profile_fields($user)
    { ?>
        <h3>Extra profile information</h3>
        <table class="form-table">
            <tr>
                <th><label for="phone">Phone Number</label></th>
                <td>
                    <input type="text" name="phone" id="phone"
                           value="<?php echo esc_attr(get_the_author_meta('phone', $user->ID)); ?>"
                           class="regular-text"/><br/>
                    <span class="description">Please enter your phone number.</span>
                </td>
            </tr>
        </table>
        <?php
    }

    function my_save_extra_profile_fields($user_id)
    {
        if (!current_user_can('edit_user', $user_id)) {
            return false;
        }
        update_user_meta($user_id, 'phone', $_POST['phone']);
    }
}
