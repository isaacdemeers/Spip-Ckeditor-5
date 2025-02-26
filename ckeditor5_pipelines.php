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
    
    // Load the SPIP converter script first
    $flux .= '<script src="' . url_absolue(find_in_path('js/ckeditor5_spip_converter.js')) . '"></script>';
    
    // Load the initialization script
    $flux .= '<script type="module" src="' . url_absolue(find_in_path('js/ckeditor5_init.js')) . '"></script>';

    $flux .= '<link rel="stylesheet" href="' . url_absolue(find_in_path('lib/ckeditor/ckeditor5.css')) . '">';
    
    // Ajouter du CSS personnalisé pour améliorer l'affichage des titres
    $flux .= '<style>
        .ck-content h1 { font-size: 2em; margin-top: 1em; margin-bottom: 0.5em; }
        .ck-content h2 { font-size: 1.75em; margin-top: 0.9em; margin-bottom: 0.45em; }
        .ck-content h3 { font-size: 1.5em; margin-top: 0.8em; margin-bottom: 0.4em; }
        .ck-content h4 { font-size: 1.25em; margin-top: 0.7em; margin-bottom: 0.35em; }
        .ck-content h5 { font-size: 1.1em; margin-top: 0.6em; margin-bottom: 0.3em; }
        .ck-content h6 { font-size: 1em; margin-top: 0.5em; margin-bottom: 0.25em; }
    </style>';

    return $flux;
}


?>