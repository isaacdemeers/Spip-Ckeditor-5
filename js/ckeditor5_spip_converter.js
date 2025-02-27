/**
 * CKEditor 5 - SPIP Converter
 * 
 * Ce fichier contient des fonctions pour convertir entre le format SPIP et le format HTML
 * utilisé par CKEditor 5, selon la documentation officielle SPIP.
 * Basé sur https://www.pyrat.net/Raccourcis-Typographiques-de-SPIP-mode-d-emploi.html
 */

// Objet global pour contenir nos fonctions de conversion
const SpipConverter = {
    /**
     * Convertit le texte au format SPIP en HTML pour l'éditeur
     * @param {string} spipText - Texte au format SPIP
     * @return {string} - Texte au format HTML pour CKEditor
     */
    spipToHtml: function (spipText) {
        if (!spipText) return '';

        let html = spipText;

        // Sauvegarder temporairement les balises HTML déjà présentes
        const htmlTags = [];
        html = html.replace(/<([^>]+)>/g, function (match) {
            htmlTags.push(match);
            return "##HTML_TAG_" + (htmlTags.length - 1) + "##";
        });

        // Conversion des titres SPIP (intertitres)
        // Traiter d'abord les titres avec des étoiles pour éviter les conflits
        html = html.replace(/\{\{\{\*\*\*\*\*([^{}]*?)\}\}\}/g, '<h6>$1</h6>');
        html = html.replace(/\{\{\{\*\*\*\*([^{}]*?)\}\}\}/g, '<h5>$1</h5>');
        html = html.replace(/\{\{\{\*\*\*([^{}]*?)\}\}\}/g, '<h4>$1</h4>');
        html = html.replace(/\{\{\{\*\*([^{}]*?)\}\}\}/g, '<h3>$1</h3>');
        html = html.replace(/\{\{\{\*([^{}]*?)\}\}\}/g, '<h2>$1</h2>');

        // Puis traiter les titres standards
        html = html.replace(/\{\{\{([^{}*][^{}]*?)\}\}\}/g, '<h1>$1</h1>');

        // Ancienne syntaxe des titres (au cas où)
        html = html.replace(/{\*\*\*(.*?)\*\*\*}/g, '<h3>$1</h3>');
        html = html.replace(/{\*\*(.*?)\*\*}/g, '<h2>$1</h2>');
        html = html.replace(/{\*(.*?)\*}/g, '<h1>$1</h1>');

        // Conversion des styles de texte SPIP
        // {{texte}} = gras
        html = html.replace(/\{\{([^{}]*?)\}\}/g, '<strong>$1</strong>');
        // {texte} = italique
        html = html.replace(/\{([^{}]*?)\}/g, '<em>$1</em>');
        // [texte] = italique (syntaxe alternative selon la doc)
        html = html.replace(/\[([^\[\]<>-]*?)\]/g, '<em>$1</em>');
        // [-texte-] = texte barré
        html = html.replace(/\[-([^\[\]]*?)-\]/g, '<del>$1</del>');
        // [*texte*] = mise en évidence
        html = html.replace(/\[\*([^\[\]]*?)\*\]/g, '<mark>$1</mark>');

        // Conversion des liens SPIP
        // [texte->url] = lien
        html = html.replace(/\[([^\[\]]*?)->([^\[\]]*?)\]/g, '<a href="$2">$1</a>');
        // [texte|info bulle->url] = lien avec bulle d'aide
        html = html.replace(/\[([^\[\]]*?)\|([^\[\]]*?)->([^\[\]]*?)\]/g, '<a href="$3" title="$2">$1</a>');

        // Conversion des listes SPIP
        // Traiter les listes ordonnées (-# item)
        let listItems = [];
        let inOrderedList = false;
        html = html.split('\n').map(line => {
            if (line.match(/^-# (.*)/)) {
                const content = line.replace(/^-# (.*)/, '$1');
                if (!inOrderedList) {
                    inOrderedList = true;
                    listItems = [`<li>${content}</li>`];
                    return '<ol>';
                } else {
                    listItems.push(`<li>${content}</li>`);
                    return '';
                }
            } else if (inOrderedList) {
                inOrderedList = false;
                return listItems.join('') + '</ol>\n' + line;
            } else {
                return line;
            }
        }).join('\n');

        // Traiter les listes non ordonnées (-* item)
        listItems = [];
        let inUnorderedList = false;
        html = html.split('\n').map(line => {
            if (line.match(/^-\* (.*)/)) {
                const content = line.replace(/^-\* (.*)/, '$1');
                if (!inUnorderedList) {
                    inUnorderedList = true;
                    listItems = [`<li>${content}</li>`];
                    return '<ul>';
                } else {
                    listItems.push(`<li>${content}</li>`);
                    return '';
                }
            } else if (inUnorderedList) {
                inUnorderedList = false;
                return listItems.join('') + '</ul>\n' + line;
            } else {
                return line;
            }
        }).join('\n');

        // Fermer les listes si elles sont encore ouvertes à la fin
        if (inOrderedList) {
            html += listItems.join('') + '</ol>';
        }
        if (inUnorderedList) {
            html += listItems.join('') + '</ul>';
        }

        // Traitement amélioré des tableaux SPIP
        html = html.replace(/\|\|(.*?)(?:\|(.*?))?\|\|[\s\n]*((?:\|.*\|[\s\n]*)+)/g, function (match, title, description, tableRows) {
            title = title || '';
            description = description || '';

            let tableHTML = '<table class="spip">\n';

            // Ajouter le titre et la description si présents
            if (title.trim() || description.trim()) {
                tableHTML += `<caption>${title.trim()}`;
                if (description.trim()) {
                    tableHTML += `<br>${description.trim()}`;
                }
                tableHTML += '</caption>\n';
            }

            // Traiter les lignes du tableau
            const rows = tableRows.trim().split('\n');

            rows.forEach(row => {
                if (!row.trim() || !row.includes('|')) return;

                tableHTML += '<tr>\n';

                // Diviser la ligne en cellules
                const cells = row.split('|').filter(cell => cell !== '');

                cells.forEach(cell => {
                    const cellContent = cell.trim();

                    // Vérifier si c'est une cellule d'en-tête (contenu entre {{ }})
                    const headerMatch = cellContent.match(/^\s*\{\{(.*?)\}\}\s*$/);

                    if (headerMatch) {
                        // Cellule d'en-tête
                        tableHTML += `  <th>${headerMatch[1]}</th>\n`;
                    } else if (cellContent === '<') {
                        // Fusion avec la cellule de gauche (ignorée)
                        tableHTML += '';
                    } else if (cellContent === '^') {
                        // Fusion avec la cellule du dessus (ignorée)
                        tableHTML += '';
                    } else {
                        // Cellule normale
                        tableHTML += `  <td>${cellContent}</td>\n`;
                    }
                });

                tableHTML += '</tr>\n';
            });

            tableHTML += '</table>';
            return tableHTML;
        });

        // Traitement des citations
        // <quote>texte</quote> = blockquote
        html = html.replace(/<quote>([\s\S]*?)<\/quote>/gi, '<blockquote>$1</blockquote>');

        // Traitement de la poésie
        // <poesie>texte</poesie> = pre avec class="spip_poesie"
        html = html.replace(/<poesie>([\s\S]*?)<\/poesie>/gi, '<pre class="spip_poesie">$1</pre>');

        // Traitement des cadres
        // <cadre>texte</cadre> = pre avec class="spip_cadre"
        html = html.replace(/<cadre>([\s\S]*?)<\/cadre>/gi, '<pre class="spip_cadre">$1</pre>');

        // Alignement de paragraphes
        // [|texte|] = paragraphe centré
        html = html.replace(/\[\|([\s\S]*?)\|\]/g, '<div style="text-align:center">$1</div>');
        // [/texte/] = paragraphe aligné à droite
        html = html.replace(/\[\/([\s\S]*?)\/\]/g, '<div style="text-align:right">$1</div>');
        // [(texte)] = paragraphe encadré
        html = html.replace(/\[\(([\s\S]*?)\)\]/g, '<div class="spip_encadrer">$1</div>');

        // Restaurer les balises HTML
        html = html.replace(/##HTML_TAG_(\d+)##/g, function (match, index) {
            return htmlTags[parseInt(index)];
        });

        // Conversion des caractères spéciaux SPIP
        html = html.replace(/-->/g, '→');
        html = html.replace(/<--/g, '←');
        html = html.replace(/<-->/g, '↔');
        html = html.replace(/==>/g, '⇒');
        html = html.replace(/<==/g, '⇐');
        html = html.replace(/<==>/g, '⇔');
        html = html.replace(/\s--\s/g, ' — ');
        html = html.replace(/\.\.\./g, '…');
        html = html.replace(/\(c\)/gi, '©');
        html = html.replace(/\(r\)/gi, '®');
        html = html.replace(/\(tm\)/gi, '™');

        // Ligne horizontale
        html = html.replace(/\n----\n/g, '<hr>');

        // Conversion des paragraphes (les lignes vides séparent les paragraphes)
        html = html.replace(/\n\s*\n/g, '</p><p>');

        // Envelopper le contenu dans des paragraphes si ce n'est pas déjà fait
        if (!html.startsWith('<')) {
            html = '<p>' + html + '</p>';
        }

        // Correction pour les paragraphes vides
        html = html.replace(/<p>\s*<\/p>/g, '<p>&nbsp;</p>');

        console.log("HTML converti pour l'éditeur:", html);
        return html;
    },

    /**
     * Convertit le texte HTML de l'éditeur en format SPIP
     * @param {string} html - Texte au format HTML de CKEditor
     * @return {string} - Texte au format SPIP
     */
    htmlToSpip: function (html) {
        if (!html) return '';

        console.log("HTML à convertir en SPIP:", html);
        let spipText = html;

        // Conversion des titres HTML en SPIP
        spipText = spipText.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '{{{$1}}}');
        spipText = spipText.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '{{{*$1}}}');
        spipText = spipText.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '{{{**$1}}}');
        spipText = spipText.replace(/<h4[^>]*>(.*?)<\/h4>/gi, '{{{***$1}}}');
        spipText = spipText.replace(/<h5[^>]*>(.*?)<\/h5>/gi, '{{{****$1}}}');
        spipText = spipText.replace(/<h6[^>]*>(.*?)<\/h6>/gi, '{{{*****$1}}}');

        // Conversion des styles de texte HTML en SPIP
        spipText = spipText.replace(/<strong[^>]*>(.*?)<\/strong>/gi, '{{$1}}');
        spipText = spipText.replace(/<b[^>]*>(.*?)<\/b>/gi, '{{$1}}');
        spipText = spipText.replace(/<em[^>]*>(.*?)<\/em>/gi, '{$1}');
        spipText = spipText.replace(/<i[^>]*>(.*?)<\/i>/gi, '{$1}');
        spipText = spipText.replace(/<mark[^>]*>(.*?)<\/mark>/gi, '[*$1*]');
        spipText = spipText.replace(/<del[^>]*>(.*?)<\/del>/gi, '[-$1-]');
        spipText = spipText.replace(/<s[^>]*>(.*?)<\/s>/gi, '[-$1-]');

        // Conversion des liens HTML en SPIP
        spipText = spipText.replace(/<a[^>]*href="([^"]*?)"[^>]*title="([^"]*?)"[^>]*>(.*?)<\/a>/gi, '[$3|$2->$1]');
        spipText = spipText.replace(/<a[^>]*href="([^"]*?)"[^>]*>(.*?)<\/a>/gi, '[$2->$1]');

        // Conversion des listes HTML en SPIP
        // Traiter les listes non ordonnées
        spipText = spipText.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, function (match, listContent) {
            let items = listContent.match(/<li[^>]*>([\s\S]*?)<\/li>/gi);
            if (!items) return match;

            return items.map(item => {
                return '-* ' + item.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, '$1').trim();
            }).join('\n');
        });

        // Traiter les listes ordonnées
        spipText = spipText.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi, function (match, listContent) {
            let items = listContent.match(/<li[^>]*>([\s\S]*?)<\/li>/gi);
            if (!items) return match;

            return items.map(item => {
                return '-# ' + item.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, '$1').trim();
            }).join('\n');
        });

        // Conversion des tableaux HTML en SPIP - Version améliorée
        spipText = spipText.replace(/<table[^>]*>([\s\S]*?)<\/table>/gi, function (match, tableContent) {
            let spipTable = '';
            let hasCaption = false;
            let title = '';
            let description = '';

            // Extraire le titre et la description si présents
            const captionMatch = tableContent.match(/<caption[^>]*>([\s\S]*?)<\/caption>/i);
            if (captionMatch) {
                hasCaption = true;
                const captionContent = captionMatch[1];
                const brMatch = captionContent.match(/(.*?)<br\s*\/?>(.*)/i);

                if (brMatch) {
                    title = brMatch[1].trim();
                    description = brMatch[2].trim();
                } else {
                    title = captionContent.trim();
                }

                spipTable = `||${title}|${description}||\n`;

                // Supprimer la caption du contenu pour éviter de la traiter deux fois
                tableContent = tableContent.replace(/<caption[^>]*>[\s\S]*?<\/caption>/i, '');
            } else {
                // Tableau sans titre
                spipTable = "||\n";
            }

            // Extraire les lignes du tableau
            const rows = tableContent.match(/<tr[^>]*>([\s\S]*?)<\/tr>/gi);
            if (!rows) return match;

            rows.forEach(row => {
                spipTable += '|';

                // Extraire les cellules d'en-tête
                const headerCells = row.match(/<th[^>]*>([\s\S]*?)<\/th>/gi);
                if (headerCells && headerCells.length > 0) {
                    headerCells.forEach(cell => {
                        const content = cell.replace(/<th[^>]*>([\s\S]*?)<\/th>/gi, '$1').trim();
                        const cleanContent = content.replace(/<[^>]+>/g, '');
                        spipTable += ` {{${cleanContent}}} |`;
                    });
                }

                // Extraire les cellules de données
                const dataCells = row.match(/<td[^>]*>([\s\S]*?)<\/td>/gi);
                if (dataCells && dataCells.length > 0) {
                    dataCells.forEach(cell => {
                        const content = cell.replace(/<td[^>]*>([\s\S]*?)<\/td>/gi, '$1').trim();
                        const cleanContent = content.replace(/<[^>]+>/g, '');
                        spipTable += ` ${cleanContent} |`;
                    });
                }

                spipTable += '\n';
            });

            return spipTable;
        });

        // Conversion des citations
        spipText = spipText.replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, '<quote>$1</quote>');

        // Conversion des poésies et cadres
        spipText = spipText.replace(/<pre[^>]*class="spip_poesie"[^>]*>([\s\S]*?)<\/pre>/gi, '<poesie>$1</poesie>');
        spipText = spipText.replace(/<pre[^>]*class="spip_cadre"[^>]*>([\s\S]*?)<\/pre>/gi, '<cadre>$1</cadre>');

        // Conversion des alignements
        spipText = spipText.replace(/<div[^>]*style="text-align:center"[^>]*>([\s\S]*?)<\/div>/gi, '[|$1|]');
        spipText = spipText.replace(/<div[^>]*style="text-align:right"[^>]*>([\s\S]*?)<\/div>/gi, '[/$1/]');
        spipText = spipText.replace(/<div[^>]*class="spip_encadrer"[^>]*>([\s\S]*?)<\/div>/gi, '[($1)]');

        // Conversion des caractères spéciaux HTML en SPIP
        spipText = spipText.replace(/→/g, '-->');
        spipText = spipText.replace(/←/g, '<--');
        spipText = spipText.replace(/↔/g, '<-->');
        spipText = spipText.replace(/⇒/g, '==>');
        spipText = spipText.replace(/⇐/g, '<==');
        spipText = spipText.replace(/⇔/g, '<==>');
        spipText = spipText.replace(/—/g, '--');
        spipText = spipText.replace(/…/g, '...');
        spipText = spipText.replace(/©/g, '(c)');
        spipText = spipText.replace(/®/g, '(r)');
        spipText = spipText.replace(/™/g, '(tm)');

        // Conversion des lignes horizontales
        spipText = spipText.replace(/<hr[^>]*>/gi, '\n----\n');

        // Conversion des paragraphes HTML en SPIP
        spipText = spipText.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, '$1\n\n');

        // Nettoyage des balises HTML restantes
        spipText = spipText.replace(/<[^>]+>/g, '');

        // Nettoyage des espaces et sauts de ligne superflus
        spipText = spipText.replace(/\n{3,}/g, '\n\n');
        spipText = spipText.trim();

        // Remplacer les espaces insécables par des espaces normaux
        spipText = spipText.replace(/&nbsp;/g, ' ');

        // Décodage des entités HTML
        spipText = this.decodeHtmlEntities(spipText);

        console.log("Texte SPIP converti:", spipText);
        return spipText;
    },

    /**
     * Décode les entités HTML
     * @param {string} text - Texte contenant des entités HTML
     * @return {string} - Texte avec entités décodées
     */
    decodeHtmlEntities: function (text) {
        const textarea = document.createElement('textarea');
        textarea.innerHTML = text;
        return textarea.value;
    },

    /**
     * Initialise la conversion SPIP pour les textareas
     * @param {HTMLElement} textarea - L'élément textarea à convertir
     * @param {Object} editor - L'instance CKEditor associée
     */
    initForTextarea: function (textarea, editor) {
        // Convertir le contenu SPIP en HTML lors de l'initialisation
        const originalSpipContent = textarea.value;
        if (originalSpipContent.trim()) {
            const htmlContent = this.spipToHtml(originalSpipContent);
            editor.setData(htmlContent);
        }

        // Désactiver la conversion Markdown automatique si elle est activée
        if (editor.plugins && editor.plugins.has('Markdown')) {
            console.log("Désactivation de la conversion Markdown automatique");
            // Essayer de désactiver le plugin Markdown
            try {
                editor.plugins.get('Markdown').isEnabled = false;
            } catch (e) {
                console.warn("Impossible de désactiver le plugin Markdown:", e);
            }
        }

        // Convertir le contenu HTML en SPIP avant la soumission du formulaire
        const form = textarea.closest('form');
        if (form) {
            form.addEventListener('submit', () => {
                const htmlContent = editor.getData();
                const spipContent = this.htmlToSpip(htmlContent);
                textarea.value = spipContent;
                console.log("Formulaire soumis, contenu SPIP:", spipContent);
            });

            // Trouver tous les boutons de soumission
            const allButtons = form.querySelectorAll('input[type="submit"], button[type="submit"], .submit, .save, .bouton_action_post');
            allButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const htmlContent = editor.getData();
                    const spipContent = this.htmlToSpip(htmlContent);
                    textarea.value = spipContent;
                    console.log("Bouton cliqué, contenu SPIP:", spipContent);
                });
            });
        }
    }
};

// Exporter l'objet SpipConverter
window.SpipConverter = SpipConverter; 