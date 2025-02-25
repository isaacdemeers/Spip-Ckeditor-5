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
    // Utiliser la version CDN de CKEditor pour tester
    $flux .= "<!-- Début des ressources CKEditor 5 (CDN) -->\n";
    $flux .= '<link rel="stylesheet" href="https://cdn.ckeditor.com/ckeditor5/36.0.1/classic/ckeditor.css" />';
    $flux .= '<script src="https://cdn.ckeditor.com/ckeditor5/36.0.1/classic/ckeditor.js"></script>';
    $flux .= "<!-- Fin des ressources CKEditor 5 -->\n";
    
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
        /* Masquer le textarea original une fois CKEditor chargé */
        .ck-editor + textarea {
            display: none;
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
    $ckeditor_init_js = find_in_path('js/ckeditor5_init.js');
    
    if ($ckeditor_init_js) {
        $flux .= "<!-- Initialisation de CKEditor 5 -->\n";
        $flux .= '<script src="' . $ckeditor_init_js . '"></script>';
        $flux .= "<!-- Fin de l'initialisation de CKEditor 5 -->\n";
    } else {
        $flux .= "<!-- ERREUR: Script d'initialisation CKEditor non trouvé! -->\n";
    }
    
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
                <div id="ckeditor-debug" style="color: #999; font-size: 11px; margin-top: 5px;">CKEditor 5 en cours de chargement...</div>
            </div>';
            
            $flux = preg_replace($pattern, $replacement, $flux);
        }
        
        // Ajoute un script d'initialisation directement dans la page
        $init_script = '<script>
            document.addEventListener("DOMContentLoaded", function() {
                console.log("Vérification de l\'éditeur dans la page");
                if (typeof ClassicEditor !== "undefined") {
                    console.log("ClassicEditor est disponible, tentative d\'initialisation directe");
                    setTimeout(function() {
                        var textarea = document.getElementById("text_area");
                        if (textarea) {
                            ClassicEditor.create(textarea, {
                                toolbar: ["bold", "italic", "link"]
                            }).then(function(editor) {
                                console.log("Éditeur initialisé avec succès via script inline");
                            }).catch(function(error) {
                                console.error("Erreur lors de l\'initialisation:", error);
                            });
                        } else {
                            console.error("Textarea non trouvé");
                        }
                    }, 500);
                } else {
                    console.error("ClassicEditor n\'est pas disponible");
                }
            });
        </script>';
        
        // Insérer le script juste avant la fermeture du body
        $flux = str_replace('</body>', $init_script . '</body>', $flux);
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
    $script = '<script>
        document.addEventListener("DOMContentLoaded", function() {
            console.log("Désactivation des scripts SPIP conflictuels");
            // Désactive l\'initialisation de MarkItUp
            if (typeof jQuery !== "undefined") {
                // Désactive les fonctions qui causent des erreurs
                jQuery.fn.markItUp = function() { console.log("markItUp désactivé"); return this; };
                jQuery.fn.previsu_spip = function() { console.log("previsu_spip désactivé"); return this; };
                jQuery.fn.barre_previsualisation = function() { console.log("barre_previsualisation désactivé"); return this; };
                
                // Empêche l\'exécution de la fonction barrebouilles
                window.barrebouilles = function() { console.log("barrebouilles désactivé"); return; };
                
                // Supprime les gestionnaires d\'événements sur le textarea
                setTimeout(function() {
                    if (jQuery("#text_area").length) {
                        jQuery("#text_area").off();
                        console.log("Événements désactivés sur #text_area");
                    }
                }, 100);
            }
        });
    </script>';
    
    return $flux . $script;
}
?> 