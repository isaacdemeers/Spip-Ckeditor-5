<?php

function ckeditor5_header_prive($flux) {
    // Utiliser la constante du plugin au lieu de calculer le chemin
    $plugin_url = _DIR_PLUGIN_CKEDITOR5;
    if (substr($plugin_url, -1) !== '/') {
        $plugin_url .= '/';
    }
    
    // Utiliser find_in_path pour les chemins des fichiers
    $ckeditor_js = find_in_path('lib/ckeditor/ckeditor5.js');
    $ckeditor_translations_js = find_in_path('lib/ckeditor/translations/fr.js');
    $ckeditor_css = find_in_path('lib/ckeditor/ckeditor5.css');
    $converter_js = find_in_path('js/ckeditor5_spip_converter.js');
    $init_js = find_in_path('js/ckeditor5_init.js');
    
    // Set the paths for CKEditor and translations
    $flux .= '<script>
        // Set the correct paths for CKEditor
        window.ckeditor5_path = "' . url_absolue($ckeditor_js) . '";
        window.ckeditor5_translations_path = "' . url_absolue($ckeditor_translations_js) . '";
    </script>';
    
    // Load the SPIP converter script first
    $flux .= '<script src="' . url_absolue($converter_js) . '"></script>';
    
    // Load the initialization script
    $flux .= '<script type="module" src="' . url_absolue($init_js) . '"></script>';

    $flux .= '<link rel="stylesheet" href="' . url_absolue($ckeditor_css) . '">';
    
    // Ajouter du CSS personnalisé pour améliorer l'affichage des titres
    $flux .= '<style>
        .ck-content h1 { font-size: 2em; margin-top: 1em; margin-bottom: 0.5em; }
        .ck-content h2 { font-size: 1.75em; margin-top: 0.9em; margin-bottom: 0.45em; }
        .ck-content h3 { font-size: 1.5em; margin-top: 0.8em; margin-bottom: 0.4em; }
        .ck-content h4 { font-size: 1.25em; margin-top: 0.7em; margin-bottom: 0.35em; }
        .ck-content h5 { font-size: 1.1em; margin-top: 0.6em; margin-bottom: 0.3em; }
        .ck-content h6 { font-size: 1em; margin-top: 0.5em; margin-bottom: 0.25em; }
        
        /* Styles pour les tableaux */
        .ck-content table.spip { border-collapse: collapse; width: 100%; margin: 1em 0; }
        .ck-content table.spip caption { font-weight: bold; margin-bottom: 0.5em; }
        .ck-content table.spip th, .ck-content table.spip td { 
            border: 1px solid #ccc; 
            padding: 0.5em; 
            text-align: left; 
        }
        .ck-content table.spip th { background-color: #f0f0f0; }
    </style>';

    return $flux;
}

?>