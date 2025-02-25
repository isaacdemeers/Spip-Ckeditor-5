<?php
if (!defined('_ECRIRE_INC_VERSION')) {
    return;
}

/**
 * Insertion des styles nécessaires pour CKEditor 5 dans l'en-tête
 *
 * @param string $flux Le contenu HTML
 * @return string Le contenu HTML modifié
 */
function ckeditor5_insert_head($flux) {
    $flux .= '<link rel="stylesheet" href="' . find_in_path('lib/ckeditor/ckeditor5.css') . '" />';
    $flux .= '<script type="importmap">
    {
        "imports": {
            "ckeditor5": "' . find_in_path('lib/ckeditor/ckeditor5.js') . '",
            "ckeditor5/": "' . dirname(find_in_path('lib/ckeditor/ckeditor5.js')) . '/"
        }
    }
    </script>';
    
    return $flux;
}

/**
 * Insertion des styles CSS pour CKEditor
 *
 * @param string $flux Le contenu HTML
 * @return string Le contenu HTML modifié
 */
function ckeditor5_insert_head_css($flux) {
    // Ajoute des styles pour la transition
    $styles = '<style>
        .ckeditor-container { 
            margin-bottom: 1em; 
            position: relative;
        }
        .editor_container__word-count {
            margin-top: 5px;
            font-size: 0.9em;
            color: #666;
            text-align: right;
        }
        .editor_container__menu-bar {
            margin-bottom: 5px;
        }
        .ck-editor__editable {
            min-height: 300px;
        }
        /* Masquer les éléments de prévisualisation SPIP qui causent des conflits */
        .markItUpPreview, .markItUpTabs {
            display: none !important;
        }
    </style>';
    
    return $flux . $styles;
}

/**
 * Insertion du script d'initialisation en fin de page
 *
 * @param string $flux Le contenu HTML
 * @return string Le contenu HTML modifié
 */
function ckeditor5_insert_foot($flux) {
    $flux .= '<script type="module" src="' . find_in_path('js/ckeditor5_init.js') . '"></script>';
    return $flux;
}

/**
 * Remplace l'éditeur MarkItUp par CKEditor dans l'interface d'édition SPIP
 *
 * @param string $flux Le contenu HTML
 * @return string Le contenu HTML modifié
 */
function ckeditor5_affichage_final($flux) {
    // Vérifie si nous sommes dans une page d'édition avec MarkItUp
    if (strpos($flux, 'markItUp') !== false && strpos($flux, 'text_area') !== false) {
        // Ajoute les conteneurs pour CKEditor
        $wordCountDiv = '<div id="editor-word-count" class="editor_container__word-count"></div>';
        $menuBarDiv = '<div id="editor-menu-bar" class="editor_container__menu-bar"></div>';
        
        // Préserve les attributs importants du textarea original
        $pattern = '/<textarea[^>]*?id="text_area"[^>]*?name="([^"]*)"[^>]*?>(.*?)<\/textarea>/s';
        preg_match($pattern, $flux, $matches);
        
        if (!empty($matches)) {
            $textareaName = isset($matches[1]) ? $matches[1] : 'texte';
            $textareaContent = isset($matches[2]) ? $matches[2] : '';
            
            // Remplace la structure MarkItUp par CKEditor
            $pattern = '/<div class="markItUp.*?<textarea.*?id="text_area".*?>.*?<\/textarea>.*?<\/div><\/div><\/div>/s';
            $replacement = '<div class="ckeditor-container">
                <textarea id="text_area" name="' . $textareaName . '" class="editor">' . $textareaContent . '</textarea>
                ' . $menuBarDiv . '
                ' . $wordCountDiv . '
            </div>';
            
            $flux = preg_replace($pattern, $replacement, $flux);
        }
        
        // Ajoute le script d'initialisation juste avant la fermeture du body
        if (strpos($flux, '</body>') !== false && strpos($flux, 'ckeditor5_init.js') === false) {
            $scriptTag = '<script type="module" src="' . find_in_path('js/ckeditor5_init.js') . '"></script>';
            $flux = str_replace('</body>', $scriptTag . '</body>', $flux);
        }
    }
    
    return $flux;
}

/**
 * Désactive les scripts de MarkItUp pour éviter les conflits
 *
 * @param string $flux Le contenu HTML
 * @return string Le contenu HTML modifié
 */
function ckeditor5_header_prive($flux) {
    // Ajoute un script pour désactiver MarkItUp et autres scripts SPIP qui causent des conflits
    $script = '<script type="text/javascript">
        document.addEventListener("DOMContentLoaded", function() {
            // Désactive l\'initialisation de MarkItUp
            if (typeof jQuery !== "undefined") {
                // Désactive les fonctions qui causent des erreurs
                jQuery.fn.markItUp = function() { return this; };
                jQuery.fn.previsu_spip = function() { return this; };
                jQuery.fn.barre_previsualisation = function() { return this; };
                
                // Empêche l\'exécution de la fonction barrebouilles
                window.barrebouilles = function() { return; };
                
                // Supprime les gestionnaires d\'événements sur le textarea
                setTimeout(function() {
                    if (jQuery("#text_area").length) {
                        jQuery("#text_area").off();
                    }
                }, 100);
            }
        });
    </script>';
    
    return $flux . $script;
}
?> 