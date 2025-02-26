<?php

function ckeditor5_header_prive($flux) {
    // Get the plugin URL with trailing slash
    $plugin_url = url_absolue(dirname(find_in_path('ckeditor5_pipelines.php')));
    if (substr($plugin_url, -1) !== '/') {
        $plugin_url .= '/';
    }
    
    // Set the paths for CKEditor and translations
    $flux .= '<script>
        // Set the correct paths for CKEditor
        window.ckeditor5_path = "' . $plugin_url . 'lib/ckeditor/ckeditor5.js";
        window.ckeditor5_translations_path = "' . $plugin_url . 'lib/ckeditor/translations/fr.js";
    </script>';
    
    // Load the initialization script
    $flux .= '<script type="module" src="' . url_absolue(find_in_path('js/ckeditor5_init.js')) . '"></script>';

    $flux .= '<link rel="stylesheet" href="' . url_absolue(find_in_path('lib/ckeditor/ckeditor5.css')) . '">';

    return $flux;
}


?>